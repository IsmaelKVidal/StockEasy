import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import CategoryFormPage from './pages/categories/CategoryFormPage';
import CategoryListPage from './pages/categories/CategoryListPage';
import MovementFormPage from './pages/movements/MovementFormPage';
import MovementListPage from './pages/movements/MovementListPage';
import ProductFormPage from './pages/products/ProductFormPage';
import ProductListPage from './pages/products/ProductListPage';
import SupplierFormPage from './pages/suppliers/SupplierFormPage';
import SupplierListPage from './pages/suppliers/SupplierListPage';

export default function App() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Área logada */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/categories" element={<CategoryListPage />} />
          <Route path="/categories/new" element={<CategoryFormPage />} />
          <Route path="/categories/:id/edit" element={<CategoryFormPage />} />

          <Route path="/suppliers" element={<SupplierListPage />} />
          <Route path="/suppliers/new" element={<SupplierFormPage />} />
          <Route path="/suppliers/:id/edit" element={<SupplierFormPage />} />

          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/new" element={<ProductFormPage />} />
          <Route path="/products/:id/edit" element={<ProductFormPage />} />

          <Route path="/movements" element={<MovementListPage />} />
          <Route path="/movements/new" element={<MovementFormPage />} />
          <Route path="/movements/:id/edit" element={<MovementFormPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
