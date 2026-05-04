import { useState, useEffect, useCallback } from 'react';
import ClientLayout from '../../components/client/ClientLayout';
import Pagination from '../../components/Pagination';
import { getMyPurchases } from '../../api/client.api';
import { usePagination } from '../../hooks/usePagination';

export default function MyPurchases() {
    const [purchases, setPurchases] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);

    const { page, goToPage } = usePagination();

    const fetchPurchases = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getMyPurchases({ page });
            setPurchases(res.data);
            setPagination(res.pagination);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => { fetchPurchases(); }, [fetchPurchases]);

    return (
        <ClientLayout>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.4rem', fontWeight: 700 }}>
                Mis compras
            </h2>

            {loading ? (
                <div className="empty-state"><p>⏳</p>Cargando...</div>
            ) : purchases.length === 0 ? (
                <div className="empty-state">
                    <p>🛒</p>
                    No has realizado ninguna compra aún
                </div>
            ) : (
                <>
                    {purchases.map(p => (
                        <div key={p.id} className="purchase-item">
                            <div className="purchase-item-header">
                                <div>
                                    <span style={{ fontWeight: 600 }}>Compra #{p.id}</span>
                                    <span style={{ color: 'var(--gray)', fontSize: '0.8rem', marginLeft: '0.75rem' }}>
                                        {new Date(p.fecha).toLocaleDateString('es-GT', {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: '1.1rem' }}>
                                    Q{parseFloat(p.total).toFixed(2)}
                                </span>
                            </div>

                            <div className="purchase-item-products">
                                {p.detalle?.map((item, i) => (
                                    <span key={i}>
                                        {item.nombre} x{item.cantidad}
                                        {i < p.detalle.length - 1 ? ' · ' : ''}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}

                    <Pagination pagination={pagination} onPage={goToPage} />
                </>
            )}
        </ClientLayout>
    );
}