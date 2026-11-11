export class ApiError extends Error {}

// Função única para falar com o back-end (o Nginx encaminha /api para o Node)
export async function apiRequest<T>(path: string, method: string = 'GET', body?: unknown): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Não foi possível conectar ao servidor. Tente novamente.');
  }

  if (response.status === 204) return undefined as unknown as T;

  const data: { message?: string } | null = await response.json().catch(() => null);

  if (!response.ok) {
    // Token expirado: volta para o login (menos nas próprias rotas de login/cadastro)
    if (response.status === 401 && token && !path.startsWith('/auth')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw new ApiError(data?.message ?? 'Ocorreu um erro inesperado.');
  }

  return data as unknown as T;
}
