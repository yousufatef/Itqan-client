import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { useDirection } from '@/i18n/useDirection';
import { cn } from '@/lib/utils';
import type { AppPermissions } from '@/modules/(settings)/(roles-managements)/roles/types/permissions-types';
import { MoreVertical } from 'lucide-react';
import { WithPermissions } from '../permissions/WithPermissions';

type Action = {
  onClick: () => void;
  text: string;
  icon: React.ReactNode;
  permissions?: AppPermissions[];
  variant?: 'default' | 'destructive';
  disabled?: boolean;
};

type MoreActionsProps = {
  actions: Action[];
  className?: string;
  triggerClassName?: string;
};

export default function MoreActions({ actions, className, triggerClassName }: MoreActionsProps) {
  const direction = useDirection();

  return (
    <DropdownMenu dir={direction}>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label='Open row actions'
          size='icon-sm'
          variant='ghost'
          className={cn('size-9', triggerClassName)}
        >
          <MoreVertical className='size-6' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className={cn('flex w-fit min-w-auto flex-col gap-2 bg-white px-2 py-4', className)}
      >
        {actions.map(({ onClick, text, variant, icon, permissions, disabled }, index) => (
          <WithPermissions
            key={`${index}-${text}`}
            permissions={permissions ?? []}
          >
            <DropdownMenuItem
              variant={variant}
              onClick={onClick}
              className='flex w-full min-w-32.75 items-center justify-start gap-2 p-2'
              dir={direction}
              disabled={disabled}
            >
              {icon}
              <span className='text-sm font-medium'>{text}</span>
            </DropdownMenuItem>
          </WithPermissions>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
