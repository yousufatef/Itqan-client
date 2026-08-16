import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { useMutation } from '@tanstack/react-query';
import { changeRecordStatus } from '@/services/shared.service';
import { RecordType } from '@/types/index.t';
import { toast } from '@/lib/toast';

type ToggleStatusProps = {
  id: string;
  checked: boolean;
  recordType: RecordType;
};
export default function ToggleStatus({ id, checked, recordType }: ToggleStatusProps) {
  const [status, setStatus] = useState(checked);

  const { mutate, isPending } = useMutation({
    mutationFn: () => changeRecordStatus(id, recordType),
    onMutate: () => {
      setStatus((prev) => !prev);
    },
    onError: () => {
      setStatus((prev) => !prev);
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });

  return (
    <div className='text-primary flex items-center gap-2'>
      <Switch
        size='default'
        checked={status}
        onCheckedChange={() => mutate()}
        disabled={isPending}
      />
      <span className='text-xs'>{status ? 'Active' : 'Inactive'}</span>
    </div>
  );
}
