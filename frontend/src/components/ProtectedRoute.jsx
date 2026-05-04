import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children, roles = [] }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="loading">Cargando...</div>;

    if (!user) return <Navigate to="/login" replace />;

    if (roles.length > 0 && !roles.includes(user.rol))
        return <Navigate to="/unauthorized" replace />;

    return children;
};