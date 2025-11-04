import api from '../api';
import type { Transaction, BulkPaymentDto } from '@/types/transaction';

export const transactionApi = {
  getAll: async (params?: any): Promise<Transaction[]> => {
    const { data } = await api.get('/transactions', { params });
    return data;
  },

  bulkPayment: async (payment: BulkPaymentDto): Promise<any> => {
    const { data } = await api.post('/transactions/bulk-payment', payment);
    return data;
  },

  getBulkGroups: async (): Promise<any[]> => {
    const { data } = await api.get('/transactions/bulk-groups');
    return data;
  },

  getStatistics: async (): Promise<any> => {
    const { data } = await api.get('/transactions/statistics');
    return data;
  },
};
