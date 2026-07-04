import { QueryClient } from '@tanstack/react-query';

// Configure the QueryClient with production defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevent redundant background fetches on tab clicks
      retry: 1,                    // Limit automatic retry attempts on query failure
      staleTime: 5 * 60 * 1000,     // Consider data fresh for 5 minutes
    },
    mutations: {
      retry: false,                // Never retry failed mutating operations automatically
    },
  },
});
