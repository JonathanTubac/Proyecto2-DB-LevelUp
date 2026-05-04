import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { logoutRequest } from '../api/auth.api';

const navItems = [
    { to: '/admin', icon: '📊', label: 'Dashboard' },
    { to: '/admin/users', icon: '👥', label: 'Usuarios' },
    { to: '/admin/products', icon: '🎮', label: 'Productos' },
    { to: '/admin/categories', icon: '📁', label: 'Categorías' },
    { to: '/admin/providers', icon: '🏭', label: 'Proveedores' },
    { to: '/admin/purchases', icon: '🛒', label: 'Compras' },
    { to: '/admin/wallets', icon: '💳', label: 'Billeteras' },
];

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        await logoutRequest(refreshToken);
        logout();
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <h2>LevelUp</h2>
                <p>Panel de Administración</p>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section">Menú</div>

                {navItems.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/admin'}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'active' : ''}`
                        }
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="user-avatar">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                        <p>{user?.name}</p>
                        <span>{user?.rol}</span>
                    </div>
                </div>
                <button className="btn-logout" onClick={handleLogout}>
                    Cerrar sesión
                </button>
            </div>
        </aside>
    );
}