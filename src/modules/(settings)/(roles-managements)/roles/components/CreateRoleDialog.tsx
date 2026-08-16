import { useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Accordion } from '@/components/ui/accordion';
import CustomInput from '@/components/forms';
import MainLoader from '@/components/shared/loader/MainLoader';
import LoadingError from '@/components/shared/error/LoadingError';
import LoadingOverlay from '@/components/shared/loader/LoadingOverlay';
import useLiveForm from '@/hooks/useLiveForm';
import { buildDefaultPermissions, groupPermissionsByModule } from '@/utils/permissions';
import { titleEnSchema, titleItSchema } from '@/utils/schemas';
import UseCreateRole from '../hooks/UseCreateRole';
import useUpdateRole from '../hooks/useUpdateRole';
import useGetPermissions from '../hooks/useGetPermissions';
import useRoleDetails from '../hooks/useRoleDetails';
import PermissionModuleCard from './role-form/PermissionModuleCard';
import {
  CREATE_ROLE_DIALOG_CLASS,
  createRoleDialogInputClassName,
} from '../constants/role-dialog.constants';

const permissionValueSchema = z.object({
  canRead: z.boolean(),
  canCreate: z.boolean(),
  canUpdate: z.boolean(),
  canDelete: z.boolean(),
});

const roleSchema = z.object({
  nameEN: titleEnSchema,
  nameIt: titleItSchema,
  permissions: z.record(z.string(), permissionValueSchema),
});

type RoleFormValues = z.infer<typeof roleSchema>;

type CreateRoleDialogProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  roleId?: string;
};

