import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Pagination  from '../../components/Pagination';
import { getProducts, deactivateProduct } from '../../api/products.api';
import { usePagination } from '../../hooks/usePagination';

export default function Products() {
  const [products,   setProducts]   = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [search,     setSearch]     = useState('');

  const { page, goToPage, reset } = usePagination();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getProducts({ page, nombre: search || undefined });
      setProducts(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // debounce para el search — espera 500ms antes de buscar
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      reset();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleDeactivate = async (id) => {
    if (!confirm('¿Desactivar este producto?')) return;
    try {
      await deactivateProduct(id);
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <AdminLayout title="Productos">

      <div className="table-card">
        <div className="table-header">
          <h3>Catálogo de productos</h3>
          <div className="table-actions">
            <input
              className="search-input"
              placeholder="Buscar producto..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <button className="btn-primary">
              + Nuevo producto
            </button>
          </div>
        </div>

        {error && <p style={{ color: 'var(--red)', padding: '1rem' }}>{error}</p>}

        {loading ? (
          <div className="empty-state"><p>⏳</p>Cargando...</div>
        ) : products.length === 0 ? (
          <div className="empty-state"><p>🎮</p>No hay productos</div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>#{product.id}</td>
                    <td>{product.nombre}</td>
                    <td>
                      <span className="badge badge-blue">
                        {product.categoria}
                      </span>
                    </td>
                    <td>Q{parseFloat(product.precio).toFixed(2)}</td>
                    <td>
                      <span className={`badge ${
                        product.stock > 10 ? 'badge-green' :
                        product.stock > 0  ? 'badge-amber' :
                        'badge-red'
                      }`}>
                        {product.stock} uds
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${product.activo ? 'badge-green' : 'badge-red'}`}>
                        {product.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                        Editar
                      </button>
                      {product.activo && (
                        <button
                          className="btn-danger"
                          onClick={() => handleDeactivate(product.id)}
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