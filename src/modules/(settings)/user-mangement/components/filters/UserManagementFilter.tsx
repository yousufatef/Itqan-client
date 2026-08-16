import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import { cn } from '@/lib/utils';
import { ChevronDown, Filter, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  USER_ACCOUNT_STATUS_FILTER_VALUE,
  USER_ACCOUNT_STATUS_FILTER_OPTIONS,
  USER_JOINING_DATE_FILTER_VALUE,
  USER_JOINING_DATE_FILTER_OPTIONS,
  USER_KYC_STATUS_FILTER_OPTIONS,
} from '../../constants/user.constants';
import { KycStatus } from '../../types/user.types';
import { getCurrLocale } from '@/utils/language';

type UserManagementFilterProps = {
  className?: string;
  triggerVariant?: 'default' | 'compact';
};

const triggerStyles: Record<NonNullable<UserManagementFilterProps['triggerVariant']>, string> = {
  default:
    'min-h-12 rounded-[4px] border-neutral-50 bg-white px-4 py-2 text-base leading-[21px] font-normal text-neutral-900 shadow-[0px_4px_20px_0px_#0018A312] hover:bg-neutral-50',
  compact:
    'min-h-12 rounded-[4px] border-neutral-50 bg-white px-4 py-2 text-base leading-[21px] font-normal text-neutral-900 shadow-[0px_4px_20px_0px_#0018A312] hover:bg-neutral-50',
};

const accountStatusOptions = USER_ACCOUNT_STATUS_FILTER_OPTIONS.map((option) => ({
  ...option,
  value: String(option.value),
  labelKey:
    option.value === USER_ACCOUNT_STATUS_FILTER_VALUE.ACTIVE
      ? 'users.filters.accountStatuses.active'
      : option.value === USER_ACCOUNT_STATUS_FILTER_VALUE.INACTIVE
        ? 'users.filters.accountStatuses.inactive'
        : 'users.filters.accountStatuses.suspended',
}));

const kycStatusOptions = USER_KYC_STATUS_FILTER_OPTIONS.map((option) => ({
  ...option,
  value: String(option.value),
  labelKey:
    option.value === KycStatus.APPROVED
      ? 'users.filters.kycStatuses.approved'
      : option.value === KycStatus.PENDING
        ? 'users.filters.kycStatuses.pending'
        : option.value === KycStatus.REJECTED
          ? 'users.filters.kycStatuses.rejected'
          : 'users.filters.kycStatuses.none',
}));

const joiningDateOptions = USER_JOINING_DATE_FILTER_OPTIONS.map((option) => ({
  ...option,
  value: String(option.value),
  labelKey:
    option.value === USER_JOINING_DATE_FILTER_VALUE.LAST_7_DAYS
      ? 'users.filters.joiningDateOptions.last7Days'
      : option.value === USER_JOINING_DATE_FILTER_VALUE.LAST_30_DAYS
        ? 'users.filters.joiningDateOptions.last30Days'
        : 'users.filters.joiningDateOptions.last90Days',
}));

