import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Products from './pages/admin/Products';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* admin */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['Administrador']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roles={['Administrador']}>
              <Users />
            </ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute roles={['Administrador']}>
              <Products />
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;