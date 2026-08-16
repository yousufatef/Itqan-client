import { resendOtpApi } from '@/modules/auth/service/auth.service';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export const RESEND_OTP_COOLDOWN_SECONDS = 120;

function ResendOtp() {
  const [timer, setTimer] = useState(RESEND_OTP_COOLDOWN_SECONDS);
  const [isResending, setIsResending] = useState(false);
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const { t } = useTranslation();

  useEffect(() => {
    if (timer <= 0) return;

    const timerId = setInterval(() => {
      setTimer((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [timer]);

  const handleResend = async () => {
    if (!email) {
      toast.error(t('forms.errors.emailMissing'));
      return;
    }

    try {
      setIsResending(true);
      await resendOtpApi({ email });
      setTimer(RESEND_OTP_COOLDOWN_SECONDS);
      toast.success(t('forms.messages.otpResent'));
    } catch {
      // Error toast is already shown by apiRequest
    } finally {
      setIsResending(false);
    }
  };

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const isDisabled = timer > 0 || isResending;

  return (
    <div className='mt-4 flex flex-wrap items-center justify-center gap-1 text-sm'>
      <span className='text-neutral-400'>{t('forms.buttonLabels.didNotGetCode')}</span>

      <button
        className='type-body-md disabled:cursor-not-allowed disabled:opacity-50'
        onClick={handleResend}
        disabled={isDisabled}
        type='button'
      >
        {timer === 0 ? (
          <span className='type-body-md text-primary-500 hover:text-primary-600 cursor-pointer underline underline-offset-4'>
            {t('forms.buttonLabels.resendAgain')}
          </span>
        ) : (
          <span className='text-neutral-400'>
            {t('forms.buttonLabels.resendEmail')} ({String(minutes).padStart(2, '0')}:
            {String(seconds).padStart(2, '0')})
          </span>
        )}
      </button>
    </div>
  );
}

export default ResendOtp;
