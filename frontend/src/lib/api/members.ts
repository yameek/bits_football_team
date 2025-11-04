import api from '../api';
import type { Member, CreateMemberDto, UpdateMemberDto, ContributionDto } from '@/types/member';

export const memberApi = {
  getAll: async (): Promise<Member[]> => {
    const { data } = await api.get('/members');
    return data;
  },

  getById: async (id: number): Promise<Member> => {
    const { data } = await api.get(`/members/${id}`);
    return data;
  },

  getByPin: async (pin: string): Promise<Member> => {
    const { data } = await api.get(`/members/by-pin/${pin}`);
    return data;
  },

  create: async (memberData: CreateMemberDto): Promise<Member> => {
    const { data } = await api.post('/members', memberData);
    return data;
  },

  update: async (id: number, memberData: UpdateMemberDto): Promise<Member> => {
    const { data } = await api.patch(`/members/${id}`, memberData);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/members/${id}`);
  },

  addContribution: async (id: number, contribution: ContributionDto): Promise<any> => {
    const { data } = await api.post(`/members/${id}/contributions`, contribution);
    return data;
  },

  getTransactions: async (id: number): Promise<any[]> => {
    const { data } = await api.get(`/members/${id}/transactions`);
    return data;
  },

  getAttendance: async (id: number): Promise<any[]> => {
    const { data } = await api.get(`/members/${id}/attendance`);
    return data;
  },
};
