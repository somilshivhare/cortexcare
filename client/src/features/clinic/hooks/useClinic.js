import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getClinicDetailsApi,
  createClinicApi,
  joinClinicApi,
  getClinicMembersApi,
  leaveClinicApi,
  regenerateClinicCodeApi
} from '../api/clinic.api.js';

export const useClinicDetails = () => {
  return useQuery({
    queryKey: ['clinic', 'details'],
    queryFn: getClinicDetailsApi,
    retry: false, // Don't retry if user is not in a clinic
  });
};

export const useClinicMembers = (enabled) => {
  return useQuery({
    queryKey: ['clinic', 'members'],
    queryFn: getClinicMembersApi,
    enabled: !!enabled,
  });
};

export const useCreateClinic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createClinicApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic'] });
      queryClient.invalidateQueries({ queryKey: ['patient', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['doctor', 'profile'] });
    },
  });
};

export const useJoinClinic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: joinClinicApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic'] });
      queryClient.invalidateQueries({ queryKey: ['patient', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['doctor', 'profile'] });
    },
  });
};

export const useLeaveClinic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: leaveClinicApi,
    onSuccess: () => {
      queryClient.setQueryData(['clinic', 'details'], null);
      queryClient.invalidateQueries({ queryKey: ['clinic'] });
      queryClient.invalidateQueries({ queryKey: ['patient', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['doctor', 'profile'] });
    },
  });
};

export const useRegenerateClinicCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: regenerateClinicCodeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic'] });
    },
  });
};
