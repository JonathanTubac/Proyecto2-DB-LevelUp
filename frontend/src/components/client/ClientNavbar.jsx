import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../context/CartContext';
import { logoutRequest } from '../../api/auth.api';

export default function ClientNavbar({ onCartOpen }) {
    const { user, logout } = useAuth();
    const { totalItems } = useCart();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        await logoutRequest(refreshToken);
        logout();
        navigate('/login');
    };

    return (
        <nav className="client-navbar">
            <span className="client-navbar-logo">🎮 LevelUp</span>

            <div className="client-nav-links">
                <NavLink
                    to="/cliente"
                    end
                    className={({ isActive }) => `client-nav-link ${isActive ? 'active' : ''}`}
                >
                    Productos
                </NavLink>
                <NavLink
                    to="/cliente/perfil"
                    className={({ isActive }) => `client-nav-link ${isActive ? 'active' : ''}`}
                >
                    Mi perfil
                </NavLink>
                <NavLink
                    to="/cliente/compras"
                    className={({ isActive }) => `client-nav-link ${isActive ? 'active' : ''}`}
                >
                    Mis compras
                </NavLink>
            </div>

            <div className="client-navbar-actions">
                <button className="cart-btn" onClick={onCartOpen}>
                    🛒 Carrito
                    {totalItems > 0 && (
                        <span className="cart-badge">{totalItems}</span>
                    )}
                </button>
                <span style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>
                    Hola, {user?.name}
                </span>
                <button
                    className="btn-secondary"
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                    onClick={handleLogout}
                >
                    Salir
                </button>
            </div>
        </nav>
    );
}