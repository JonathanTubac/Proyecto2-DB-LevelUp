import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Products from './pages/admin/Products';
import Categories from './pages/admin/Categories';
import Providers from './pages/admin/Providers';
import Purchases from './pages/admin/Purchases';
import Wallets from './pages/admin/Wallets';
import Register from './pages/Register';

const AdminRoute = ({ children }) => (
  <ProtectedRoute roles={['Administrador']}>{children}</ProtectedRoute>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><Users /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><Products /></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><Categories /></AdminRoute>} />
          <Route path="/admin/providers" element={<AdminRoute><Providers /></AdminRoute>} />
          <Route path="/admin/purchases" element={<AdminRoute><Purchases /></AdminRoute>} />
          <Route path="/admin/wallets" element={<AdminRoute><Wallets /></AdminRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;