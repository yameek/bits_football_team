import api from '../api';

export const reportApi = {
  getTeamBalance: async (): Promise<any> => {
    const { data } = await api.get('/reports/team-balance');
    return data;
  },

  getMemberBalances: async (): Promise<any> => {
    const { data } = await api.get('/members/team-balance');
    return data;
  },

  getSpendingByCategory: async (): Promise<any> => {
    const { data } = await api.get('/reports/spending-by-category');
    return data;
  },

  getSessionCosts: async (params?: any): Promise<any> => {
    const { data } = await api.get('/reports/session-costs', { params });
    return data;
  },

  getAttendanceSummary: async (): Promise<any> => {
    const { data } = await api.get('/reports/attendance-summary');
    return data;
  },
};
