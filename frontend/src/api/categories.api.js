import { fetchWithAuth } from './fetchWithAuth';

export const getCategories = async ({ page = 1, limit = 10, nombre } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (nombre) params.append('nombre', nombre);
    return await fetchWithAuth(`/categories?${params}`);
};

export const createCategory = async (data) => {
    return await fetchWithAuth('/categories', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const updateCategory = async (id, data) => {
    return await fetchWithAuth(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
};