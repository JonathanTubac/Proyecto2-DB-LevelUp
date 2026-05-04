import * as dashboardService from '../services/dashboard.service.js';

export const getMetrics = async (req, res, next) => {
  try {
    const metrics = await dashboardService.getMetrics();
    res.json({ success: true, data: metrics });
  } catch (err) { next(err); }
};