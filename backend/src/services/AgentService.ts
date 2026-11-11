import fs from 'fs';
import path from 'path';
import { env } from '../config/env';
import type { Product } from '../entities/Product';
import { AppError, NotFoundError, ValidationError } from '../errors/AppError';
import type { AgentProfile, Guardrails, ProductInput, Repository } from '../types';

interface AnthropicResponse {
  content: { type: string; text?: string }[];
}

const PROFILE_FILES = ['estoque.json', 'reposicao.json', 'atendimento.json'];

export class AgentService {
  private readonly profiles = new Map<string, AgentProfile>();
  private readonly guardrails: Guardrails;

  constructor(private readonly productRepository: Repository<Product, ProductInput>) {
    // Os agentes e os guardrails ficam em arquivos JSON (pasta backend/agents)
    const dir = path.join(process.cwd(), 'agents');
    this.guardrails = this.readJson<Guardrails>(path.join(dir, 'guardrails.json'));
    for (const file of PROFILE_FILES) {
      const profile = this.readJson<AgentProfile>(path.join(dir, file));
      this.profiles.set(profile.id, profile);
    }
  }

  listProfiles(): { id: string; name: string; description: string }[] {
    return Array.from(this.profiles.values()).map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
    }));
  }

  async chat(agentId: unknown, message: unknown): Promise<{ agent: string; reply: string }> {
    const profile = typeof agentId === 'string' ? this.profiles.get(agentId) : undefined;
    if (!profile) throw new NotFoundError('Agente não encontrado.');

    const text = this.checkMessage(message);

    if (!env.anthropicKey) {
      throw new AppError('O agente está indisponível: a chave da API não foi configurada.', 503);
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': env.anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: profile.model,
        max_tokens: profile.maxTokens,
        system: await this.buildSystemPrompt(profile),
        messages: [{ role: 'user', content: text }],
      }),
    });

    if (!response.ok) {
      throw new AppError('Não foi possível consultar o agente agora. Tente novamente.', 502);
    }

    const data = (await response.json()) as AnthropicResponse;
    const reply = data.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text ?? '')
      .join('\n')
      .trim();

    // Guardrail de saída: limita o tamanho da resposta
    return { agent: profile.id, reply: reply.slice(0, this.guardrails.maxResponseChars) };
  }

  // Guardrails de entrada: tamanho máximo e termos proibidos
  private checkMessage(message: unknown): string {
    if (typeof message !== 'string' || message.trim() === '') {
      throw new ValidationError('Digite uma mensagem para o agente.');
    }
    const text = message.trim();
    if (text.length > this.guardrails.maxMessageLength) {
      throw new ValidationError(
        `A mensagem deve ter no máximo ${this.guardrails.maxMessageLength} caracteres.`,
      );
    }
    const lower = text.toLowerCase();
    if (this.guardrails.blockedTerms.some((term) => lower.includes(term.toLowerCase()))) {
      throw new ValidationError('Este assunto não pode ser tratado pelo agente.');
    }
    return text;
  }

  // Guardrail de comportamento: regras fixas no prompt + dados do estoque somente para leitura
  private async buildSystemPrompt(profile: AgentProfile): Promise<string> {
    const parts = [
      profile.systemPrompt,
      'Regras obrigatórias:',
      ...this.guardrails.rules.map((rule) => `- ${rule}`),
    ];

    if (profile.useStockData) {
      const page = await this.productRepository.findPage(1, 50);
      const lines = page.data.map(
        (p) =>
          `- ${p.name} | categoria: ${p.categoryName} | fornecedor: ${p.supplierName} | preço: R$ ${p.price.toFixed(2)} | estoque: ${p.quantity}`,
      );
      parts.push('Produtos cadastrados (somente leitura):', lines.length > 0 ? lines.join('\n') : 'Nenhum produto cadastrado.');
    }
    return parts.join('\n');
  }

  private readJson<T>(file: string): T {
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as T;
  }
}
