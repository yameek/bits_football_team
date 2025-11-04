'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionApi } from '@/lib/api/sessions';
import type { CreateSessionDto, MarkAttendanceDto } from '@/types/session';

export const useSessions = (params?: any) => {
  return useQuery({
    queryKey: ['sessions', params],
    queryFn: () => sessionApi.getAll(params),
    staleTime: 30000,
  });
};

export const useSession = (id: number) => {
  return useQuery({
    queryKey: ['sessions', id],
    queryFn: () => sessionApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSessionDto) => sessionApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

export const useUpdateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateSessionDto> }) =>
      sessionApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['sessions', variables.id] });
    },
  });
};

export const useSessionAttendance = (sessionId: number) => {
  return useQuery({
    queryKey: ['sessions', sessionId, 'attendance'],
    queryFn: () => sessionApi.getAttendance(sessionId),
    enabled: !!sessionId,
  });
};

export const useMarkAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MarkAttendanceDto[] }) =>
      sessionApi.markAttendanceBulk(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sessions', variables.id, 'attendance'] });
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};

export const useFinalizeSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sessionApi.finalize(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['sessions', id] });
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};
