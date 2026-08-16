import { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import Toaster from '@/components/ui/toaster';
import { useDirection, getLanguageDirection } from '../i18n/useDirection';
import { router } from './router';
import { DirectionProvider } from '@/components/ui/direction';
import { useTranslation } from 'react-i18next';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

function App() {
  useDirection();

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
            staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh and won't refetch
          },
          mutations: {
            retry: false,
          },
        },
      }),
    [],
  );
  const { i18n } = useTranslation();
  useNetworkStatus();

  return (
    <DirectionProvider direction={getLanguageDirection(i18n.language)}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </DirectionProvider>
  );
}

export default App;
