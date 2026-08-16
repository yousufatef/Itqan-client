import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export default function LoadingOverlay({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        'absolute inset-0 z-999 flex size-full! flex-col items-center justify-center gap-4 backdrop-blur-xs',
        className,
      )}
    >
      {children}
      <Spinner className='size-10' />
    </div>
  );
}
