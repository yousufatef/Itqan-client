import { useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  CustomEmailInput,
  CustomInput,
  CustomPasswordInput,
  CustomPhoneInput,
  CustomSelect,
} from '@/components/forms';
import MainLoader from '@/components/shared/loader/MainLoader';
import LoadingError from '@/components/shared/error/LoadingError';
import LoadingOverlay from '@/components/shared/loader/LoadingOverlay';
import useLiveForm from '@/hooks/useLiveForm';
import {
  CREATE_ADMIN_DIALOG_CLASS,
  createAdminDialogInputClassName,
  createAdminDialogSelectTriggerClassName,
} from '../constants/admin-dialog.constants';
import {
  createAdminDialogSchema,
  editAdminDialogSchema,
  type CreateAdminDialogValues,
  type EditAdminDialogValues,
} from '../schemas/admin-schema';
import { useCreateAdmin } from '../hooks/useCreateAdmin';
import { useUpdateAdmin } from '../hooks/useUpdateAdmin';
import { useGetAdminRolesPermissions } from '../hooks/useGetRoles';
import { useAdmin } from '../hooks/useGetAdmin';
import type { AssignedRole } from '../types/admin.types';

const emptyCreateValues: CreateAdminDialogValues = {
  firstName: '',
  lastName: '',
  email: '',
  roleId: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
};

const emptyEditValues: EditAdminDialogValues = {
  firstName: '',
  lastName: '',
  email: '',
  roleId: '',
  phoneNumber: '',
};

type CreateAdminDialogProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  adminId?: string;
};

