import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { toast } from 'sonner'; // or react-hot-toast

export const useNetworkStatus = () => {
  const offlineToastId = useRef<string | number | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleOffline = () => {
      offlineToastId.current = toast.error(t('toaster.connectionLost'), {
        dismissible: false,
        duration: Infinity,
        closeButton: false,
      });
    };

    const handleOnline = () => {
      if (offlineToastId.current) {
        toast.dismiss(offlineToastId.current);
      }

      toast.success(t('toaster.connectionRestored'));
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    if (!navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [t]);
};
