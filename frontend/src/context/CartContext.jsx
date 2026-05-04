import { createContext, useState, useContext } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product, cantidad = 1) => {
        setCart(prev => {
            const exists = prev.find(item => item.id === product.id);
            if (exists) {
                const newCantidad = exists.cantidad + cantidad;
                if (newCantidad > product.stock) return prev;
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, cantidad: newCantidad }
                        : item
                );
            }
            return [...prev, { ...product, cantidad }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const updateCantidad = (productId, cantidad, stock) => {
        if (cantidad < 1) return removeFromCart(productId);
        if (cantidad > stock) return;
        setCart(prev =>
            prev.map(item =>
                item.id === productId ? { ...item, cantidad } : item
            )
        );
    };

    const clearCart = () => setCart([]);

    const total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, updateCantidad, clearCart, total, totalItems
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);