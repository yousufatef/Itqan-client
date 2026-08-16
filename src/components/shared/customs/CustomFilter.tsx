import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useDirection } from '@/i18n/useDirection';
export type SelectItemType = {
  labelEn?: string;
  labelAr?: string;
  label?: string;
  value: string;
  desc?: string;
  icon?: string;
  className?: string;
};
type CustomSelectorFilterProps = {
  label?: string;
  items: SelectItemType[];
  placeholder: string;
  fildName: string;
  disabled?: boolean;
  className?: string;
  wrapperClassName?: string;
  isSearch?: boolean;
  icon?: React.ReactNode;
  variant?: 'primary' | 'gray';
};

const variantStyles = {
  primary: {
    trigger:
      'text-primary border-primary-100 hover:bg-primary-500 hover:text-white! focus:ring-primary-500',
    icon: 'text-primary group-hover:text-white',
  },
  gray: {
    trigger: 'text-neutral-500 border-gray-200 hover:bg-gray-50',
    icon: 'text-neutral-500',
  },
};

const CustomSelectorFilter = ({
  label,
  placeholder,
  className,
  wrapperClassName,
  items,
  disabled,
  fildName,
  isSearch = false,
  icon,
  variant = 'primary',
}: CustomSelectorFilterProps) => {
  const [search, setSearch] = useState('');
  const { i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith('en');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // current selected value from URL
  const selectedValue = searchParams.get(fildName) ?? '';

  // filter items by EN or AR based on search
  const filteredItems = useMemo(() => {
    return items?.filter((i) =>
      (isEnglish ? i.labelEn : i.labelAr)?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, items, isEnglish]);

  const handleChange = (value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(fildName, value);
    } else {
      params.delete(fildName);
    }
    params.set('pageNumber', '1');
    navigate(`?${params.toString()}`, { replace: true });
  };
  const direction = useDirection();
  return (
    <div
      dir={direction}
      className={cn('flex flex-col gap-2', className)}
    >
      {label && <label className='text-sm font-semibold text-neutral-900'>{label}</label>}

      <Select
        dir={direction}
        onValueChange={handleChange}
        value={selectedValue}
        disabled={disabled}
      >
        <SelectTrigger
          dir={direction}
          className={cn(
            'group flex h-13.25 items-center rounded-lg border bg-white px-4 py-4 font-normal transition-colors focus:ring-0 focus:ring-offset-0',
            variantStyles[variant].trigger,
            wrapperClassName,
          )}
        >
          {icon && (
            <span
              className={cn('flex items-center p-1 transition-colors', variantStyles[variant].icon)}
            >
              {icon}
            </span>
          )}
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent
          dir={direction}
          position='popper'
          align='start'
        >
          {/* search input */}
          {isSearch && (
            <div className='p-2'>
              <Input
                dir={direction}
                placeholder='Search...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='h-8'
              />
            </div>
          )}

          {filteredItems?.length > 0 ? (
            filteredItems.map(({ labelEn, labelAr, value }) => (
              <SelectItem
                key={value}
                value={value}
                className='type-body-md cursor-pointer data-highlighted:bg-neutral-50'
              >
                {isEnglish ? labelEn : labelAr}
              </SelectItem>
            ))
          ) : (
            <div className='px-2 py-1 text-sm text-neutral-500'>No results found</div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CustomSelectorFilter;
// Example usage of CustomSelectorFilter in a table header
{
  /* <CustomSelectorFilter
    fildName="sort"
    placeholder={t('common.filters.sortBy')}
    label=""
    items={[
        { value: 'asc', label: 'Ascending', labelEn: 'Name (A-Z)', labelAr: 'الاسم (أ-ي)' },
        { value: 'desc', label: 'Descending', labelEn: 'Name (Z-A)', labelAr: 'الاسم (ي-أ)' },
    ]}
    className="rounded-full"
    icon={<ArrowUpDown />}
/> */
}
