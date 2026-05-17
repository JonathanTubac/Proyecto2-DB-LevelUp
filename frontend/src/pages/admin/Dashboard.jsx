import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getDashboardMetrics } from '../../api/dashboard.api';
import { Users, Gamepad2, ShoppingCart, DollarSign, Wallet, Banknote, Star, FolderOpen, Loader2 } from 'lucide-react';

export default function Dashboard() {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getDashboardMetrics()
            .then(res => setMetrics(res.data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const stats = metrics ? [
        {
            label: 'Usuarios activos',
            value: metrics.total_usuarios,
            icon: <Users size={20} />,
            desc: 'Total registrados',
            color: 'var(--blue)',
        },
        {
            label: 'Productos activos',
            value: metrics.total_productos,
            icon: <Gamepad2 size={20} />,
            desc: 'En catálogo',
            color: 'var(--green)',
        },
        {
            label: 'Compras este mes',
            value: metrics.compras_mes,
            icon: <ShoppingCart size={20} />,
            desc: 'Mes actual',
            color: 'var(--amber)',
        },
        {
            label: 'Ingresos este mes',
            value: `Q${parseFloat(metrics.ingresos_mes).toFixed(2)}`,
            icon: <DollarSign size={20} />,
            desc: 'Mes actual',
            color: 'var(--green)',
        },
        {
            label: 'Billeteras con saldo',
            value: metrics.billeteras_activas,
            icon: <Wallet size={20} />,
            desc: 'Usuarios con saldo > 0',
            color: 'var(--blue)',
        },
        {
            label: 'Saldo en circulación',
            value: `Q${parseFloat(metrics.saldo_total).toFixed(2)}`,
            icon: <Banknote size={20} />,
            desc: 'Total en billeteras',
            color: 'var(--amber)',
        },
    ] : [];

    return (
        <AdminLayout title="Dashboard">

            {error && (
                <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>
            )}

            {/* stats grid */}
            {loading ? (
                <div className="empty-state"><Loader2 size={28} />Cargando métricas...</div>
            ) : (
                <>
                    <div className="stats-grid">
                        {stats.map(stat => (
                            <div key={stat.label} className="stat-card">
                                <div className="stat-card-header">
                                    <span>{stat.label}</span>
                                    <span className="stat-icon">{stat.icon}</span>
                                </div>
                                <h3 style={{ color: stat.color }}>{stat.value}</h3>
                                <p>{stat.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* highlights */}
                    {metrics && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>

                            <div className="table-card" style={{ padding: '1.25rem' }}>
                                <h3 style={{ fontSize: '0.9rem', color: 'var(--gray)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <Star size={15} /> Producto más vendido
                                </h3>
                                <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--white)' }}>
                                    {metrics.producto_top ?? '—'}
                                </p>
                            </div>

                            <div className="table-card" style={{ padding: '1.25rem' }}>
                                <h3 style={{ fontSize: '0.9rem', color: 'var(--gray)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <FolderOpen size={15} /> Categoría más vendida
                                </h3>
                                <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--white)' }}>
                                    {metrics.categoria_top ?? '—'}
                                </p>
                            </div>

                        </div>
                    )}
                </>
            )}
        </AdminLayout>
    );
}