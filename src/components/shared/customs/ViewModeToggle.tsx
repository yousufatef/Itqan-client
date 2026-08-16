import { Calendar as CalendarIcon, LayoutGrid, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViewMode = 'tab1' | 'tab2';

type ViewModeToggleProps = {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
  tab1Label?: string;
  tab2Label?: string;
  tab1Icon?: LucideIcon;
  tab2Icon?: LucideIcon;
  className?: string;
};

export default function ViewModeToggle({
  value,
  onChange,
  tab1Label,
  tab2Label,
  tab1Icon: Tab1IconProp,
  tab2Icon: Tab2IconProp,
  className,
}: ViewModeToggleProps) {
  const defaultTab1Label = tab1Label || 'Tab 1';
  const defaultTab2Label = tab2Label || 'Tab 2';

  const Tab1IconComponent = Tab1IconProp || CalendarIcon;
  const Tab2IconComponent = Tab2IconProp || LayoutGrid;

  return (
    <div
      className={cn('border-primary-500 flex h-12 items-center rounded-sm border p-1', className)}
    >
      <button
        type='button'
        onClick={() => onChange('tab1')}
        className={cn(
          'inline-flex size-10 items-center justify-center rounded-sm transition-colors',
          value === 'tab1'
            ? 'border-primary-500 bg-primary-100 text-primary-500 border'
            : 'text-neutral-400 hover:text-neutral-700',
        )}
        aria-label={defaultTab1Label}
        aria-pressed={value === 'tab1'}
      >
        <Tab1IconComponent className='size-5' />
      </button>
      <button
        type='button'
        onClick={() => onChange('tab2')}
        className={cn(
          'inline-flex size-10 items-center justify-center rounded-sm transition-colors',
          value === 'tab2'
            ? 'border-primary-500 bg-primary-100 text-primary-500 border'
            : 'text-neutral-400 hover:text-neutral-700',
        )}
        aria-label={defaultTab2Label}
        aria-pressed={value === 'tab2'}
      >
        <Tab2IconComponent className='size-5' />
      </button>
    </div>
  );
}
