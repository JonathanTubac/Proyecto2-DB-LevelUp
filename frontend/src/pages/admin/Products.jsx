import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import { getProducts, createProduct, updateProduct, deactivateProduct } from '../../api/products.api';
import { getCategories } from '../../api/categories.api';
import { usePagination } from '../../hooks/usePagination';

const emptyForm = { name: '', price: '', stock: '', id_category: '' };

export default function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null); // null = crear, obj = editar
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');

    const { page, goToPage, reset } = usePagination();

    // cargar categorías para el select
    useEffect(() => {
        getCategories({ limit: 50 })
            .then(res => setCategories(res.data))
            .catch(() => { });
    }, []);

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

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    // debounce search
    useEffect(() => {
        const timer = setTimeout(() => { setSearch(searchInput); reset(); }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setFormError('');
        setModal(true);
    };

    const openEdit = (product) => {
        setEditing(product);
        setForm({
            name: product.nombre,
            price: product.precio,
            stock: product.stock,
            id_category: product.id_categoria,
        });
        setFormError('');
        setModal(true);
    };

    const closeModal = () => {
        setModal(false);
        setEditing(null);
        setForm(emptyForm);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFormError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setFormError('');

        try {
            const payload = {
                name: form.name,
                price: parseFloat(form.price),
                stock: parseInt(form.stock),
                id_category: parseInt(form.id_category),
            };

            if (editing) {
                await updateProduct(editing.id, payload);
            } else {
                await createProduct(payload);
            }

            closeModal();
            fetchProducts();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSaving(false);
        }
    };

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
                        <button className="btn-primary" onClick={openCreate}>
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
                                {products.map(p => (
                                    <tr key={p.id}>
                                        <td>#{p.id}</td>
                                        <td>{p.nombre}</td>
                                        <td><span className="badge badge-blue">{p.categoria}</span></td>
                                        <td>Q{parseFloat(p.precio).toFixed(2)}</td>
                                        <td>
                                            <span className={`badge ${p.stock > 10 ? 'badge-green' :
                                                p.stock > 0 ? 'badge-amber' : 'badge-red'
                                                }`}>
                                                {p.stock} uds
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${p.activo ? 'badge-green' : 'badge-red'}`}>
                                                {p.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="btn-secondary"
                                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                                                onClick={() => openEdit(p)}
                                            >
                                                Editar
                                            </button>
                                            {p.activo && (
                                                <button className="btn-danger" onClick={() => handleDeactivate(p.id)}>
                                                    Desactivar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination pagination={pagination} onPage={goToPage} />
                    </>
                )}
            </div>

            {modal && (
                <Modal
                    title={editing ? 'Editar producto' : 'Nuevo producto'}
                    onClose={closeModal}
                >
                    <form className="modal-form" onSubmit={handleSubmit}>
                        {formError && (
                            <div className="error-message">{formError}</div>
                        )}

                        <div className="form-group">
                            <label>Nombre</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Nintendo Switch OLED"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Precio (Q)</label>
                            <input
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="4500.00"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Stock</label>
                            <input
                                name="stock"
                                type="number"
                                min="0"
                                value={form.stock}
                                onChange={handleChange}
                                placeholder="15"
                            />
                        </div>

                        <div className="form-group">
                            <label>Categoría</label>
                            <select name="id_category" value={form.id_category} onChange={handleChange} required>
                                <option value="">Selecciona una categoría</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="btn-secondary" onClick={closeModal}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn-primary" disabled={saving}>
                                {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear producto'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

        </AdminLayout>
    );
}