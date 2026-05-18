import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import { getPurchases, getPurchaseById, createPresencialSale } from '../../api/purchases.api';
import { getProducts } from '../../api/products.api';
import { useAuth } from '../../hooks/useAuth';
import { Loader2, ShoppingCart, Eye, Plus, Trash2 } from 'lucide-react';

const STAFF_ROLES = ['Empleado', 'Administrador', 'Gerente'];

export default function Purchases() {
    const { user } = useAuth();
    const isStaff = STAFF_ROLES.includes(user?.rol);

    const [purchases, setPurchases]   = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading]       = useState(true);
    const [tipoFilter, setTipoFilter] = useState('');
    const [page, setPage]             = useState(1);

    // detalle
    const [detail, setDetail]         = useState(null);
    const [detailOpen, setDetailOpen] = useState(false);

    // nueva venta presencial
    const [saleOpen, setSaleOpen]     = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [qty, setQty]               = useState(1);
    const [cart, setCart]             = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [saleError, setSaleError]   = useState('');

    const loadPurchases = useCallback(async () => {
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
    }, [page, tipoFilter]);

    useEffect(() => { loadPurchases(); }, [loadPurchases]);

    const openSaleModal = async () => {
        setSaleError('');
        setCart([]);
        setSelectedProduct('');
        setQty(1);
        setSaleOpen(true);
        try {
            const pRes = await getProducts({ limit: 200 });
            setAllProducts(pRes.data ?? []);
        } catch {
            setSaleError('No se pudo cargar los productos.');
        }
    };

    const addToCart = () => {
        if (!selectedProduct) return;
        const product = allProducts.find(p => p.id === Number(selectedProduct));
        if (!product) return;
        setCart(prev => {
            const existing = prev.find(i => i.id_producto === product.id);
            if (existing)
                return prev.map(i => i.id_producto === product.id
                    ? { ...i, cantidad: i.cantidad + qty }
                    : i);
            return [...prev, { id_producto: product.id, nombre: product.nombre, precio: product.precio, cantidad: qty }];
        });
        setSelectedProduct('');
        setQty(1);
    };

    const removeFromCart = (id_producto) =>
        setCart(prev => prev.filter(i => i.id_producto !== id_producto));

    const total = cart.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

    const handleSubmitSale = async () => {
        setSaleError('');
        if (cart.length === 0) { setSaleError('Agrega al menos un producto.'); return; }
        setSubmitting(true);
        try {
            await createPresencialSale({
                productos: cart.map(i => ({ id_producto: i.id_producto, cantidad: i.cantidad })),
            });
            setSaleOpen(false);
            loadPurchases();
        } catch (err) {
            setSaleError(err.message ?? 'Error al registrar la venta.');
        } finally {
            setSubmitting(false);
        }
    };

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
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <select
                            className="search-input"
                            style={{ width: 'auto' }}
                            value={tipoFilter}
                            onChange={e => { setTipoFilter(e.target.value); setPage(1); }}
                        >
                            <option value="">Todos los tipos</option>
                            <option value="en_linea">En línea</option>
                            <option value="presencial">Presencial</option>
                        </select>
                        {isStaff && (
                            <button
                                className="btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem' }}
                                onClick={openSaleModal}
                            >
                                <Plus size={16} /> Nueva Venta
                            </button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="empty-state"><Loader2 size={28} />Cargando...</div>
                ) : purchases.length === 0 ? (
                    <div className="empty-state"><ShoppingCart size={28} />No hay compras</div>
                ) : (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tipo</th>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                    <th>Cliente</th>
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
                                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                                                onClick={() => openDetail(p.id)}
                                            >
                                                <Eye size={13} /> Ver detalle
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination pagination={pagination} onPage={setPage} />
                    </>
                )}
            </div>

            {/* ── Modal detalle ── */}
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

            {/* ── Modal nueva venta presencial ── */}
            {saleOpen && (
                <Modal title="Nueva Venta Presencial" onClose={() => setSaleOpen(false)}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                        {/* Agregar producto */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--gray)', fontSize: '0.85rem' }}>
                                Agregar producto
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <select
                                    className="search-input"
                                    style={{ flex: 1 }}
                                    value={selectedProduct}
                                    onChange={e => setSelectedProduct(e.target.value)}
                                >
                                    <option value="">— Producto —</option>
                                    {allProducts.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.nombre} — Q{parseFloat(p.precio).toFixed(2)} (stock: {p.stock})
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    min="1"
                                    value={qty}
                                    onChange={e => setQty(Math.max(1, Number(e.target.value)))}
                                    style={{ width: '70px' }}
                                    className="search-input"
                                />
                                <button className="btn-primary" onClick={addToCart} style={{ whiteSpace: 'nowrap' }}>
                                    <Plus size={15} />
                                </button>
                            </div>
                        </div>

                        {/* Carrito */}
                        {cart.length > 0 && (
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--gray)', fontSize: '0.85rem' }}>
                                    Productos seleccionados
                                </label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    {cart.map(item => (
                                        <div key={item.id_producto} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', padding: '0.4rem 0', borderBottom: '1px solid var(--border)' }}>
                                            <span>{item.nombre} x{item.cantidad}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <span style={{ color: 'var(--green)' }}>Q{(item.precio * item.cantidad).toFixed(2)}</span>
                                                <button onClick={() => removeFromCart(item.id_producto)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)' }}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontWeight: 700 }}>
                                    <span>Total</span>
                                    <span style={{ color: 'var(--green)' }}>Q{total.toFixed(2)}</span>
                                </div>
                            </div>
                        )}

                        {saleError && (
                            <div style={{ color: '#ef4444', fontSize: '0.85rem', padding: '0.5rem', background: 'rgba(239,68,68,0.1)', borderRadius: '6px' }}>
                                {saleError}
                            </div>
                        )}

                        <button
                            className="btn-primary"
                            onClick={handleSubmitSale}
                            disabled={submitting}
                            style={{ width: '100%', padding: '0.75rem' }}
                        >
                            {submitting ? 'Registrando...' : 'Registrar Venta Presencial'}
                        </button>
                    </div>
                </Modal>
            )}
        </AdminLayout>
    );
}
