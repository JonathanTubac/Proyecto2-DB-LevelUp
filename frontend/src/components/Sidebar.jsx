import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { logoutRequest } from '../api/auth.api';
import { LayoutDashboard, Users, Gamepad2, FolderOpen, Truck, ShoppingCart, Wallet, LogOut } from 'lucide-react';

const allNavItems = [
    { to: '/admin',            icon: <LayoutDashboard size={18} />, label: 'Dashboard',   roles: ['Administrador', 'Gerente'] },
    { to: '/admin/users',      icon: <Users size={18} />,           label: 'Usuarios',    roles: ['Administrador', 'Gerente'] },
    { to: '/admin/products',   icon: <Gamepad2 size={18} />,        label: 'Productos',   roles: ['Administrador', 'Gerente', 'Empleado', 'Bodeguero'] },
    { to: '/admin/categories', icon: <FolderOpen size={18} />,      label: 'Categorías',  roles: ['Administrador', 'Gerente', 'Bodeguero'] },
    { to: '/admin/providers',  icon: <Truck size={18} />,           label: 'Proveedores', roles: ['Administrador', 'Gerente', 'Bodeguero'] },
    { to: '/admin/purchases',  icon: <ShoppingCart size={18} />,    label: 'Compras',     roles: ['Administrador', 'Gerente', 'Empleado'] },
    { to: '/admin/wallets',    icon: <Wallet size={18} />,          label: 'Billeteras',  roles: ['Administrador', 'Gerente'] },
];

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const navItems = allNavItems.filter(item => item.roles.includes(user?.rol));

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
                    <LogOut size={15} /> Cerrar sesión
                </button>
            </div>
        </aside>
    );
}