import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex h-8 max-w-fit items-center justify-center rounded-[4px] px-2 type-body-md whitespace-nowrap',
        className,
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
