import * as dashboardRepo from '../repositories/dashboard.repository.js';

export const getMetrics = async () => {
  return await dashboardRepo.getMetrics();
};