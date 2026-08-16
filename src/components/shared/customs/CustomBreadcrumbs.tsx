import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface CustomBreadcrumbsProps {
  items: BreadcrumbItem[];
  ariaLabel?: string;
}

const CustomBreadcrumbs: React.FC<CustomBreadcrumbsProps> = ({ items, ariaLabel }) => {
  return (
    <nav aria-label={ariaLabel || 'Breadcrumb'} className='flex items-center gap-1'>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className='type-body-md text-neutral-400 transition-colors hover:text-neutral-600'
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  isLast ? 'type-body-md text-primary-500' : 'type-body-md text-neutral-400'
                }
              >
                {item.label}
              </span>
            )}
            {!isLast && (
              <ChevronRight
                className='size-5 shrink-0 text-primary-500'
                aria-hidden='true'
              />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default CustomBreadcrumbs;
