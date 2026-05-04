import { fetchWithAuth } from './fetchWithAuth';

export const getDashboardMetrics = async () => {
  return await fetchWithAuth('/dashboard');
};