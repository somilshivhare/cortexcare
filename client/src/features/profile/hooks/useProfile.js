import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import {
  getPatientProfileApi,
  updatePatientProfileApi,
  getDoctorProfileApi,
  updateDoctorProfileApi
} from '../api/profile.api.js';

export const useProfile = (role) => {
  const queryClient = useQueryClient();
  const isDoctor = role === 'DOCTOR';

  const profileQuery = useQuery({
    queryKey: ['profile', role],
    queryFn: isDoctor ? getDoctorProfileApi : getPatientProfileApi,
  });

  const updateMutation = useMutation({
    mutationFn: isDoctor ? updateDoctorProfileApi : updatePatientProfileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', role] });
      queryClient.invalidateQueries({ queryKey: ['patient', 'profile'] });
    },
  });

  // Simulated Cloudinary avatar link persistence
  const [avatarUrl, setAvatarUrl] = useState(() => {
    return localStorage.getItem(`avatar_${role}`) || '';
  });

  const updateAvatar = (url) => {
    setAvatarUrl(url);
    if (url) {
      localStorage.setItem(`avatar_${role}`, url);
    } else {
      localStorage.removeItem(`avatar_${role}`);
    }
  };

  return {
    profile: isDoctor ? profileQuery.data?.doctor : profileQuery.data?.patient,
    avatarUrl,
    updateAvatar,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    updateProfile: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
};
