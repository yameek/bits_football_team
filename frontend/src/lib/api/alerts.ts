import api from '../api';
import type { Alert, ResolveAlertDto } from '@/types/alert';

export const alertApi = {
  getAll: async (params?: any): Promise<Alert[]> => {
    const { data } = await api.get('/alerts', { params });
    return data;
  },

  getUnresolved: async (): Promise<Alert[]> => {
    const { data } = await api.get('/alerts/unresolved');
    return data;
  },

  resolve: async (id: number, dto?: ResolveAlertDto): Promise<Alert> => {
    const { data } = await api.post(`/alerts/${id}/resolve`, dto);
    return data;
  },

  getStatistics: async (): Promise<any> => {
    const { data } = await api.get('/alerts/statistics');
    return data;
  },
};