const UserManagementFilter = ({
  className,
  triggerVariant = 'default',
}: UserManagementFilterProps) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const isEnglish = getCurrLocale() === 'en';
  const appliedAccountStatuses = searchParams.getAll('AccountStatuses');
  const appliedKycStatuses = searchParams.getAll('KycStatuses');
  const appliedJoiningDate = searchParams.get('JoiningDaysAgo') ?? '';

  const [draftAccountStatuses, setDraftAccountStatuses] =
    useState<string[]>(appliedAccountStatuses);
  const [draftKycStatuses, setDraftKycStatuses] = useState<string[]>(appliedKycStatuses);
  const [draftJoiningDate, setDraftJoiningDate] = useState(appliedJoiningDate);

  const selectedFiltersCount = useMemo(
    () => appliedAccountStatuses.length + appliedKycStatuses.length + (appliedJoiningDate ? 1 : 0),
    [appliedAccountStatuses.length, appliedKycStatuses.length, appliedJoiningDate],
  );
  const hasFilters = selectedFiltersCount > 0;

  const chipLabel = useMemo(() => {
    if (!hasFilters) return t('users.filters.title');

    if (selectedFiltersCount === 1) {
      const statusLabel =
        accountStatusOptions.find((option) => option.value === appliedAccountStatuses[0])
          ?.labelKey ??
        kycStatusOptions.find((option) => option.value === appliedKycStatuses[0])?.labelKey ??
        joiningDateOptions.find((option) => option.value === appliedJoiningDate)?.labelKey;
      return statusLabel ? t(statusLabel) : t('users.filters.oneFilter');
    }

    return t('users.filters.manyFilters', { count: selectedFiltersCount });
  }, [
    appliedAccountStatuses,
    appliedJoiningDate,
    appliedKycStatuses,
    hasFilters,
    selectedFiltersCount,
    t,
  ]);

  const toggleValue = (values: string[], value: string) =>
    values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

  const handleToggleAccountStatus = (value: string) => {
    setDraftAccountStatuses((prev) => toggleValue(prev, value));
  };

  const handleToggleKycStatus = (value: string) => {
    setDraftKycStatuses((prev) => toggleValue(prev, value));
  };

  const syncDraftFromApplied = () => {
    setDraftAccountStatuses(appliedAccountStatuses);
    setDraftKycStatuses(appliedKycStatuses);
    setDraftJoiningDate(appliedJoiningDate);
  };

  const applyFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('AccountStatuses');
    next.delete('KycStatuses');
    next.delete('JoiningDaysAgo');

    draftAccountStatuses.forEach((value) => next.append('AccountStatuses', value));
    draftKycStatuses.forEach((value) => next.append('KycStatuses', value));
    if (draftJoiningDate) next.set('JoiningDaysAgo', draftJoiningDate);

    next.set('pageNumber', '1');
    setSearchParams(next);
    setOpen(false);
  };

  const resetDraft = () => {
    setDraftAccountStatuses([]);
    setDraftKycStatuses([]);
    setDraftJoiningDate('');
  };

  const clearAppliedFilters = (e?: MouseEvent) => {
    e?.stopPropagation();
    const next = new URLSearchParams(searchParams);
    next.delete('AccountStatuses');
    next.delete('KycStatuses');
    next.delete('JoiningDaysAgo');
    next.set('pageNumber', '1');
    setSearchParams(next);
    setDraftAccountStatuses([]);
    setDraftKycStatuses([]);
    setDraftJoiningDate('');
  };

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        if (isOpen) syncDraftFromApplied();
        setOpen(isOpen);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type='button'
          variant='outline'
          className={cn('items-center justify-center', triggerStyles[triggerVariant], className)}
        >
          <span className='relative inline-flex'>
            <Filter className='h-4 w-4' aria-hidden='true' />
            {hasFilters ? (
              <span className='bg-error-500 border-error-50 absolute top-0 -left-0.5 size-1.5 rounded-full border' />
            ) : null}
          </span>

          <span className='type-body-md text-neutral-900'>{chipLabel}</span>

          {hasFilters ? (
            <span
              role='button'
              aria-label={t('users.filters.clear')}
              className='inline-flex items-center'
              onClick={clearAppliedFilters}
            >
              <X className='size-5 text-neutral-900' />
            </span>
          ) : (
            <ChevronDown className='size-5 text-neutral-900' />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        sideOffset={8}
        collisionPadding={16}
        className='flex max-h-[min(400px,calc(100vh-2rem))] w-[min(321px,calc(100vw-2rem))] flex-col gap-0 overflow-hidden rounded-[4px] border border-neutral-50 bg-white p-0 shadow-[0px_4px_20px_0px_#0018A312]'
      >
        <div className='shrink-0 border-b border-[#EAEBEB99] px-4 py-3 opacity-90'>
          <h3 className='text-base leading-6 font-bold text-neutral-900'>
            {t('users.filters.title')}
          </h3>
        </div>

        <div className='min-h-0 flex-1 space-y-0 overflow-y-auto px-4 py-2'>
          <div className='pt-0.5'>
            <p className='mb-1 text-sm leading-[21px] font-normal text-neutral-400'>
              {t('users.filters.accountStatus')}
            </p>
            <div className='flex flex-col'>
              {accountStatusOptions.map((option) => (
                <label
                  key={option.value}
                  className='flex cursor-pointer items-center gap-2 py-2'
                >
                  <Checkbox
                    checked={draftAccountStatuses.includes(option.value)}
                    onCheckedChange={() => handleToggleAccountStatus(option.value)}
                    className='data-checked:bg-primary-500 size-4 rounded-[4px] border-neutral-100 bg-white data-checked:text-white'
                  />
                  <span className='text-sm leading-[21px] font-normal text-neutral-900'>
                    {t(option.labelKey)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className='h-px w-full bg-[#EAEBEB99]' />

          <div className='pt-0.5'>
            <p className='mb-1 text-sm leading-[21px] font-normal text-neutral-400'>
              {t('users.filters.kycStatus')}
            </p>
            <div className='flex flex-col'>
              {kycStatusOptions.map((option) => (
                <label
                  key={option.value}
                  className='flex cursor-pointer items-center gap-2 py-2'
                >
                  <Checkbox
                    checked={draftKycStatuses.includes(option.value)}
                    onCheckedChange={() => handleToggleKycStatus(option.value)}
                    className='data-checked:bg-primary-500 size-4 rounded-[4px] border-neutral-100 bg-white data-checked:text-white'
                  />
                  <span className='text-sm leading-[21px] font-normal text-neutral-900'>
                    {t(option.labelKey)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className='h-px w-full bg-[#EAEBEB99]' />

          <div className='pt-0.5'>
            <p className='mb-1 text-sm leading-[21px] font-normal text-neutral-400'>
              {t('users.filters.joiningDate')}
            </p>
            <RadioGroup
              dir={isEnglish ? 'ltr' : 'rtl'}
              value={draftJoiningDate}
              onValueChange={setDraftJoiningDate}
              className='gap-0'
            >
              {joiningDateOptions.map((option) => (
                <label
                  key={option.value}
                  className='flex cursor-pointer items-center gap-2 py-2'
                >
                  <RadioGroupItem
                    value={option.value}
                    className='data-checked:border-primary-500 data-checked:bg-primary-500 size-4 border-neutral-100 bg-white data-checked:text-white [&_[data-slot=radio-group-indicator]>span]:bg-white'
                    onClick={(e) => {
                      if (draftJoiningDate === option.value) {
                        e.preventDefault();
                        setDraftJoiningDate('');
                      }
                    }}
                  />
                  <span className='text-sm leading-[21px] font-normal text-neutral-900'>
                    {t(option.labelKey)}
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>
        </div>

        <div className='mt-0.5 flex shrink-0 items-center justify-end gap-4 px-4 pb-3'>
          {draftAccountStatuses.length > 0 || draftKycStatuses.length > 0 || draftJoiningDate ? (
            <Button
              type='button'
              variant='ghost'
              className='text-primary-500 hover:text-primary-600 h-10 px-0 text-base leading-[21px] font-normal underline hover:bg-transparent'
              onClick={resetDraft}
            >
              {t('users.filters.reset')}
            </Button>
          ) : null}
          <Button
            type='button'
            className='bg-primary-500 text-primary-50 hover:bg-primary-600 h-10 rounded-[4px] px-4 text-base leading-[21px] font-normal shadow-[0px_4px_10px_0px_#0D3B2E12]'
            onClick={applyFilters}
          >
            {t('users.filters.apply')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserManagementFilter;
