import { useQuery } from '@tanstack/react-query';
import { getProfileApi, getClinicalContextsApi } from '../api/patient.api.js';

export const usePatientDashboard = () => {
  const profileQuery = useQuery({
    queryKey: ['patient', 'profile'],
    queryFn: getProfileApi,
  });

  const contextsQuery = useQuery({
    queryKey: ['patient', 'clinical-contexts'],
    queryFn: getClinicalContextsApi,
  });

  return {
    profile: profileQuery.data?.patient || null,
    clinicalContexts: contextsQuery.data?.clinicalContexts || [],
    isLoading: profileQuery.isLoading || contextsQuery.isLoading,
    isError: profileQuery.isError || contextsQuery.isError,
    error: profileQuery.error || contextsQuery.error,
    refetch: () => {
      profileQuery.refetch();
      contextsQuery.refetch();
    },
  };
};
