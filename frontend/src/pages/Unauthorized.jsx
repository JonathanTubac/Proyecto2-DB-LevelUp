import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const roleHome = {
    'Administrador': '/admin',
    'Gerente':       '/admin',
    'Empleado':      '/admin/purchases',
    'Bodeguero':     '/admin/products',
    'Cliente':       '/cliente',
};

export default function Unauthorized() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleBack = () => {
        navigate(user ? (roleHome[user.rol] ?? '/login') : '/login');
    };

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: '100vh', gap: '1rem',
            background: '#0f172a', color: '#fff',
        }}>
            <h1 style={{ fontSize: '5rem', margin: 0, color: '#00d4a4' }}>403</h1>
            <h2 style={{ margin: 0 }}>Acceso denegado</h2>
            <p style={{ color: '#94a3b8', margin: 0 }}>
                No tienes permisos para ver esta página.
            </p>
            <button
                onClick={handleBack}
                style={{
                    marginTop: '0.5rem', padding: '0.75rem 2rem',
                    background: '#00d4a4', color: '#0f172a',
                    border: 'none', borderRadius: '8px',
                    cursor: 'pointer', fontWeight: 600, fontSize: '1rem',
                }}
            >
                Volver al inicio
            </button>
        </div>
    );
}