export default function CreateRoleDialog({ isOpen, setIsOpen, roleId }: CreateRoleDialogProps) {
  const { t } = useTranslation();
  const isEdit = !!roleId;

  const {
    permissionsRes,
    isLoadingPermissions,
    isPermissionsFetched,
    permissionError,
    refetchPermissions,
    isRefetchingPermissions,
  } = useGetPermissions({ enabled: isOpen && !isEdit });

  const { data, isLoadingRole, isRoleFetched, roleError, refetchRole, isRefetchingRole } =
    useRoleDetails(roleId ?? '');

  const role = data?.result;

  const { addRole, isAddingRole } = UseCreateRole({
    onSuccess: () => setIsOpen(false),
  });

  const { updateRole, isUpdatingRole } = useUpdateRole(roleId ?? '', {
    onSuccess: () => setIsOpen(false),
  });

  const isSaving = isAddingRole || isUpdatingRole;

  const form = useLiveForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      nameEN: '',
      nameIt: '',
      permissions: {},
    },
  });

  const onSubmit = async (data: RoleFormValues) => {
    const permissionsPayload = Object.entries(data.permissions)
      .filter(([, perm]) => perm.canRead || perm.canCreate || perm.canUpdate || perm.canDelete)
      .map(([permissionName, perm]) => ({
        id: permissionName,
        permissionName,
        ...perm,
      }));

    const payload = {
      nameEn: data.nameEN,
      nameAr: data.nameIt,
      description: isEdit ? role?.description ?? '' : '',
      descriptionIt: isEdit ? role?.descriptionIt ?? '' : '',
      permissions: permissionsPayload,
    };

    if (isEdit) {
      await updateRole(payload);
      return;
    }

    await addRole(payload);
  };

  useEffect(() => {
    if (!isOpen) {
      form.reset({
        nameEN: '',
        nameIt: '',
        permissions: {},
      });
      return;
    }

    if (isEdit) {
      if (!isLoadingRole && isRoleFetched) {
        form.reset({
          nameEN: role?.nameEn || '',
          nameIt: role?.nameAr || '',
          permissions: buildDefaultPermissions(role?.permissions ?? []),
        });
      }
      return;
    }

    if (!isLoadingPermissions && isPermissionsFetched) {
      form.reset({
        nameEN: '',
        nameIt: '',
        permissions: buildDefaultPermissions(permissionsRes?.result ?? []),
      });
    }
  }, [
    isOpen,
    isEdit,
    isLoadingPermissions,
    isPermissionsFetched,
    isLoadingRole,
    isRoleFetched,
    permissionsRes?.result,
    role?.nameEn,
    role?.nameAr,
    role?.permissions,
    form,
  ]);

  const apiPermissions = isEdit ? role?.permissions : permissionsRes?.result;

  const permissionsByModule = useMemo(
    () => groupPermissionsByModule(apiPermissions ?? []),
    [apiPermissions],
  );

  const handleOpenChange = (open: boolean) => {
    if (isSaving) return;
    setIsOpen(open);
  };

  const fieldProps = {
    control: form.control,
    required: true as const,
    inputClassName: createRoleDialogInputClassName,
    labelClassName: 'type-body-sm text-neutral-900',
  };

  const isLoading = isEdit ? isLoadingRole : isLoadingPermissions;
  const loadError = isEdit ? roleError : permissionError;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={CREATE_ROLE_DIALOG_CLASS}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <div className='flex max-h-[90vh] flex-col'>
          <DialogHeader className='flex shrink-0 flex-row items-center justify-between gap-4 border-b border-neutral-50 p-4 sm:p-6 sm:pb-4'>
            <DialogTitle className='type-heading-xs text-neutral-900 sm:type-heading-sm'>
              {isEdit ? t('roles.editRole') : t('roles.addRole')}
            </DialogTitle>
            {!isSaving && (
              <DialogClose className='shrink-0 rounded-md p-0.5 text-neutral-900 hover:bg-neutral-50'>
                <X className='size-6 sm:size-8' aria-hidden='true' />
                <span className='sr-only'>{t('roles.form.cancel')}</span>
              </DialogClose>
            )}
          </DialogHeader>

          {loadError ? (
            <div className='p-6'>
              <LoadingError
                errorMsg={loadError.message}
                onRefetch={isEdit ? refetchRole : refetchPermissions}
                isRefetching={isEdit ? isRefetchingRole : isRefetchingPermissions}
              />
            </div>
          ) : isLoading ? (
            <div className='p-6'>
              <MainLoader />
            </div>
          ) : (
            <Form {...form}>
              <form
                id='create-role-form'
                onSubmit={form.handleSubmit(onSubmit)}
                className='relative flex min-h-0 flex-1 flex-col'
              >
                <div className='min-h-0 flex-1 overflow-y-auto p-4 sm:p-6'>
                  <div className='flex flex-col gap-6'>
                    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-4'>
                      <CustomInput
                        {...fieldProps}
                        name='nameEN'
                        label={t('roles.form.roleNameEn')}
                        placeholder={t('roles.form.placeholderNameEn')}
                      />
                      <CustomInput
                        {...fieldProps}
                        name='nameIt'
                        label={t('roles.form.roleNameIt')}
                        placeholder={t('roles.form.placeholderNameIt')}
                      />
                    </div>

                    <div className='flex flex-col gap-4'>
                      <h2 className='type-body-md-semibold text-neutral-900'>
                        {t('roles.form.modulesPermissions')}
                      </h2>

                      <Accordion type='single' collapsible className='flex flex-col gap-3'>
                        {Object.entries(permissionsByModule).map(([moduleName, permissions]) => (
                          <PermissionModuleCard
                            key={moduleName}
                            permissions={permissions}
                            moduleName={moduleName}
                          />
                        ))}
                      </Accordion>
                    </div>
                  </div>
                </div>

                {isSaving && <LoadingOverlay />}

                <DialogFooter className='shrink-0 border-t border-neutral-50 p-4 sm:p-6 sm:pt-4'>
                  <div className='grid w-full grid-cols-2 gap-4'>
                    <Button
                      type='button'
                      variant='outline'
                      disabled={isSaving}
                      className='h-12 border-primary-500 text-primary-500 hover:bg-primary-50 hover:text-primary-600'
                      onClick={() => handleOpenChange(false)}
                    >
                      {t('roles.form.cancel')}
                    </Button>
                    <Button
                      type='submit'
                      disabled={!form.formState.isValid || isSaving}
                      className='h-12 bg-primary-500 text-neutral-900 hover:bg-primary-600'
                    >
                      {isSaving ? (
                        <Spinner />
                      ) : isEdit ? (
                        t('roles.form.update')
                      ) : (
                        t('roles.form.save')
                      )}
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
