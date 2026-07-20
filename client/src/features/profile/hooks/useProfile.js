import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/hooks/useAuth.js';
import {
  getPatientProfileApi,
  updatePatientProfileApi,
  getDoctorProfileApi,
  updateDoctorProfileApi
} from '../api/profile.api.js';

export const useProfile = (role) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isDoctor = role === 'DOCTOR';
  const userId = user?.id || '';

  const profileQuery = useQuery({
    queryKey: ['profile', role],
    queryFn: isDoctor ? getDoctorProfileApi : getPatientProfileApi,
    enabled: role === 'DOCTOR' || role === 'PATIENT',
  });

  const updateMutation = useMutation({
    mutationFn: isDoctor ? updateDoctorProfileApi : updatePatientProfileApi,
    onSuccess: () => {
      if (role === 'DOCTOR' || role === 'PATIENT') {
        queryClient.invalidateQueries({ queryKey: ['profile', role] });
        queryClient.invalidateQueries({ queryKey: ['patient', 'profile'] });
      }
    },
  });

  const profile = isDoctor ? profileQuery.data?.doctor : profileQuery.data?.patient;

  // Simulated Cloudinary avatar link persistence
  const [avatarUrl, setAvatarUrl] = useState(() => {
    const key = userId ? `avatar_${role}_${userId}` : `avatar_${role}`;
    return localStorage.getItem(key) || '';
  });

  useEffect(() => {
    if (profile?.avatarUrl) {
      setAvatarUrl(profile.avatarUrl);
    }
  }, [profile]);

  const updateAvatar = (url) => {
    const key = userId ? `avatar_${role}_${userId}` : `avatar_${role}`;
    setAvatarUrl(url);
    if (url) {
      localStorage.setItem(key, url);
    } else {
      localStorage.removeItem(key);
    }
  };

  return {
    profile,
    avatarUrl,
    updateAvatar,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    updateProfile: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
};
