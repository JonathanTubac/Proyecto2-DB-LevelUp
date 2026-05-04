import { fetchWithAuth } from './fetchWithAuth';

export const getProviders = async ({ page = 1, limit = 10, nombre } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (nombre) params.append('nombre', nombre);
    return await fetchWithAuth(`/providers?${params}`);
};

export const createProvider = async (data) => {
    return await fetchWithAuth('/providers', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const updateProvider = async (id, data) => {
    return await fetchWithAuth(`/providers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
};

export const deactivateProvider = async (id) => {
    return await fetchWithAuth(`/providers/${id}`, {
        method: 'DELETE',
    });
};