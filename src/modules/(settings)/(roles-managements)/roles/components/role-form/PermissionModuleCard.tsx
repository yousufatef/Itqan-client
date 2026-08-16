import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import {
  Building2,
  CalendarDays,
  ConciergeBell,
  LayoutGrid,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  PermissionApiRes,
  PermissionFormValue,
} from '@/modules/(settings)/(roles-managements)/roles/types/permissions-types';

type PermissionModuleCardProps = {
  permissions: PermissionApiRes[];
  moduleName: string;
};

const PERMISSION_ACTIONS = ['canRead', 'canCreate', 'canUpdate', 'canDelete'] as const;

const ACTION_LABELS = (t: TFunction): Record<(typeof PERMISSION_ACTIONS)[number], string> => ({
  canRead: t('roles.permissionModule.view'),
  canCreate: t('roles.permissionModule.create'),
  canUpdate: t('roles.permissionModule.edit'),
  canDelete: t('roles.permissionModule.delete'),
});

const MODULE_ICONS: Record<string, LucideIcon> = {
  Reservation: CalendarDays,
  Reservations: CalendarDays,
  Service: ConciergeBell,
  Services: ConciergeBell,
  Properties: Building2,
  Property: Building2,
};

function getModuleIcon(moduleName: string): LucideIcon {
  return MODULE_ICONS[moduleName] ?? LayoutGrid;
}

export default function PermissionModuleCard({
  permissions,
  moduleName,
}: PermissionModuleCardProps) {
  const form = useFormContext();
  const { t } = useTranslation();
  const actionLabels = ACTION_LABELS(t);
  const ModuleIcon = getModuleIcon(moduleName);

  const permissionIds = permissions.map((p) => p.id);
  const watchedPermissions = useWatch({
    control: form.control,
    name: permissionIds.map((id) => `permissions.${id}`),
  }) as PermissionFormValue[];

  const isModuleActionChecked = (action: (typeof PERMISSION_ACTIONS)[number]) =>
    permissionIds.length > 0 &&
    permissionIds.every((_, index) => watchedPermissions[index]?.[action]);

  const isModuleActionPartial = (action: (typeof PERMISSION_ACTIONS)[number]) =>
    permissionIds.some((_, index) => watchedPermissions[index]?.[action]) &&
    !isModuleActionChecked(action);

  const allChecked =
    permissionIds.length > 0 &&
    permissionIds.every((_, index) =>
      PERMISSION_ACTIONS.every((action) => watchedPermissions[index]?.[action]),
    );

  const setModuleAction = (
    action: (typeof PERMISSION_ACTIONS)[number],
    checked: boolean,
  ) => {
    permissionIds.forEach((id) => {
      form.setValue(`permissions.${id}.${action}`, checked, { shouldDirty: true });

      if (action === 'canRead' && !checked) {
        form.setValue(`permissions.${id}.canCreate`, false, { shouldDirty: true });
        form.setValue(`permissions.${id}.canUpdate`, false, { shouldDirty: true });
        form.setValue(`permissions.${id}.canDelete`, false, { shouldDirty: true });
      }

      if (action !== 'canRead' && checked) {
        form.setValue(`permissions.${id}.canRead`, true, { shouldDirty: true });
      }
    });
  };

  const handleFullAccess = (checked: boolean) => {
    permissionIds.forEach((id) => {
      PERMISSION_ACTIONS.forEach((action) => {
        form.setValue(`permissions.${id}.${action}`, checked, { shouldDirty: true });
      });
    });
  };

  const activeTags = PERMISSION_ACTIONS.filter((action) =>
    permissionIds.some((_, index) => watchedPermissions[index]?.[action]),
  );

  return (
    <AccordionItem value={moduleName} className='border-none'>
      <div className='rounded-[4px] border border-neutral-100 bg-background'>
        <AccordionTrigger
          iconPosition='end'
          className='px-4 py-4 hover:no-underline'
        >
          <div className='flex min-w-0 flex-1 items-center gap-3'>
            <span className='flex size-8 shrink-0 items-center justify-center rounded-[4px] bg-neutral-50 text-primary-500'>
              <ModuleIcon className='size-4' aria-hidden='true' />
            </span>
            <span className='type-body-md-semibold text-neutral-900'>{moduleName}</span>
            {activeTags.length > 0 ? (
              <div className='group-aria-expanded/accordion-trigger:hidden flex flex-wrap items-center gap-1.5 ps-1'>
                {activeTags.map((action) => (
                  <span
                    key={action}
                    className='rounded-full bg-neutral-50 px-2 py-0.5 type-body-xs text-neutral-500'
                  >
                    {actionLabels[action]}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </AccordionTrigger>

        <AccordionContent className='px-4 pb-4'>
          <div className='flex flex-col gap-4 border-t border-neutral-50 pt-4'>
            <label className='flex cursor-pointer items-center gap-2'>
              <Checkbox
                id={`full-access-${moduleName}`}
                checked={allChecked}
                onCheckedChange={(checked) => handleFullAccess(checked === true)}
              />
              <span className='type-body-sm text-neutral-900'>
                {t('roles.permissionModule.fullAccess')}
              </span>
            </label>

            {PERMISSION_ACTIONS.map((action) => (
              <label
                key={action}
                className={cn(
                  'flex cursor-pointer items-center gap-2',
                  isModuleActionPartial(action) && 'opacity-80',
                )}
              >
                <Checkbox
                  id={`${moduleName}-${action}`}
                  checked={isModuleActionChecked(action)}
                  onCheckedChange={(checked) => setModuleAction(action, checked === true)}
                />
                <span className='type-body-sm text-neutral-900'>{actionLabels[action]}</span>
              </label>
            ))}
          </div>
        </AccordionContent>
      </div>
    </AccordionItem>
  );
}
