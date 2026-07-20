import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDoctorStatsApi,
  getConsultationsApi,
  claimConsultationApi,
  saveNotesApi,
  reviewConsultationApi,
  getClinicPatientsApi,
  uploadDoctorAttachmentApi
} from '../api/doctor.api.js';

export const useDoctorStats = () => {
  return useQuery({
    queryKey: ['doctor', 'stats'],
    queryFn: getDoctorStatsApi,
  });
};

export const useDoctorConsultations = (status) => {
  return useQuery({
    queryKey: ['doctor', 'consultations', status],
    queryFn: () => getConsultationsApi(status),
  });
};

export const useClaimConsultation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: claimConsultationApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor', 'consultations'] });
      queryClient.invalidateQueries({ queryKey: ['doctor', 'stats'] });
    },
  });
};

export const useSaveNotes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ consultationId, notes }) => saveNotesApi(consultationId, notes),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['timeline', variables.consultationId] });
      queryClient.invalidateQueries({ queryKey: ['clinical-context', variables.consultationId] });
    },
  });
};

export const useReviewConsultation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewConsultationApi,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['doctor', 'consultations'] });
      queryClient.invalidateQueries({ queryKey: ['doctor', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['timeline', variables] });
      queryClient.invalidateQueries({ queryKey: ['clinical-context', variables] });
    },
  });
};

export const useClinicPatients = () => {
  return useQuery({
    queryKey: ['doctor', 'patients'],
    queryFn: getClinicPatientsApi,
  });
};

export const useUploadDoctorAttachment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ consultationId, file }) => uploadDoctorAttachmentApi(consultationId, file),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clinical-context', variables.consultationId] });
    },
  });
};
