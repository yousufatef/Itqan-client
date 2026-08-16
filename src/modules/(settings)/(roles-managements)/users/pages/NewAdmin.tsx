
import useLiveForm from '@/hooks/useLiveForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import CustomInput, { CustomPasswordInput, CustomSelect } from '@/components/forms';
import { useEffect } from 'react';
import { Form } from '@/components/ui/form';
import { useParams } from 'react-router-dom';
import { useAdmin } from '../hooks/useGetAdmin';
import { useUpdateAdmin } from '@/modules/(settings)/(roles-managements)/users/hooks/useUpdateAdmin';
import { useCreateAdmin } from '@/modules/(settings)/(roles-managements)/users/hooks/useCreateAdmin';
import PageLayout from '@/components/layout/PageLayout';
import { useTranslation } from 'react-i18next';
import { createAdminSchema, type AdminFormValues } from '../schemas/admin-schema';
import MainLoader from '@/components/shared/loader/MainLoader';
import ErrorPage from '@/modules/error/ErrorPage';
import { useGetAdminRolesPermissions } from '../hooks/useGetRoles';
import { useDirection } from '@/i18n/useDirection';
import type { AssignedRole } from '../types/admin.types';

type NewAdminProps = {
  mode: 'add' | 'edit';
};
export default function NewAdmin({ mode = 'edit' }: NewAdminProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const direction = useDirection();
  const isEdit = mode === 'edit';
  const { adminId } = useParams<{ adminId: string }>();
  const { adminData: admin, isLoading, error } = useAdmin(adminId ?? '', isEdit);
  const { updateAdmin } = useUpdateAdmin();
  const { createAdmin } = useCreateAdmin();
  const { adminData: roles, isLoading: isLoadingRoles } = useGetAdminRolesPermissions();
  const roleOptions =
    roles
      ?.filter((role: AssignedRole) => role.isActive)
      .map((role: AssignedRole) => ({
        value: role.id,
        label: direction === 'ltr' ? role.nameEn : role.nameAr,
      })) ?? [];

  const form = useLiveForm<AdminFormValues>({
    resolver: zodResolver(createAdminSchema(t, isEdit)),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      roleId: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: AdminFormValues) => {
    if (isEdit) {
      await updateAdmin({ id: adminId ?? '', data });
    } else {
      await createAdmin(data);
    }
  };

  useEffect(() => {
    if (!admin) return;

    form.reset({
      fullName: admin.fullName ?? '',
      email: admin.email ?? '',
      phoneNumber: admin.phoneNumber ?? '',
      roleId: admin.roleId ?? '',
    });
  }, [admin, form]);

  if (isLoading || isLoadingRoles) {
    return <MainLoader />;
  }

  if (error) {
    return <ErrorPage />;
  }

  return (
    <Form {...form}>
      <form
        className='h-full'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <PageLayout
          className='mt-4.5'
          mode='form'
          title={isEdit ? t('admin.editAdminUser') : t('admin.addAdminUser')}
          subtitle={t('admin.addAdminSubTitle')}
          onBack={() => navigate(-1)}
          primaryLabel={isEdit ? t('admin.buttons.update') : t('admin.buttons.create')}
          secondaryLabel={t('admin.buttons.cancel')}
          onSecondaryClick={() => {
            navigate(-1);
          }}
        >
          <div className='grid items-start gap-6 lg:grid-cols-[1fr_420px]'>
            {/* LEFT */}
            <div className='bg-card rounded-xl border p-6'>
              <h2 className='type-heading-sm mb-6'>{t('admin.adminInformation')}</h2>

              <div className='grid items-start gap-x-4 gap-y-2 md:grid-cols-2'>
                <CustomInput
                  control={form.control}
                  label={t('admin.form.lable.fullName')}
                  name='fullName'
                  placeholder={t('admin.form.placeholders.fullName')}
                  required
                />

                <CustomInput
                  control={form.control}
                  label={t('admin.form.lable.email')}
                  name='email'
                  placeholder={t('admin.form.placeholders.email')}
                  required
                  disabled={isEdit}
                />

                <CustomInput
                  control={form.control}
                  label={t('admin.form.lable.phone')}
                  name='phoneNumber'
                  placeholder={t('admin.form.placeholders.phone')}
                  required
                />

                <CustomSelect
                  control={form.control}
                  label={t('admin.form.lable.role')}
                  name='roleId'
                  placeholder={t('admin.form.placeholders.role')}
                  required
                  options={roleOptions}
                />

                {!isEdit ? (
                  <>
                    <CustomPasswordInput
                      control={form.control}
                      label={t('admin.form.lable.password', { defaultValue: 'Password' })}
                      name='password'
                      placeholder={t('admin.form.placeholders.password', {
                        defaultValue: 'Enter password',
                      })}
                      required
                    />
                    <CustomPasswordInput
                      control={form.control}
                      label={t('admin.form.lable.confirmPassword', {
                        defaultValue: 'Confirm password',
                      })}
                      name='confirmPassword'
                      placeholder={t('admin.form.placeholders.confirmPassword', {
                        defaultValue: 'Confirm password',
                      })}
                      required
                    />
                  </>
                ) : null}
              </div>
            </div>


          </div>
        </PageLayout>
      </form>
    </Form>
  );
}
