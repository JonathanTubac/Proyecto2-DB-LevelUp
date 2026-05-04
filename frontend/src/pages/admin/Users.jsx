import { useState, useEffect, useCallback } from 'react';
import AdminLayout  from '../../components/AdminLayout';
import Pagination   from '../../components/Pagination';
import { getUsers, deactivateUser } from '../../api/users.api';
import { usePagination } from '../../hooks/usePagination';

export default function Users() {
  const [users,      setUsers]      = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [search,     setSearch]     = useState('');
  const [rolFilter,  setRolFilter]  = useState('');

  const { page, goToPage, reset } = usePagination();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getUsers({ page, rol: rolFilter });
      setUsers(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, rolFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeactivate = async (id) => {
    if (!confirm('¿Desactivar este usuario?')) return;
    try {
      await deactivateUser(id);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRolFilter = (e) => {
    setRolFilter(e.target.value);
    reset();
  };

  // filtro local por nombre mientras escribe
  const filtered = users.filter(u =>
    u.nombre.toLowerCase().includes(search.toLowerCase()) ||
    u.correo.toLowerCase().includes(search.toLowerCase())
  );

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
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="search-input"
              value={rolFilter}
              onChange={handleRolFilter}
              style={{ width: 'auto' }}
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
          <div className="empty-state"><p>⏳</p>Cargando...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><p>👥</p>No hay usuarios</div>
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
                {filtered.map(user => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td>{user.nombre}</td>
                    <td>{user.correo}</td>
                    <td>{user.telefono || '—'}</td>
                    <td>
                      <span className={`badge ${
                        user.rol === 'Administrador' ? 'badge-red'  :
                        user.rol === 'Empleado'      ? 'badge-blue' :
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
                        <button
                          className="btn-danger"
                          onClick={() => handleDeactivate(user.id)}
                        >
                          Desactivar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              pagination={pagination}
              onPage={goToPage}
            />
          </>
        )}
      </div>

    </AdminLayout>
  );
}