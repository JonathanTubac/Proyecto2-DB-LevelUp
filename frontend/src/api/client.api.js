import { fetchWithAuth } from './fetchWithAuth';

export const getProductsClient = async ({ page = 1, limit = 12, nombre, categoria } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (nombre)    params.append('nombre', nombre);
  if (categoria) params.append('categoria', categoria);
  return await fetchWithAuth(`/products?${params}`);
};

export const getCategoriesClient = async () => {
  return await fetchWithAuth('/categories?limit=50');
};

export const getMyWallet = async () => {
  return await fetchWithAuth('/wallets/wallet');
};

export const rechargeWallet = async (amount) => {
  return await fetchWithAuth('/wallets/recharge', {
    method: 'POST',
    body:   JSON.stringify({ amount }),
  });
};

export const buyProducts = async (productos) => {
  return await fetchWithAuth('/purchases', {
    method: 'POST',
    body:   JSON.stringify({ tipo: 'en_linea', productos }),
  });
};

export const getMyPurchases = async ({ page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams({ page, limit });
  return await fetchWithAuth(`/purchases/my?${params}`);
};

export const getMyProfile = async () => {
  return await fetchWithAuth('/users/me');
};