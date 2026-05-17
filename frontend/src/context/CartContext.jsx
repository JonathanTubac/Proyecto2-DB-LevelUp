import { createContext, useReducer, useContext } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
    switch (action.type) {
        case 'ADD': {
            const exists = state.find(item => item.id === action.product.id);
            if (exists) {
                const newCantidad = exists.cantidad + action.cantidad;
                if (newCantidad > action.product.stock) return state;
                return state.map(item =>
                    item.id === action.product.id
                        ? { ...item, cantidad: newCantidad }
                        : item
                );
            }
            return [...state, { ...action.product, cantidad: action.cantidad }];
        }
        case 'REMOVE':
            return state.filter(item => item.id !== action.productId);
        case 'UPDATE': {
            if (action.cantidad < 1)
                return state.filter(item => item.id !== action.productId);
            if (action.cantidad > action.stock) return state;
            return state.map(item =>
                item.id === action.productId
                    ? { ...item, cantidad: action.cantidad }
                    : item
            );
        }
        case 'CLEAR':
            return [];
        default:
            return state;
    }
}

export const CartProvider = ({ children }) => {
    const [cart, dispatch] = useReducer(cartReducer, []);

    const addToCart = (product, cantidad = 1) =>
        dispatch({ type: 'ADD', product, cantidad });

    const removeFromCart = (productId) =>
        dispatch({ type: 'REMOVE', productId });

    const updateCantidad = (productId, cantidad, stock) =>
        dispatch({ type: 'UPDATE', productId, cantidad, stock });

    const clearCart = () => dispatch({ type: 'CLEAR' });

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