import { fetchWithAuth } from './fetchWithAuth';

// src/api/products.api.js
export const getProducts = async ({ page = 1, limit = 10, nombre, categoria } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (nombre) params.append('name', nombre); 
    if (categoria) params.append('category', categoria);
    return await fetchWithAuth(`/products?${params}`);
};
export const createProduct = async (data) => {
    return await fetchWithAuth('/products', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const updateProduct = async (id, data) => {
    return await fetchWithAuth(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
};

export const deactivateProduct = async (id) => {
    return await fetchWithAuth(`/products/${id}`, {
        method: 'DELETE',
    });
};