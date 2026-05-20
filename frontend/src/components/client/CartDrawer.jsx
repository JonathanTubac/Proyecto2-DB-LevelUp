import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { buyProducts } from '../../api/client.api';

export default function CartDrawer({ onClose, walletBalance, onPurchaseSuccess }) {
    const { cart, removeFromCart, updateCantidad, clearCart, total } = useCart();
    const { showToast } = useToast();
    const [buying, setBuying] = useState(false);

    const canAfford = walletBalance >= total;

    const handleBuy = async () => {
        if (!canAfford) return;
        setBuying(true);

        try {
            await buyProducts(
                cart.map(item => ({
                    id_producto: item.id,
                    cantidad: item.cantidad,
                }))
            );

            clearCart();
            onPurchaseSuccess();
            showToast('¡Compra realizada con éxito!');
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setBuying(false);
        }
    };

    return (
        <>
            <div className="cart-overlay" onClick={onClose} />
            <div className="cart-drawer">

                <div className="cart-drawer-header">
                    <h3>🛒 Carrito de compras</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="cart-drawer-body">
                    {cart.length === 0 ? (
                        <div className="empty-state" style={{ marginTop: '2rem' }}>
                            <p>🛒</p>
                            Tu carrito está vacío
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-item-info">
                                    <p className="cart-item-name">{item.nombre}</p>
                                    <p className="cart-item-price">Q{parseFloat(item.precio).toFixed(2)} c/u</p>
                                </div>
                                <div className="cart-item-controls">
                                    <button
                                        className="quantity-btn"
                                        onClick={() => updateCantidad(item.id, item.cantidad - 1, item.stock)}
                                    >
                                        −
                                    </button>
                                    <span className="quantity-display">{item.cantidad}</span>
                                    <button
                                        className="quantity-btn"
                                        onClick={() => updateCantidad(item.id, item.cantidad + 1, item.stock)}
                                        disabled={item.cantidad >= item.stock}
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="cart-item-subtotal">
                                    Q{(item.precio * item.cantidad).toFixed(2)}
                                </span>
                                <button
                                    className="btn-danger"
                                    style={{ padding: '0.25rem 0.5rem' }}
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="cart-drawer-footer">
                        <div className="cart-total-row">
                            <span className="cart-total-label">Total</span>
                            <span className="cart-total-value">Q{total.toFixed(2)}</span>
                        </div>

                        <div className="cart-balance-row">
                            <span>Tu saldo</span>
                            <span className={canAfford ? 'cart-balance-ok' : 'cart-balance-low'}>
                                Q{parseFloat(walletBalance).toFixed(2)}
                                {!canAfford && ' — Saldo insuficiente'}
                            </span>
                        </div>

                        <button
                            className="buy-btn"
                            onClick={handleBuy}
                            disabled={!canAfford || buying}
                        >
                            {buying ? 'Procesando...' : `Comprar — Q${total.toFixed(2)}`}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}