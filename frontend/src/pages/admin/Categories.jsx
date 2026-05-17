import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import { getCategories, createCategory, updateCategory } from '../../api/categories.api';
import { Loader2, FolderOpen, Plus, Pencil, Search } from 'lucide-react';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '' });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await getCategories({ page, limit: 10, nombre: search || undefined });
                setCategories(res.data);
                setPagination(res.pagination);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }, search ? 500 : 0);

        return () => clearTimeout(timer);
    }, [page, search]);

    const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
    const handlePage = (p) => setPage(p);

    const openCreate = () => { setEditing(null); setForm({ name: '' }); setFormError(''); setModal(true); };
    const openEdit = (c) => { setEditing(c); setForm({ name: c.nombre }); setFormError(''); setModal(true); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setFormError('');
        try {
            if (editing) await updateCategory(editing.id, form);
            else await createCategory(form);
            setModal(false);
            setPage(1);
            setSearch('');
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout title="Categorías">
            <div className="table-card">
                <div className="table-header">
                    <h3>Categorías de productos</h3>
                    <div className="table-actions">
                        <input
                            className="search-input"
                            placeholder="Buscar categoría..."
                            value={search}
                            onChange={handleSearch}
                        />
                        <button className="btn-primary" onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Plus size={16} /> Nueva categoría</button>
                    </div>
                </div>

                {loading ? (
                    <div className="empty-state"><Loader2 size={28} />Cargando...</div>
                ) : categories.length === 0 ? (
                    <div className="empty-state"><FolderOpen size={28} />No hay categorías</div>
                ) : (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(cat => (
                                    <tr key={cat.id}>
                                        <td>#{cat.id}</td>
                                        <td>{cat.nombre}</td>
                                        <td>
                                            <button
                                                className="btn-secondary"
                                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                                                onClick={() => openEdit(cat)}
                                            >
                                                <Pencil size={13} /> Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination pagination={pagination} onPage={handlePage} />
                    </>
                )}
            </div>

            {modal && (
                <Modal title={editing ? 'Editar categoría' : 'Nueva categoría'} onClose={() => setModal(false)}>
                    <form className="modal-form" onSubmit={handleSubmit}>
                        {formError && <div className="error-message">{formError}</div>}
                        <div className="form-group">
                            <label>Nombre</label>
                            <input
                                value={form.name}
                                onChange={e => setForm({ name: e.target.value })}
                                placeholder="Consolas"
                                required
                            />
                        </div>
                        <div className="modal-actions">
                            <button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
                            <button type="submit" className="btn-primary" disabled={saving}>
                                {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </AdminLayout>
    );
}