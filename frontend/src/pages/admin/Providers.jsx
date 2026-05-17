import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import { getProviders, createProvider, updateProvider, deactivateProvider } from '../../api/providers.api';
import { Loader2, Truck, Plus, Pencil, PowerOff, Search } from 'lucide-react';

export default function Providers() {
    const [providers, setProviders] = useState([]);
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
                const res = await getProviders({ page, limit: 10, nombre: search || undefined });
                setProviders(res.data);
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
    const openEdit = (p) => { setEditing(p); setForm({ name: p.nombre }); setFormError(''); setModal(true); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setFormError('');
        try {
            if (editing) await updateProvider(editing.id, form);
            else await createProvider(form);
            setModal(false);
            setPage(1);
            setSearch('');
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeactivate = async (id) => {
        if (!confirm('¿Desactivar este proveedor?')) return;
        try {
            await deactivateProvider(id);
            setPage(1);
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <AdminLayout title="Proveedores">
            <div className="table-card">
                <div className="table-header">
                    <h3>Proveedores</h3>
                    <div className="table-actions">
                        <input
                            className="search-input"
                            placeholder="Buscar proveedor..."
                            value={search}
                            onChange={handleSearch}
                        />
                        <button className="btn-primary" onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Plus size={16} /> Nuevo proveedor</button>
                    </div>
                </div>

                {loading ? (
                    <div className="empty-state"><Loader2 size={28} />Cargando...</div>
                ) : providers.length === 0 ? (
                    <div className="empty-state"><Truck size={28} />No hay proveedores</div>
                ) : (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {providers.map(p => (
                                    <tr key={p.id}>
                                        <td>#{p.id}</td>
                                        <td>{p.nombre}</td>
                                        <td>
                                            <span className={`badge ${p.activo ? 'badge-green' : 'badge-red'}`}>
                                                {p.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="btn-secondary"
                                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                                                onClick={() => openEdit(p)}
                                            >
                                                <Pencil size={13} /> Editar
                                            </button>
                                            {p.activo && (
                                                <button className="btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }} onClick={() => handleDeactivate(p.id)}>
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

            {modal && (
                <Modal title={editing ? 'Editar proveedor' : 'Nuevo proveedor'} onClose={() => setModal(false)}>
                    <form className="modal-form" onSubmit={handleSubmit}>
                        {formError && <div className="error-message">{formError}</div>}
                        <div className="form-group">
                            <label>Nombre</label>
                            <input
                                value={form.name}
                                onChange={e => setForm({ name: e.target.value })}
                                placeholder="Nintendo Latinoamérica"
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