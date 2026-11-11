import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const { user } = useAuth();
  return (
    <div className="card">
      <h2>Olá, {user?.name}!</h2>
      <p>Bem-vindo ao StockEasy. Escolha uma área para começar:</p>
      <div className="home-grid">
        <Link to="/categories">Categorias</Link>
        <Link to="/suppliers">Fornecedores</Link>
        <Link to="/products">Produtos</Link>
        <Link to="/movements">Movimentações</Link>
      </div>
    </div>
  );
}
