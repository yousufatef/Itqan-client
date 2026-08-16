import { useEffect, useRef } from 'react';
import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import useTableSearchParam from '@/hooks/useTableSearchParam';

type PaginationProps = {
  fieldName?: string;
  totalCount?: number;
  currentCount?: number;
  pageSize?: number;
};

type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

const getPageItems = (pageNumber: number, totalPages: number): PageItem[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (pageNumber <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis-end', totalPages];
  }

  if (pageNumber >= totalPages - 3) {
    return [
      1,
      'ellipsis-start',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    'ellipsis-start',
    pageNumber - 1,
    pageNumber,
    pageNumber + 1,
    'ellipsis-end',
    totalPages,
  ];
};

const Pagination = ({
  fieldName = 'pageNumber',
  totalCount,
  currentCount,
  pageSize: pageSizeProp,
}: PaginationProps) => {
  const { i18n, t } = useTranslation();
  const { searchParams, setTableSearchParam } = useTableSearchParam({
    shouldResetPage: false,
  });

  const pageNumber = Math.max(1, Number(searchParams.get(fieldName)) || 1);
  const pageSize = pageSizeProp ?? Math.max(1, Number(searchParams.get('pageSize')) || 10);
  const isEnglish = i18n.language.startsWith('en');

  const totalPages = Math.max(1, Math.ceil((totalCount || 0) / pageSize));

  const isNavigatingRef = useRef(false);
  const lastProcessedCountRef = useRef(currentCount);

  // ================= HANDLE DELETE LAST ITEM =================
  useEffect(() => {
    if (
      currentCount === 0 &&
      pageNumber > 1 &&
      lastProcessedCountRef.current !== 0 &&
      !isNavigatingRef.current
    ) {
      isNavigatingRef.current = true;

      const newPageNumber = pageNumber - 1;

      setTableSearchParam(fieldName, newPageNumber);

      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 200);
    }

    lastProcessedCountRef.current = currentCount;
  }, [currentCount, fieldName, pageNumber, setTableSearchParam]);

  // ================= HANDLE PAGE > TOTAL PAGES =================
  useEffect(() => {
    if (isNavigatingRef.current || totalPages === 0) return;

    if (pageNumber > totalPages) {
      isNavigatingRef.current = true;

      setTableSearchParam(fieldName, totalPages);

      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 200);
    }
  }, [fieldName, pageNumber, setTableSearchParam, totalPages]);

  if (totalPages <= 1) {
    return null;
  }

  const pageItems = getPageItems(pageNumber, totalPages);

  const handlePageChange = (page: number) => {
    if (isNavigatingRef.current || page === pageNumber || page < 1 || page > totalPages) {
      return;
    }

    isNavigatingRef.current = true;

    setTableSearchParam(fieldName, page);

    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 200);
  };

  return (
    <ShadcnPagination className='justify-end'>
      <PaginationContent>
        {/* PREVIOUS */}
        <PaginationItem>
          <PaginationLink
            aria-label='Go to previous page'
            size='default'
            className={cn(
              'gap-1.5 px-2.5 text-neutral-400 hover:text-neutral-900',
              pageNumber === 1
                ? 'pointer-events-none text-neutral-300 opacity-60'
                : 'cursor-pointer',
            )}
            onClick={(e) => {
              e.preventDefault();
              if (pageNumber > 1) {
                handlePageChange(pageNumber - 1);
              }
            }}
          >
            <ChevronRight className={`h-4 w-4 ${isEnglish ? 'rotate-180' : ''}`} />
            <span>{t('common.previous')}</span>
          </PaginationLink>
        </PaginationItem>

        {pageItems.map((pageItem) => {
          if (typeof pageItem === 'string') {
            return (
              <PaginationItem key={pageItem}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={pageItem}>
              <PaginationLink
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(pageItem);
                }}
                isActive={pageNumber === pageItem}
                className='cursor-pointer'
              >
                {pageItem}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* NEXT */}
        <PaginationItem>
          <PaginationLink
            aria-label='Go to next page'
            size='default'
            className={cn(
              'gap-1.5 px-2.5 text-neutral-400 hover:text-neutral-900',
              pageNumber === totalPages
                ? 'pointer-events-none text-neutral-300 opacity-60'
                : 'cursor-pointer',
            )}
            onClick={(e) => {
              e.preventDefault();

              if (pageNumber < totalPages) {
                handlePageChange(pageNumber + 1);
              }
            }}
          >
            <span>{t('common.next')}</span>
            <ChevronLeft className={`h-4 w-4 ${isEnglish ? 'rotate-180' : ''}`} />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </ShadcnPagination>
  );
};

export default Pagination;
