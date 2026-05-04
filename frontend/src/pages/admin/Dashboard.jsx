import AdminLayout from '../../components/AdminLayout';

export default function Dashboard() {
    return (
        <AdminLayout title="Dashboard">

            <div className="stats-grid">
                {[
                    { label: 'Usuarios', value: '—', icon: '👥', desc: 'Total registrados' },
                    { label: 'Productos', value: '—', icon: '🎮', desc: 'En catálogo' },
                    { label: 'Compras', value: '—', icon: '🛒', desc: 'Este mes' },
                    { label: 'Ingresos', value: '—', icon: '💰', desc: 'Este mes' },
                ].map(stat => (
                    <div key={stat.label} className="stat-card">
                        <div className="stat-card-header">
                            <span>{stat.label}</span>
                            <span className="stat-icon">{stat.icon}</span>
                        </div>
                        <h3>{stat.value}</h3>
                        <p>{stat.desc}</p>
                    </div>
                ))}
            </div>

        </AdminLayout>
    );
}