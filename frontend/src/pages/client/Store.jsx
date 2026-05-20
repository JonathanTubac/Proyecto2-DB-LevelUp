import { useState, useEffect, useCallback } from 'react';
import ClientLayout from '../../components/client/ClientLayout';
import Pagination from '../../components/Pagination';
import { getProductsClient, getCategoriesClient } from '../../api/client.api';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { usePagination } from '../../hooks/usePagination';

const categoryIcons = {
    'Consolas': '🎮',
    'Videojuegos': '📀',
    'Accesorios': '🕹️',
    'Periféricos': '⌨️',
    'Merchandising': '👕',
};

export default function Store() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [catFilter, setCatFilter] = useState('');
    const [quantities, setQuantities] = useState({}); // cantidad por producto

    const { cart, addToCart } = useCart();
    const { showToast } = useToast();
    const { page, goToPage, reset } = usePagination(1, 12);

    useEffect(() => {
        getCategoriesClient()
            .then(res => setCategories(res.data))
            .catch(() => { });
    }, []);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getProductsClient({
                page,
                limit: 12,
                nombre: search || undefined,
                categoria: catFilter || undefined,
            });
            setProducts(res.data);
            setPagination(res.pagination);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, search, catFilter]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    useEffect(() => {
        const t = setTimeout(() => { setSearch(searchInput); reset(); }, 500);
        return () => clearTimeout(t);
    }, [searchInput]); // eslint-disable-line react-hooks/exhaustive-deps

    const getQuantity = (productId) => quantities[productId] || 1;

    const setQuantity = (productId, val, stock) => {
        const q = Math.max(1, Math.min(stock, parseInt(val) || 1));
        setQuantities(prev => ({ ...prev, [productId]: q }));
    };

    const cartQuantity = (productId) => {
        const item = cart.find(i => i.id === productId);
        return item ? item.cantidad : 0;
    };

    return (
        <ClientLayout>

            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                <input
                    className="search-input"
                    style={{ flex: 1, width: 'auto' }}
                    placeholder="Buscar productos..."
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                />
            </div>

            <div className="filters-bar">
                <button
                    className={`filter-btn ${catFilter === '' ? 'active' : ''}`}
                    onClick={() => { setCatFilter(''); reset(); }}
                >
                    Todos
                </button>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`filter-btn ${catFilter === String(cat.id) ? 'active' : ''}`}
                        onClick={() => { setCatFilter(String(cat.id)); reset(); }}
                    >
                        {categoryIcons[cat.nombre] || '📦'} {cat.nombre}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="empty-state"><p>⏳</p>Cargando productos...</div>
            ) : products.length === 0 ? (
                <div className="empty-state"><p>🎮</p>No hay productos disponibles</div>
            ) : (
                <>
                    <div className="products-grid">
                        {products.map(product => {
                            const cartQ = cartQuantity(product.id);
                            const maxQ = product.stock - cartQ;

                            return (
                                <div key={product.id} className="product-card">
                                    <div className="product-card-image">
                                        {categoryIcons[product.categoria] || '📦'}
                                    </div>

                                    <div className="product-card-body">
                                        <span className="product-card-category">{product.categoria}</span>
                                        <p className="product-card-name">{product.nombre}</p>
                                        <p className={`product-card-stock ${product.stock === 0 ? 'empty' :
                                                product.stock <= 5 ? 'low' : ''
                                            }`}>
                                            {product.stock === 0
                                                ? 'Sin stock'
                                                : product.stock <= 5
                                                    ? `¡Solo ${product.stock} disponibles!`
                                                    : `${product.stock} en stock`
                                            }
                                        </p>
                                        <p className="product-card-price">Q{parseFloat(product.precio).toFixed(2)}</p>
                                    </div>

                                    <div className="product-card-footer">
                                        {product.stock > 0 ? (
                                            <>
                                                <div className="quantity-control">
                                                    <button
                                                        className="quantity-btn"
                                                        onClick={() => setQuantity(product.id, getQuantity(product.id) - 1, maxQ)}
                                                        disabled={getQuantity(product.id) <= 1}
                                                    >−</button>
                                                    <span className="quantity-display">{getQuantity(product.id)}</span>
                                                    <button
                                                        className="quantity-btn"
                                                        onClick={() => setQuantity(product.id, getQuantity(product.id) + 1, maxQ)}
                                                        disabled={getQuantity(product.id) >= maxQ || maxQ <= 0}
                                                    >+</button>
                                                </div>
                                                <button
                                                    className="add-cart-btn"
                                                    disabled={maxQ <= 0}
                                                    onClick={() => {
                                                        addToCart(product, getQuantity(product.id));
                                                        setQuantities(prev => ({ ...prev, [product.id]: 1 }));
                                                        showToast(`${product.nombre} agregado al carrito`, 'info');
                                                    }}
                                                >
                                                    {maxQ <= 0 ? '✓ En carrito' : '+ Agregar'}
                                                </button>
                                            </>
                                        ) : (
                                            <button className="add-cart-btn" disabled>Sin stock</button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ marginTop: '1.5rem' }}>
                        <Pagination pagination={pagination} onPage={goToPage} />
                    </div>
                </>
            )}
        </ClientLayout>
    );
}