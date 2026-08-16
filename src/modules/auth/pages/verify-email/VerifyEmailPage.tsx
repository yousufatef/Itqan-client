import { useTranslation } from 'react-i18next';
import { useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/InputOtp';
import { useOtp } from '@/modules/auth/hooks/useOtp';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import ResendOtp from './components/ResendOtp';
import useSyncFormLocalization from '@/hooks/useSyncFormLocalization';
import AuthPageShell from '@/modules/auth/components/AuthPageShell';

function VerifyEmailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') ?? '';

  useEffect(() => {
    if (!email) {
      void navigate('/forget-password', { replace: true });
    }
  }, [email, navigate]);

  const schema = useMemo(
    () =>
      z.object({
        otp: z
          .string({
            message: t('forms.errors.otp'),
          })
          .regex(/^\d+$/, {
            message: t('forms.errors.otp'),
          })
          .length(4, {
            message: t('forms.errors.otp'),
          }),
      }),
    [t],
  );
  type FormData = z.infer<typeof schema>;

  const { otp, isLoading } = useOtp();
  const form = useForm<FormData>({
    defaultValues: {
      otp: '',
    },
    resolver: zodResolver(schema),
  });

  useSyncFormLocalization(form);

  const onSubmit = async (data: FormData) => {
    await otp({ otp: data.otp, email });
  };

  return (
    <AuthPageShell
      title={t('pages.verifyEmail.title')}
      description={t('pages.verifyEmail.description', { email })}
    >
      <FormProvider {...form}>
        <form
          onSubmit={(e) => {
            void form.handleSubmit(onSubmit)(e);
          }}
          autoComplete='off'
          className='flex w-full flex-col'
        >
          <FormField
            control={form.control}
            name='otp'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputOTP
                    maxLength={4}
                    pattern='[0-9]*'
                    inputMode='numeric'
                    value={field.value || ''}
                    onChange={(value) => {
                      const numericOnly = value.replace(/[^0-9]/g, '');
                      field.onChange(numericOnly);
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                  >
                    <InputOTPGroup className='mx-auto flex items-center justify-center gap-3'>
                      {[...Array(4)].map((_, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className='h-12 w-12 rounded-[4px] border border-neutral-100 bg-white text-center text-2xl font-bold text-neutral-900 first:rounded-[4px] first:border last:rounded-[4px]'
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>

                <FormMessage className='text-center' />
              </FormItem>
            )}
          />

          <ResendOtp />

          <Button
            type='submit'
            className='type-body-md bg-primary-500 hover:bg-primary-600 mt-8 h-12 w-full rounded-[4px] text-neutral-900'
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : t('forms.buttonLabels.verifyOtp')}
          </Button>

          <Link
            to='/forget-password'
            className='type-body-md text-primary-500 hover:text-primary-600 mt-4 text-center underline underline-offset-4'
          >
            {t('forms.buttonLabels.resetLink')}
          </Link>
        </form>
      </FormProvider>
    </AuthPageShell>
  );
}

export default VerifyEmailPage;
