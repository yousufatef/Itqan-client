import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { InputTrimmer } from '@/utils/input';
import { Search, XIcon } from 'lucide-react';
import * as React from 'react';
import { useSearchParams } from 'react-router-dom';

export type CustomSearchFilter = Record<string, string | undefined>;

type CustomSearchBarProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onFilterChange?: (filter: CustomSearchFilter) => void;
  searchParamName?: string;
  debounceMs?: number;
  placeholder?: string;
  ariaLabel?: string;
  disabled?: boolean;
  wrapperClassName?: string;
  inputClassName?: string;
  showClearButton?: boolean;
};

function CustomSearchBar({
  value,
  defaultValue = '',
  onValueChange,
  onFilterChange,
  searchParamName = 'search',
  debounceMs = 400,
  placeholder = 'Search...',
  ariaLabel = 'Search',
  disabled,
  wrapperClassName,
  inputClassName,
  showClearButton = true,
}: CustomSearchBarProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const searchValue = (value ?? internalValue) || searchParams.get(searchParamName) || '';

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const trimmedValue = searchValue.trim();

      if (onFilterChange) {
        onFilterChange({
          [searchParamName]: trimmedValue || undefined,
        });
      }

      if (searchParamName && searchParams.get(searchParamName) !== trimmedValue) {
        const newSearchParams = new URLSearchParams(searchParams);

        if (trimmedValue) {
          newSearchParams.set(searchParamName, trimmedValue);
        } else {
          newSearchParams.delete(searchParamName);
        }

        newSearchParams.set('pageNumber', '1');
        setSearchParams(newSearchParams);
      }
    }, debounceMs);

    return () => window.clearTimeout(timeoutId);
  }, [debounceMs, onFilterChange, searchParamName, searchParams, searchValue, setSearchParams]);

  const updateValue = (nextValue: string) => {
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);

    if (!nextValue && searchParamName) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete(searchParamName);
      newSearchParams.set('pageNumber', '1');
      setSearchParams(newSearchParams);
    }
  };
  return (
    <div className={cn('relative w-full', wrapperClassName)}>
      <Search
        className={`text-muted-foreground pointer-events-none absolute inset-s-3 top-1/2 size-4 -translate-y-1/2`}
      />
      <Input
        aria-label={ariaLabel}
        className={cn(
          'min-h-12 rounded border-neutral-100! bg-transparent px-9 ltr:pl-9! rtl:pr-9!',
          inputClassName,
        )}
        disabled={disabled}
        onChange={(event) => {
          if (typeof event.currentTarget.value === 'string') {
            event.currentTarget.value = InputTrimmer(event.currentTarget.value) as string;
          }
          updateValue(event.target.value);
        }}
        placeholder={placeholder}
        value={searchValue}
      />
      {showClearButton && searchValue ? (
        <Button
          aria-label='Clear search'
          className='absolute inset-e-1 top-1/2 size-7 -translate-y-1/2'
          disabled={disabled}
          onClick={() => updateValue('')}
          size='icon-sm'
          type='button'
          variant='ghost'
        >
          <XIcon />
        </Button>
      ) : null}
    </div>
  );
}

export default CustomSearchBar;
