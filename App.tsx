import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          {/* Router ve diğer provider'lar */}
        </SafeAreaProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
