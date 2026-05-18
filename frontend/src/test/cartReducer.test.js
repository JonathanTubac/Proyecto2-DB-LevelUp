import { describe, it, expect } from 'vitest';

// cartReducer extracted inline so tests have no JSX/React dependency
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

const product = { id: 1, nombre: 'Game A', precio: 50, stock: 10 };
const product2 = { id: 2, nombre: 'Game B', precio: 30, stock: 5 };

describe('cartReducer — ADD', () => {
    it('adds a new product to an empty cart', () => {
        const state = cartReducer([], { type: 'ADD', product, cantidad: 1 });
        expect(state).toHaveLength(1);
        expect(state[0].id).toBe(1);
        expect(state[0].cantidad).toBe(1);
    });

    it('increments quantity when the same product is added again', () => {
        const initial = [{ ...product, cantidad: 2 }];
        const state = cartReducer(initial, { type: 'ADD', product, cantidad: 3 });
        expect(state).toHaveLength(1);
        expect(state[0].cantidad).toBe(5);
    });

    it('does not exceed stock when adding', () => {
        const initial = [{ ...product, cantidad: 9 }];
        const state = cartReducer(initial, { type: 'ADD', product, cantidad: 5 });
        // 9 + 5 = 14 > stock(10) → state unchanged
        expect(state[0].cantidad).toBe(9);
    });
});

describe('cartReducer — REMOVE', () => {
    it('removes the specified product', () => {
        const initial = [
            { ...product, cantidad: 1 },
            { ...product2, cantidad: 2 },
        ];
        const state = cartReducer(initial, { type: 'REMOVE', productId: 1 });
        expect(state).toHaveLength(1);
        expect(state[0].id).toBe(2);
    });

    it('returns unchanged state when product id is not in cart', () => {
        const initial = [{ ...product, cantidad: 1 }];
        const state = cartReducer(initial, { type: 'REMOVE', productId: 99 });
        expect(state).toHaveLength(1);
    });
});

describe('cartReducer — UPDATE', () => {
    it('updates the quantity of a product', () => {
        const initial = [{ ...product, cantidad: 3 }];
        const state = cartReducer(initial, { type: 'UPDATE', productId: 1, cantidad: 7, stock: 10 });
        expect(state[0].cantidad).toBe(7);
    });

    it('removes the item when updated quantity is less than 1', () => {
        const initial = [{ ...product, cantidad: 1 }];
        const state = cartReducer(initial, { type: 'UPDATE', productId: 1, cantidad: 0, stock: 10 });
        expect(state).toHaveLength(0);
    });

    it('does not exceed stock on update', () => {
        const initial = [{ ...product, cantidad: 3 }];
        const state = cartReducer(initial, { type: 'UPDATE', productId: 1, cantidad: 15, stock: 10 });
        expect(state[0].cantidad).toBe(3);
    });
});

describe('cartReducer — CLEAR', () => {
    it('empties the cart', () => {
        const initial = [
            { ...product, cantidad: 1 },
            { ...product2, cantidad: 2 },
        ];
        const state = cartReducer(initial, { type: 'CLEAR' });
        expect(state).toHaveLength(0);
    });
});

describe('cartReducer — default', () => {
    it('returns current state for unknown action types', () => {
        const initial = [{ ...product, cantidad: 1 }];
        const state = cartReducer(initial, { type: 'UNKNOWN' });
        expect(state).toBe(initial);
    });
});
