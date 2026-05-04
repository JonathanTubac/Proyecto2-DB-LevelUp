import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import { getPurchases, getPurchaseById } from '../../api/purchases.api';

export default function Purchases() {
    const [purchases, setPurchases] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tipoFilter, setTipoFilter] = useState('');
    const [page, setPage] = useState(1);
    const [detail, setDetail] = useState(null);
    const [detailOpen, setDetailOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await getPurchases({ page, limit: 10, tipo: tipoFilter || undefined });
                setPurchases(res.data);
                setPagination(res.pagination);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }, 0);

        return () => clearTimeout(timer);
    }, [page, tipoFilter]);

    const handleTipo = (e) => { setTipoFilter(e.target.value); setPage(1); };
    const handlePage = (p) => setPage(p);

    const openDetail = async (id) => {
        try {
            const res = await getPurchaseById(id);
            setDetail(res.data);
            setDetailOpen(true);
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <AdminLayout title="Compras">
            <div className="table-card">
                <div className="table-header">
                    <h3>Historial de compras</h3>
                    <select
                        className="search-input"
                        style={{ width: 'auto' }}
                        value={tipoFilter}
                        onChange={handleTipo}
                    >
                        <option value="">Todos los tipos</option>
                        <option value="en_linea">En línea</option>
                        <option value="presencial">Presencial</option>
                    </select>
                </div>

                {loading ? (
                    <div className="empty-state"><p>⏳</p>Cargando...</div>
                ) : purchases.length === 0 ? (
                    <div className="empty-state"><p>🛒</p>No hay compras</div>
                ) : (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tipo</th>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                    <th>Usuario</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchases.map(p => (
                                    <tr key={p.id}>
                                        <td>#{p.id}</td>
                                        <td>
                                            <span className={`badge ${p.tipo === 'en_linea' ? 'badge-blue' : 'badge-amber'}`}>
                                                {p.tipo === 'en_linea' ? 'En línea' : 'Presencial'}
                                            </span>
                                        </td>
                                        <td>{new Date(p.fecha).toLocaleDateString('es-GT')}</td>
                                        <td style={{ color: 'var(--green)', fontWeight: 600 }}>
                                            Q{parseFloat(p.total).toFixed(2)}
                                        </td>
                                        <td>#{p.id_usuario}</td>
                                        <td>
                                            <button
                                                className="btn-secondary"
                                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                                                onClick={() => openDetail(p.id)}
                                            >
                                                Ver detalle
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

            {detailOpen && detail && (
                <Modal title={`Detalle compra #${detail.id}`} onClose={() => setDetailOpen(false)}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--gray)' }}>Tipo</span>
                            <span className={`badge ${detail.tipo === 'en_linea' ? 'badge-blue' : 'badge-amber'}`}>
                                {detail.tipo === 'en_linea' ? 'En línea' : 'Presencial'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--gray)' }}>Fecha</span>
                            <span>{new Date(detail.fecha).toLocaleString('es-GT')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--gray)' }}>Total</span>
                            <span style={{ color: 'var(--green)', fontWeight: 700 }}>
                                Q{parseFloat(detail.total).toFixed(2)}
                            </span>
                        </div>
                        <hr style={{ borderColor: 'var(--border)' }} />
                        <h4 style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>PRODUCTOS</h4>
                        {detail.detalle?.map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span>{item.nombre} x{item.cantidad}</span>
                                <span>Q{parseFloat(item.precio_unitario * item.cantidad).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </Modal>
            )}
        </AdminLayout>
    );
}