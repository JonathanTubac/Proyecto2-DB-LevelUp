import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Pagination from '../../components/Pagination';
import { getWallets } from '../../api/wallets.api';
import { usePagination } from '../../hooks/usePagination';

export default function Wallets() {
    const [wallets, setWallets] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);

    const { page, goToPage } = usePagination();

    const fetchWallets = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getWallets({ page });
            setWallets(res.data);
            setPagination(res.pagination);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => { fetchWallets(); }, [fetchWallets]);

    return (
        <AdminLayout title="Billeteras">
            <div className="table-card">
                <div className="table-header">
                    <h3>Billeteras de usuarios</h3>
                </div>

                {loading ? (
                    <div className="empty-state"><p>⏳</p>Cargando...</div>
                ) : wallets.length === 0 ? (
                    <div className="empty-state"><p>💳</p>No hay billeteras</div>
                ) : (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Usuario</th>
                                    <th>Saldo</th>
                                    <th>Fecha creación</th>
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination pagination={pagination} onPage={goToPage} />
                    </>
                )}
            </div>
        </AdminLayout>
    );
}