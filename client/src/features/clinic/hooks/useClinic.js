import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getClinicDetailsApi,
  createClinicApi,
  joinClinicApi,
  getClinicMembersApi
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