export default function CreateAdminDialog({ isOpen, setIsOpen, adminId }: CreateAdminDialogProps) {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith('en');
  const isEdit = !!adminId;

  const { createAdmin, isLoading: isCreatingAdmin } = useCreateAdmin({
    onSuccess: () => setIsOpen(false),
  });

  const { updateAdmin, isLoading: isUpdatingAdmin } = useUpdateAdmin({
    onSuccess: () => setIsOpen(false),
  });

  const { adminData: admin, isLoading: isLoadingAdmin, error: adminError } = useAdmin(
    adminId ?? '',
    isOpen && isEdit,
  );

  const { adminData: roles, isLoading: isLoadingRoles } = useGetAdminRolesPermissions(isOpen);

  const isSaving = isCreatingAdmin || isUpdatingAdmin;

  const roleOptions = useMemo(
    () =>
      roles
        ?.filter((role: AssignedRole) => role.isActive)
        .map((role: AssignedRole) => ({
          value: role.id,
          label: isEnglish ? role.nameEn : role.nameAr,
        })) ?? [],
    [isEnglish, roles],
  );

  const createForm = useLiveForm<CreateAdminDialogValues>({
    resolver: zodResolver(createAdminDialogSchema(t)),
    defaultValues: emptyCreateValues,
  });

  const editForm = useLiveForm<EditAdminDialogValues>({
    resolver: zodResolver(editAdminDialogSchema(t)),
    defaultValues: emptyEditValues,
  });

  const onSubmitCreate = async (data: CreateAdminDialogValues) => {
    await createAdmin({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      roleId: data.roleId,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
  };

  const onSubmitEdit = async (data: EditAdminDialogValues) => {
    await updateAdmin({
      id: adminId ?? '',
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        roleId: data.roleId,
      },
    });
  };

  useEffect(() => {
    if (!isOpen) {
      createForm.reset(emptyCreateValues);
      editForm.reset(emptyEditValues);
      return;
    }

    if (!isEdit || !admin) return;

    editForm.reset({
      firstName: admin.firstName ?? admin.fullName?.split(' ')[0] ?? '',
      lastName:
        admin.lastName ?? admin.fullName?.split(' ').slice(1).join(' ') ?? admin.fullName ?? '',
      email: admin.email ?? '',
      roleId: admin.roleId ?? '',
      phoneNumber: admin.phoneNumber ?? '',
    });
  }, [isOpen, isEdit, admin, createForm, editForm]);

  const handleOpenChange = (open: boolean) => {
    if (isSaving) return;
    setIsOpen(open);
  };

  const fieldProps = {
    required: true as const,
    inputClassName: createAdminDialogInputClassName,
    labelClassName: 'type-body-sm text-neutral-900',
  };

  const isLoading = isLoadingRoles || (isEdit && isLoadingAdmin);

  const dialogFooter = (formValid: boolean, submitLabel: string) => (
    <DialogFooter className='shrink-0 border-t border-neutral-50 p-4 sm:p-6 sm:pt-4'>
      <div className='grid w-full grid-cols-2 gap-4'>
        <Button
          type='button'
          variant='outline'
          disabled={isSaving}
          className='h-12 border-primary-500 text-primary-500 hover:bg-primary-50 hover:text-primary-600'
          onClick={() => handleOpenChange(false)}
        >
          {t('admin.buttons.cancel')}
        </Button>
        <Button
          type='submit'
          disabled={!formValid || isSaving}
          className='h-12 bg-primary-500 text-neutral-900 hover:bg-primary-600'
        >
          {isSaving ? <Spinner /> : submitLabel}
        </Button>
      </div>
    </DialogFooter>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={CREATE_ADMIN_DIALOG_CLASS}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <div className='flex max-h-[90vh] flex-col'>
          <DialogHeader className='flex shrink-0 flex-row items-center justify-between gap-4 border-b border-neutral-50 p-4 sm:p-6 sm:pb-4'>
            <DialogTitle className='type-heading-xs text-neutral-900 sm:type-heading-sm'>
              {isEdit ? t('admin.editUser') : t('admin.addUser')}
            </DialogTitle>
            {!isSaving && (
              <DialogClose className='shrink-0 rounded-md p-0.5 text-neutral-900 hover:bg-neutral-50'>
                <X className='size-6 sm:size-8' aria-hidden='true' />
                <span className='sr-only'>{t('admin.buttons.cancel')}</span>
              </DialogClose>
            )}
          </DialogHeader>

          {adminError ? (
            <div className='p-6'>
              <LoadingError errorMsg={adminError.message} />
            </div>
          ) : isLoading ? (
            <div className='p-6'>
              <MainLoader />
            </div>
          ) : isEdit ? (
            <Form {...editForm}>
              <form
                id='edit-admin-form'
                onSubmit={editForm.handleSubmit(onSubmitEdit)}
                className='relative flex min-h-0 flex-1 flex-col'
              >
                <div className='min-h-0 flex-1 overflow-y-auto p-4 sm:p-6'>
                  <div className='flex flex-col gap-6'>
                    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-4'>
                      <CustomInput
                        {...fieldProps}
                        control={editForm.control}
                        name='firstName'
                        label={t('admin.form.lable.firstName')}
                        placeholder={t('admin.form.placeholders.fullName')}
                      />
                      <CustomInput
                        {...fieldProps}
                        control={editForm.control}
                        name='lastName'
                        label={t('admin.form.lable.lastName')}
                        placeholder={t('admin.form.placeholders.fullName')}
                      />
                    </div>

                    <CustomEmailInput
                      {...fieldProps}
                      control={editForm.control}
                      name='email'
                      label={t('admin.form.lable.email')}
                      placeholder={t('admin.form.placeholders.email')}
                      disabled
                    />

                    <CustomSelect
                      control={editForm.control}
                      name='roleId'
                      label={t('admin.form.lable.userRole')}
                      labelClassName='type-body-sm text-neutral-900'
                      placeholder={t('admin.form.placeholders.userRole')}
                      required
                      options={roleOptions}
                      triggerClassName={createAdminDialogSelectTriggerClassName}
                    />

                    <CustomPhoneInput
                      {...fieldProps}
                      control={editForm.control}
                      name='phoneNumber'
                      label={t('admin.form.lable.phoneNumber')}
                      placeholder={t('admin.form.placeholders.phoneNumber')}
                    />
                  </div>
                </div>

                {isSaving && <LoadingOverlay />}
                {dialogFooter(editForm.formState.isValid, t('admin.buttons.update'))}
              </form>
            </Form>
          ) : (
            <Form {...createForm}>
              <form
                id='create-admin-form'
                onSubmit={createForm.handleSubmit(onSubmitCreate)}
                className='relative flex min-h-0 flex-1 flex-col'
              >
                <div className='min-h-0 flex-1 overflow-y-auto p-4 sm:p-6'>
                  <div className='flex flex-col gap-6'>
                    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-4'>
                      <CustomInput
                        {...fieldProps}
                        control={createForm.control}
                        name='firstName'
                        label={t('admin.form.lable.firstName')}
                        placeholder={t('admin.form.placeholders.fullName')}
                      />
                      <CustomInput
                        {...fieldProps}
                        control={createForm.control}
                        name='lastName'
                        label={t('admin.form.lable.lastName')}
                        placeholder={t('admin.form.placeholders.fullName')}
                      />
                    </div>

                    <CustomEmailInput
                      {...fieldProps}
                      control={createForm.control}
                      name='email'
                      label={t('admin.form.lable.email')}
                      placeholder={t('admin.form.placeholders.email')}
                    />

                    <CustomSelect
                      control={createForm.control}
                      name='roleId'
                      label={t('admin.form.lable.userRole')}
                      labelClassName='type-body-sm text-neutral-900'
                      placeholder={t('admin.form.placeholders.userRole')}
                      required
                      options={roleOptions}
                      triggerClassName={createAdminDialogSelectTriggerClassName}
                    />

                    <CustomPhoneInput
                      {...fieldProps}
                      control={createForm.control}
                      name='phoneNumber'
                      label={t('admin.form.lable.phoneNumber')}
                      placeholder={t('admin.form.placeholders.phoneNumber')}
                    />

                    <CustomPasswordInput
                      {...fieldProps}
                      control={createForm.control}
                      name='password'
                      label={t('admin.form.lable.password')}
                      placeholder={t('admin.form.placeholders.password')}
                    />

                    <CustomPasswordInput
                      {...fieldProps}
                      control={createForm.control}
                      name='confirmPassword'
                      label={t('admin.form.lable.confirmPassword')}
                      placeholder={t('admin.form.placeholders.confirmPassword')}
                    />
                  </div>
                </div>

                {isSaving && <LoadingOverlay />}
                {dialogFooter(createForm.formState.isValid, t('admin.buttons.save'))}
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
