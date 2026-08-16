import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useBlocker } from 'react-router-dom';
import ConfirmDialog from './CustomConfirmDialog';
import { useTranslation } from 'react-i18next';

export default function DiscardChanges() {
  const { t } = useTranslation();
  const {
    formState: { isDirty, isSubmitSuccessful, isSubmitting },
  } = useFormContext();

  // Warn on tab close / hard refresh
  useEffect(() => {
    if (!isDirty || isSubmitSuccessful || isSubmitting) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty, isSubmitSuccessful, isSubmitting]);

  // Block all in-app navigation (links, back button) using React Router state
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && !isSubmitSuccessful && !isSubmitting && currentLocation.pathname !== nextLocation.pathname,
  );

  return (
    <ConfirmDialog
      open={blocker.state === 'blocked'}
      title={t('common.ExitWithoutSaving')}
      description={
        <p className='text-muted-foreground'>{t('common.AnyDiscardedUnsavedChanges')}</p>
      }
      confirmText={t('common.exit')}
      cancelText={t('common.cancel')}
      onConfirm={() => {
        if (blocker.state === 'blocked') {
          blocker.proceed();
        }
      }}
      onCancel={() => {
        if (blocker.state === 'blocked') {
          blocker.reset();
        }
      }}
      mode='destructive'
      className='sm:max-w-86.5'
    />
  );
}
