import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
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
import { CartProvider } from './context/CartContext';
import Store from './pages/client/Store';
import Profile from './pages/client/Profile';
import MyPurchases from './pages/client/MyPurchases';
import Report from './pages/client/Report';
import Unauthorized from './pages/Unauthorized';

// Administrador y Gerente: panel completo
const AdminRoute = ({ children }) => (
  <ProtectedRoute roles={['Administrador', 'Gerente']}>{children}</ProtectedRoute>
);

// Administrador, Gerente y Empleado: ventas
const VentasRoute = ({ children }) => (
  <ProtectedRoute roles={['Administrador', 'Gerente', 'Empleado']}>{children}</ProtectedRoute>
);

// Administrador, Gerente y Bodeguero: inventario/proveedores
const InventarioRoute = ({ children }) => (
  <ProtectedRoute roles={['Administrador', 'Gerente', 'Bodeguero']}>{children}</ProtectedRoute>
);

// Administrador, Gerente, Empleado y Bodeguero: productos
const ProductosRoute = ({ children }) => (
  <ProtectedRoute roles={['Administrador', 'Gerente', 'Empleado', 'Bodeguero']}>{children}</ProtectedRoute>
);

const ClientRoute = ({ children }) => (
  <ProtectedRoute roles={['Cliente']}>{children}</ProtectedRoute>
);

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Solo Administrador y Gerente */}
            <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><Users /></AdminRoute>} />
            <Route path="/admin/wallets" element={<AdminRoute><Wallets /></AdminRoute>} />

            {/* Administrador, Gerente y Empleado */}
            <Route path="/admin/purchases" element={<VentasRoute><Purchases /></VentasRoute>} />

            {/* Administrador, Gerente y Bodeguero */}
            <Route path="/admin/categories" element={<InventarioRoute><Categories /></InventarioRoute>} />
            <Route path="/admin/providers" element={<InventarioRoute><Providers /></InventarioRoute>} />

            {/* Administrador, Gerente, Empleado y Bodeguero */}
            <Route path="/admin/products" element={<ProductosRoute><Products /></ProductosRoute>} />

            {/* Solo Cliente */}
            <Route path="/cliente" element={<ClientRoute><Store /></ClientRoute>} />
            <Route path="/cliente/perfil" element={<ClientRoute><Profile /></ClientRoute>} />
            <Route path="/cliente/compras" element={<ClientRoute><MyPurchases /></ClientRoute>} />
            <Route path="/cliente/reporte" element={<ClientRoute><Report /></ClientRoute>} />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;