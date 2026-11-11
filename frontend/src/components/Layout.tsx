import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const links = [
  { to: '/', label: 'Início' },
  { to: '/categories', label: 'Categorias' },
  { to: '/suppliers', label: 'Fornecedores' },
  { to: '/products', label: 'Produtos' },
  { to: '/movements', label: 'Movimentações' },
  { to: '/profile', label: 'Meu perfil' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <>
      <nav className="navbar">
        <span className="brand">StockEasy</span>
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.to === '/'}>
            {link.label}
          </NavLink>
        ))}
        <span className="spacer" />
        <span style={{ color: '#fff' }}>{user?.name}</span>
        <button onClick={handleLogout}>Sair</button>
      </nav>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
