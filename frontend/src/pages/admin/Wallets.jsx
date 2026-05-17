import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import { getWallets, updateWallet } from '../../api/wallets.api';
import { usePagination } from '../../hooks/usePagination';
import { Loader2, Wallet as WalletIcon, Pencil } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function Wallets() {
    const { showToast } = useToast();
    const [wallets, setWallets] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [amount, setAmount] = useState('');
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');

    const { page, goToPage } = usePagination();

    const fetchWallets = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getWallets({ page });
            setWallets(res.data.data);
            setPagination(res.pagination);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => { fetchWallets(); }, [fetchWallets]);

    const openEdit = (wallet) => {
        setEditing(wallet);
        setAmount(wallet.monto);
        setFormError('');
        setModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setFormError('');
        try {
            await updateWallet(editing.id, parseFloat(amount));
            showToast('Saldo actualizado correctamente');
            setModal(false);
            fetchWallets();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout title="Billeteras">
            <div className="table-card">
                <div className="table-header">
                    <h3>Billeteras de usuarios</h3>
                </div>

                {loading ? (
                    <div className="empty-state"><Loader2 size={28} />Cargando...</div>
                ) : wallets.length === 0 ? (
                    <div className="empty-state"><WalletIcon size={28} />No hay billeteras</div>
                ) : (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Usuario</th>
                                    <th>Saldo</th>
                                    <th>Fecha creación</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {wallets.map(w => (
                                    <tr key={w.id}>
                                        <td>#{w.id}</td>
                                        <td>{w.usuario}</td>
                                        <td>
                                            <span className={`badge ${w.monto > 1000 ? 'badge-green' :
                                                    w.monto > 0 ? 'badge-amber' :
                                                        'badge-red'
                                                }`}>
                                                Q{parseFloat(w.monto).toFixed(2)}
                                            </span>
                                        </td>
                                        <td>{new Date(w.fecha_creacion).toLocaleDateString('es-GT')}</td>
                                        <td>
                                            <button
                                                className="btn-secondary"
                                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                                                onClick={() => openEdit(w)}
                                            >
                                                <Pencil size={13} /> Editar monto
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination pagination={pagination} onPage={goToPage} />
                    </>
                )}
            </div>

            {modal && editing && (
                <Modal
                    title={`Editar billetera de ${editing.usuario}`}
                    onClose={() => setModal(false)}
                >
                    <form className="modal-form" onSubmit={handleSubmit}>
                        {formError && <div className="error-message">{formError}</div>}

                        <div style={{
                            background: 'var(--card2)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            padding: '1rem',
                            textAlign: 'center'
                        }}>
                            <p style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>Saldo actual</p>
                            <p style={{ color: 'var(--green)', fontSize: '1.8rem', fontWeight: 700 }}>
                                Q{parseFloat(editing.monto).toFixed(2)}
                            </p>
                        </div>

                        <div className="form-group">
                            <label>Nuevo monto (Q)</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                placeholder="0.00"
                                required
                            />
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="btn-secondary" onClick={() => setModal(false)}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn-primary" disabled={saving}>
                                {saving ? 'Guardando...' : 'Actualizar monto'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </AdminLayout>
    );
}