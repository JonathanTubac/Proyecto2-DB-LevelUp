import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Pagination from '../../components/Pagination';
import { getUsers, deactivateUser } from '../../api/users.api';
import { Loader2, Users as UsersIcon, PowerOff, Search } from 'lucide-react';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [rolFilter, setRolFilter] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        const timer = setTimeout(async () => {
            setLoading(true);
            setError('');
            try {
                const res = await getUsers({ page, limit: 10, rol: rolFilter || undefined });
                // filtro local por nombre/correo
                const filtered = search
                    ? res.data.filter(u =>
                        u.nombre.toLowerCase().includes(search.toLowerCase()) ||
                        u.correo.toLowerCase().includes(search.toLowerCase())
                    )
                    : res.data;
                setUsers(filtered);
                setPagination(res.pagination);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }, search ? 500 : 0);

        return () => clearTimeout(timer);
    }, [page, search, rolFilter]);

    const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
    const handleRolFilter = (e) => { setRolFilter(e.target.value); setPage(1); };
    const handlePage = (p) => setPage(p);

    const handleDeactivate = async (id) => {
        if (!confirm('¿Desactivar este usuario?')) return;
        try {
            await deactivateUser(id);
            setPage(1);
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <AdminLayout title="Usuarios">
            <div className="table-card">
                <div className="table-header">
                    <h3>Todos los usuarios</h3>
                    <div className="table-actions">
                        <input
                            className="search-input"
                            placeholder="Buscar por nombre o correo..."
                            value={search}
                            onChange={handleSearch}
                        />
                        <select
                            className="search-input"
                            style={{ width: 'auto' }}
                            value={rolFilter}
                            onChange={handleRolFilter}
                        >
                            <option value="">Todos los roles</option>
                            <option value="Administrador">Administrador</option>
                            <option value="Empleado">Empleado</option>
                            <option value="Cliente">Cliente</option>
                        </select>
                    </div>
                </div>

                {error && <p style={{ color: 'var(--red)', padding: '1rem' }}>{error}</p>}

                {loading ? (
                    <div className="empty-state"><Loader2 size={28} />Cargando...</div>
                ) : users.length === 0 ? (
                    <div className="empty-state"><UsersIcon size={28} />No hay usuarios</div>
                ) : (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>Teléfono</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>#{user.id}</td>
                                        <td>{user.nombre}</td>
                                        <td>{user.correo}</td>
                                        <td>{user.telefono || '—'}</td>
                                        <td>
                                            <span className={`badge ${user.rol === 'Administrador' ? 'badge-red' :
                                                    user.rol === 'Empleado' ? 'badge-blue' :
                                                        'badge-green'
                                                }`}>
                                                {user.rol}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${user.activo ? 'badge-green' : 'badge-red'}`}>
                                                {user.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td>
                                            {user.activo && (
                                                <button className="btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }} onClick={() => handleDeactivate(user.id)}>
                                                    <PowerOff size={13} /> Desactivar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination pagination={pagination} onPage={handlePage} />
                    </>
                )}
            </div>
        </AdminLayout>
    );
}