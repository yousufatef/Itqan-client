import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForgetPassword } from '@/modules/auth/hooks/useForgetPassword';
import CustomInput from '@/components/forms';
import useSyncFormLocalization from '@/hooks/useSyncFormLocalization';
import AuthPageShell from '@/modules/auth/components/AuthPageShell';

function ResetPasswordPage() {
  const { t } = useTranslation();

  const schema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, { message: t('forms.errors.email.required') })
          .email({ message: t('forms.errors.email.invalid') }),
      }),
    [t],
  );
  type FormData = z.infer<typeof schema>;

  const { forgetPassword, isLoading } = useForgetPassword();
  const form = useForm<FormData>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(schema),
  });

  useSyncFormLocalization(form);

  const onSubmit = async (data: FormData) => {
    await forgetPassword(data);
  };

  return (
    <AuthPageShell
      title={t('pages.resetPassword.title')}
      description={t('pages.resetPassword.description')}
    >
      <FormProvider {...form}>
        <form
          onSubmit={(e) => {
            void form.handleSubmit(onSubmit)(e);
          }}
          autoComplete='off'
          className='flex w-full flex-col gap-8'
        >
          <CustomInput
            name='email'
            placeholder={t('forms.placeholders.email')}
            label={t('forms.labels.email')}
            required
            control={form.control}
            startIcon={<Mail className='size-5' aria-hidden='true' />}
            inputClassName='rounded-[4px] bg-white! border-neutral-100'
            onKeyDown={(e) => {
              if (e.key === ' ') {
                e.preventDefault();
              }
            }}
          />

          <div className='flex flex-col gap-4'>
            <Button
              type='submit'
              className='type-body-md bg-primary-500 hover:bg-primary-600 h-12 w-full rounded-[4px] '
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : t('forms.buttonLabels.resetLink')}
            </Button>

            <Link
              to='/login'
              className='type-body-md text-primary-500 hover:text-primary-600 text-center underline underline-offset-4'
            >
              {t('pages.login.backToLogin')}
            </Link>
          </div>
        </form>
      </FormProvider>
    </AuthPageShell>
  );
}

export default ResetPasswordPage;
