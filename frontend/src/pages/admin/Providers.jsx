import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import { getProviders, createProvider, updateProvider, deactivateProvider } from '../../api/providers.api';
import { usePagination } from '../../hooks/usePagination';

export default function Providers() {
    const [providers, setProviders] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '' });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');

    const { page, goToPage } = usePagination();

    const fetchProviders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getProviders({ page });
            setProviders(res.data);
            setPagination(res.pagination);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => { fetchProviders(); }, [fetchProviders]);

    const openCreate = () => {
        setEditing(null);
        setForm({ name: '' });
        setFormError('');
        setModal(true);
    };

    const openEdit = (prov) => {
        setEditing(prov);
        setForm({ name: prov.nombre });
        setFormError('');
        setModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setFormError('');
        try {
            if (editing) await updateProvider(editing.id, form);
            else await createProvider(form);
            setModal(false);
            fetchProviders();
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
            fetchProviders();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <AdminLayout title="Proveedores">
            <div className="table-card">
                <div className="table-header">
                    <h3>Proveedores</h3>
                    <button className="btn-primary" onClick={openCreate}>+ Nuevo proveedor</button>
                </div>

                {loading ? (
                    <div className="empty-state"><p>⏳</p>Cargando...</div>
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
                                {providers.map(prov => (
                                    <tr key={prov.id}>
                                        <td>#{prov.id}</td>
                                        <td>{prov.nombre}</td>
                                        <td>
                                            <span className={`badge ${prov.activo ? 'badge-green' : 'badge-red'}`}>
                                                {prov.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="btn-secondary"
                                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                                                onClick={() => openEdit(prov)}
                                            >
                                                Editar
                                            </button>
                                            {prov.activo && (
                                                <button className="btn-danger" onClick={() => handleDeactivate(prov.id)}>
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
                    title={editing ? 'Editar proveedor' : 'Nuevo proveedor'}
                    onClose={() => setModal(false)}
                >
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
                            <button type="button" className="btn-secondary" onClick={() => setModal(false)}>
                                Cancelar
                            </button>
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