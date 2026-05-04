import { fetchWithAuth } from './fetchWithAuth';

export const getWallets = async ({ page = 1, limit = 10 } = {}) => {
    const params = new URLSearchParams({ page, limit });
    return await fetchWithAuth(`/wallets?${params}`);
};

export const updateWallet = async (id, amount) => {
    return await fetchWithAuth(`/wallets/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ amount }),
    });
};