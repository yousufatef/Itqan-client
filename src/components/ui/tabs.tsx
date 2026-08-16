import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Tabs as TabsPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';
import { useSearchParams } from 'react-router-dom';

function Tabs({
  className,
  orientation = 'horizontal',
  onValueChange,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  const [_, setSearchParams] = useSearchParams();

  const handleValueChange = (value: string) => {
    setSearchParams((currentSearchParams) => {
      const nextSearchParams = new URLSearchParams(currentSearchParams);
      nextSearchParams.set('tab', value);
      return nextSearchParams;
    });

    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <TabsPrimitive.Root
      data-slot='tabs'
      data-orientation={orientation}
      className={cn('group/tabs flex gap-2 data-horizontal:flex-col', className)}
      onValueChange={handleValueChange}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  'group/tabs-list inline-flex gap-4 w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-9 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        line: 'gap-1 bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function TabsList({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot='tabs-list'
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot='tabs-trigger'
      className={cn(
        // Base Style
        'relative inline-flex items-center justify-center whitespace-nowrap',
        'text-sm leading-5.25 font-normal',
        'text-neutral-400',
        'border-b-2 border-transparent',
        'transition-all duration-200',

        // Active
        'data-active:text-primary-500',
        'data-active:border-b-primary-500',
        'data-active:bg-transparent',

        // Focus
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring/50',

        // Disabled
        'disabled:pointer-events-none',
        'disabled:opacity-50',

        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot='tabs-content'
      className={cn('flex-1 text-sm outline-none', className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
