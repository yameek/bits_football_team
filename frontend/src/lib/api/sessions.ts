import api from '../api';
import type { Session, CreateSessionDto, Attendance, MarkAttendanceDto } from '@/types/session';

export const sessionApi = {
  getAll: async (params?: any): Promise<Session[]> => {
    const { data } = await api.get('/sessions', { params });
    return data;
  },

  getById: async (id: number): Promise<Session> => {
    const { data } = await api.get(`/sessions/${id}`);
    return data;
  },

  create: async (sessionData: CreateSessionDto): Promise<Session> => {
    const { data } = await api.post('/sessions', sessionData);
    return data;
  },

  update: async (id: number, sessionData: Partial<CreateSessionDto>): Promise<Session> => {
    const { data } = await api.patch(`/sessions/${id}`, sessionData);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/sessions/${id}`);
  },

  getAttendance: async (id: number): Promise<Attendance[]> => {
    const { data } = await api.get(`/sessions/${id}/attendance`);
    return data;
  },

  markAttendanceBulk: async (id: number, attendances: MarkAttendanceDto[]): Promise<any> => {
    const { data } = await api.post(`/sessions/${id}/attendance/bulk`, { attendances });
    return data;
  },

  calculateCost: async (id: number): Promise<any> => {
    const { data } = await api.get(`/sessions/${id}/total-cost`);
    return data;
  },

  finalize: async (id: number): Promise<any> => {
    const { data } = await api.post(`/sessions/${id}/finalize`);
    return data;
  },
};
