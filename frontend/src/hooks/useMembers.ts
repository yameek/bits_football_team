'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memberApi } from '@/lib/api/members';
import type { CreateMemberDto, UpdateMemberDto, ContributionDto } from '@/types/member';

export const useMembers = () => {
  return useQuery({
    queryKey: ['members'],
    queryFn: memberApi.getAll,
    staleTime: 30000,
  });
};

export const useMember = (id: number) => {
  return useQuery({
    queryKey: ['members', id],
    queryFn: () => memberApi.getById(id),
    enabled: !!id,
  });
};

export const useMemberByPin = (pin: string) => {
  return useQuery({
    queryKey: ['members', 'pin', pin],
    queryFn: () => memberApi.getByPin(pin),
    enabled: !!pin && pin.length >= 4,
  });
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMemberDto) => memberApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMemberDto }) =>
      memberApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['members', variables.id] });
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => memberApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};

export const useAddContribution = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ContributionDto }) =>
      memberApi.addContribution(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['members', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};
