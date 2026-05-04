import { fetchWithAuth } from './fetchWithAuth';

export const getPurchases = async ({ page = 1, limit = 10, tipo } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (tipo) params.append('tipo', tipo);
  return await fetchWithAuth(`/purchases?${params}`);
};

export const getPurchaseById = async (id) => {
  return await fetchWithAuth(`/purchases/${id}`);
};