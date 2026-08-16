import { Switch } from '@/components/ui/switch';
import { useChangeAdminStatus } from '../hooks/useChangeAdminStatus';
import { type Admin } from '../types/admin.types';
import { cn } from '@/lib/utils';
import { useDirection } from '@/i18n/useDirection';

const ActiveSwitch = ({ admin }: { admin: Admin }) => {
  const { editAdminStatus, isLoading } = useChangeAdminStatus();

  const direction = useDirection();

  async function onCheckedChange(checked: boolean) {
    // Prevent multiple clicks while loading
    if (isLoading) return;

    await editAdminStatus({
      id: admin?.id ?? '',
      isActive: checked,
    });
  }

  const isChecked = admin.isActive;

  return (
    <Switch
      dir={direction}
      checked={isChecked}
      disabled={isLoading}
      onCheckedChange={onCheckedChange}
      className={cn(
        isChecked ? 'data-[state=checked]:bg-primary-500' : 'data-[state=unchecked]:bg-secondary-200',
      )}
    />
  );
};

export default ActiveSwitch;