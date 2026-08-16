import CustomInput, { CustomSelect } from '@/components/forms';
import CustomNumberInput from '@/components/forms/CustomNumberInput';
import EditModal from '@/components/shared/customs/EditModal';
import useLiveForm from '@/hooks/useLiveForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from '@/components/ui/form';
import type { PromoCode } from '../types/promo.types';
import { getPromoCodeSchema, type PromoCodeFormValues } from '../types/promo.schema';
import useCreateTax from '../hooks/useCreatePromo';
import useUpdateTax from '../hooks/useUpdatePromo';
import { format, parse } from 'date-fns';

type PromoCodeFormProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  promoCode?: PromoCode;
};

const toInputDate = (dateStr?: string) => {
  if (!dateStr) return '';
  try {
    if (dateStr.includes('-') && dateStr.split('-')[0].length === 4) {
      return dateStr;
    }
    return format(parse(dateStr, 'dd-MM-yyyy', new Date()), 'yyyy-MM-dd');
  } catch {
    return dateStr;
  }
};

const toApiDate = (dateStr?: string) => {
  if (!dateStr) return '';
  try {
    if (dateStr.includes('-') && dateStr.split('-')[0].length === 2) {
      return dateStr;
    }
    return format(parse(dateStr, 'yyyy-MM-dd', new Date()), 'dd-MM-yyyy');
  } catch {
    return dateStr;
  }
};

export default function PromoCodeForm({ isOpen, setIsOpen, promoCode }: PromoCodeFormProps) {
  const { t } = useTranslation();
  const isEdit = !!promoCode;

  const discountTypeOptions = useMemo(
    () => [
      { value: '1', label: t('promo.form.percentage', 'Percentage (%)') },
      { value: '0', label: t('promo.form.fixed', 'Fixed Price (€)') },
    ],
    [t],
  );

  const form = useLiveForm<PromoCodeFormValues>({
    resolver: zodResolver(getPromoCodeSchema(t)) as any,
    defaultValues: {
      codeNameEn: '',
      codeNameIt: '',
      code: '',
      discountType: 1,
      discountValue: 0,
      maxUsesPerUser: 1,
      startDate: '',
      endDate: '',
    },
    values:
      isEdit && promoCode
        ? {
            codeNameEn: promoCode.codeNameEn ?? '',
            codeNameIt: promoCode.codeNameIt ?? '',
            code: promoCode.code ?? '',
            discountType: promoCode.discountType ?? 1,
            discountValue: promoCode.discountValue ?? 0,
            maxUsesPerUser: promoCode.maxUsesPerUser ?? 1,
            startDate: toInputDate(promoCode.startDate),
            endDate: toInputDate(promoCode.endDate),
          }
        : undefined,
  });

  const { control, handleSubmit, watch } = form;
  const discountType = watch('discountType');

  const { mutate: createMutate, isPending: isCreating } = useCreateTax({
    onSuccess: () => setIsOpen(false),
  });
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateTax({
    onSuccess: () => setIsOpen(false),
  });

  const isPending = isCreating || isUpdating;

  const handleFormSubmit = handleSubmit((values: PromoCodeFormValues) => {
    const payload = {
      ...values,
      discountType: Number(values.discountType),
      startDate: toApiDate(values.startDate),
      endDate: toApiDate(values.endDate),
    };

    if (isEdit && promoCode) {
      updateMutate({ id: promoCode.id, ...payload });
      return;
    }

    createMutate(payload);
  });

  return (
    <Form {...form}>
      <form
        id='promo-form'
        className='h-full w-full'
        onSubmit={handleFormSubmit}
      >
        <EditModal
          isOpen={isOpen}
          toggle={setIsOpen}
          title={isEdit ? t('promo.form.titleEdit', 'Edit Promo Code') : t('promo.form.titleCreate', 'Add Promo Code')}
          formId='promo-form'
          submitLabel={isEdit ? t('promo.form.submitUpdate', 'Save') : t('promo.form.submitCreate', 'Save')}
          
          isLoading={isPending}
        >
          <div className='col-span-full space-y-5'>
            {/* Code Names - Two Column Layout */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <CustomInput
                control={control}
                name='codeNameEn'
                label={t('promo.form.nameEn')}
                placeholder={t('promo.form.nameEnPlaceholder')}
                required
              />
              <CustomInput
                control={control}
                name='codeNameIt'
                label={t('promo.form.nameIt')}
                placeholder={t('promo.form.nameItPlaceholder')}
                required
              />
            </div>

            {/* Code (Public) - Full Width */}
            <CustomInput
              control={control}
              name='code'
              label={t('promo.form.code')}
              placeholder={t('promo.form.codePlaceholder')}
              required
            />

            {/* Discount Type and Value - Two Column Layout */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <CustomSelect
                control={control}
                name='discountType'
                label={t('promo.form.discountType')}
                placeholder={t('promo.form.discountTypePlaceholder')}
                options={discountTypeOptions}
                required
              />
              <CustomNumberInput
                control={control}
                name='discountValue'
                label={t('promo.form.discountValue')}
                placeholder={discountType === 1 ? '%' : '€'}
                step='0.01'
                required
              />
            </div>

            {/* Validity Dates - Two Column Layout */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <CustomInput
                control={control}
                name='startDate'
                type='date'
                label={t('promo.form.startDate', 'Validity Start Date')}
                required
              />
              <CustomInput
                control={control}
                name='endDate'
                type='date'
                label={t('promo.form.endDate', 'Validity End Date')}
                required
              />
            </div>

            {/* Max Uses - Full Width */}
            <CustomNumberInput
              control={control}
              name='maxUsesPerUser'
              label={t('promo.form.maxUsesPerUser', 'Max Uses')}
              placeholder={t('promo.form.maxUsesPerUserPlaceholder', '1 time')}
              required
            />
          </div>
        </EditModal>
      </form>
    </Form>
  );
}
