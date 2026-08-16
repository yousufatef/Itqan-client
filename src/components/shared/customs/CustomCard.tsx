import { cn } from '@/lib/utils';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};
export default function CustomCard({ children, className }: CardProps) {
  return (
    <div className={cn('rounded-md border border-neutral-50 bg-white p-4', className)}>
      {children}
    </div>
  );
}
