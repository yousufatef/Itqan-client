import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role='navigation'
      aria-label='pagination'
      data-slot='pagination'
      className={cn('flex w-full justify-center', className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot='pagination-content'
      className={cn(
        'flex flex-wrap items-center gap-1',
        className,
      )}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot='pagination-item'
      {...props}
    />
  );
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
  React.ComponentProps<'a'>;

function PaginationLink({ className, isActive, size = 'icon', ...props }: PaginationLinkProps) {
  return (
    <Button
      asChild
      variant='ghost'
      size={size}
      className={cn(
        'type-body-sm h-9 min-w-9 rounded-[4px] border border-transparent px-3 text-neutral-500 hover:border-neutral-50 hover:bg-white hover:text-neutral-900 hover:shadow-[0px_4px_20px_0px_#0D3B2E12]',
        'data-[active=true]:border-primary-500 data-[active=true]:bg-primary-50 data-[active=true]:font-semibold data-[active=true]:text-primary-500 data-[active=true]:hover:bg-primary-50 data-[active=true]:hover:text-primary-500',
        className,
      )}
    >
      <a
        aria-current={isActive ? 'page' : undefined}
        data-slot='pagination-link'
        data-active={isActive}
        {...props}
      />
    </Button>
  );
}

function PaginationPrevious({
  className,
  text = 'Previous',
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label='Go to previous page'
      size='default'
      className={cn('gap-1.5 px-3', className)}
      {...props}
    >
      <ChevronLeftIcon data-icon='inline-start' />
      <span className='hidden sm:block'>{text}</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  text = 'Next',
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label='Go to next page'
      size='default'
      className={cn('gap-1.5 px-3', className)}
      {...props}
    >
      <span className='hidden sm:block'>{text}</span>
      <ChevronRightIcon data-icon='inline-end' />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot='pagination-ellipsis'
      className={cn(
        "flex h-9 min-w-9 items-center justify-center rounded-[4px] text-neutral-300 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className='sr-only'>More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
