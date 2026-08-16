import CustomInput, { CustomSelect } from '@/components/forms';
import CustomNumberInput from '@/components/forms/CustomNumberInput';
import EditModal from '@/components/shared/customs/EditModal';
import useLiveForm from '@/hooks/useLiveForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from '@/components/ui/form';
import MainLoader from '@/components/shared/loader/MainLoader';
import type { Tax } from '../types/taxes.types';
import useAllTaxesTypeAll from '../hooks/useAllTaxesTypeAll';
import { getTaxSchema, type TaxFormValues } from '../types/taxes.schema';
import useCreateTax from '../hooks/useCreateTax';
import useUpdateTax from '../hooks/useUpdateTax';
import useTaxDetails from '../hooks/useTaxDetails';

type TaxesFormProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tax?: Tax;
};

export default function TaxesForm({ isOpen, setIsOpen, tax }: TaxesFormProps) {
  const { t, i18n } = useTranslation();
  const isEdit = !!tax;
  const isItalian = i18n.language.startsWith('it');

  // Fetch fresh tax data from API when editing
  const { data: taxDetails, isLoading: isFetchingTax } = useTaxDetails(tax?.id ?? '');
  const freshTax = taxDetails?.result;

  const {
    data: taxTypesData,
    isLoading: isLoadingTypes,
    isFetching: isFetchingTypes,
  } = useAllTaxesTypeAll();
  const taxTypes = taxTypesData?.result ?? [];

  const calculationTypeOptions = useMemo(
    () => [
      { value: '1', label: t('taxes.form.percentage', 'Percentage (%)') },
      { value: '0', label: t('taxes.form.fixed', 'Fixed Price') },
    ],
    [t],
  );

  const taxTypeOptions = useMemo(
    () =>
      taxTypes.map((taxType) => ({
        value: String(taxType.id),
        label: taxType.name || (isItalian ? taxType.nameIt : taxType.nameEn) || '',
      })),
    [isItalian, taxTypes],
  );

  // `values` syncs reactively once freshTax arrives from API
  const form = useLiveForm<TaxFormValues>({
    resolver: zodResolver(getTaxSchema(t)) as any,
    defaultValues: {
      nameEn: '',
      nameIt: '',
      calculationType: 1,
      rate: 0,
      type: 0,
    },
    values:
      isEdit && freshTax
        ? {
            nameEn: freshTax.nameEn ?? '',
            nameIt: freshTax.nameIt ?? '',
            calculationType: freshTax.calculationType ?? 1,
            rate: freshTax.rate ?? 0,
            type: Number(freshTax.type ?? 0),
          }
        : undefined,
  });

  const { control, handleSubmit } = form;

  const { mutate: createMutate, isPending: isCreating } = useCreateTax({
    onSuccess: () => setIsOpen(false),
  });
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateTax({
    onSuccess: () => setIsOpen(false),
  });

  const isPending = isCreating || isUpdating;

  const handleFormSubmit = handleSubmit((values: TaxFormValues) => {
    const payload = values;

    if (isEdit && tax) {
      updateMutate({ id: tax.id, ...payload });
      return;
    }

    createMutate(payload);
  });

  return (
    <Form {...form}>
      <form
        id='tax-form'
        className='h-full'
        onSubmit={handleFormSubmit}
      >
        <EditModal
          isOpen={isOpen}
          toggle={setIsOpen}
          title={isEdit ? t('taxes.form.titleEdit') : t('taxes.form.titleCreate')}
          formId='tax-form'
          submitLabel={isEdit ? t('taxes.form.submitUpdate') : t('taxes.form.submitCreate')}
          isLoading={isPending}
        >
          {isEdit && isFetchingTax ? (
            <MainLoader />
          ) : (
            <>
              <CustomInput
                control={control}
                name='nameEn'
                label={t('taxes.form.nameEn')}
                placeholder={t('taxes.form.nameEnPlaceholder')}
                required
                wrapperClassName='xl:col-span-1'
              />
              <CustomInput
                control={control}
                name='nameIt'
                label={t('taxes.form.nameIt')}
                placeholder={t('taxes.form.nameItPlaceholder')}
                required
                wrapperClassName='xl:col-span-1'
              />
              <CustomSelect
                control={control}
                name='type'
                label={t('taxes.form.taxType')}
                placeholder={t('taxes.form.taxTypePlaceholder', 'Select tax type')}
                options={taxTypeOptions}
                disabled={isLoadingTypes || isFetchingTypes}
                required
                wrapperClassName='col-span-full'
              />
              <CustomSelect
                control={control}
                name='calculationType'
                label={t('taxes.form.calculationType', 'Calculation Type')}
                placeholder={t('taxes.form.calculationTypePlaceholder', 'Select calculation type')}
                options={calculationTypeOptions}
                required
                wrapperClassName='xl:col-span-1'
              />
              <CustomNumberInput
                control={control}
                name='rate'
                label={t('taxes.form.taxRate')}
                placeholder={t('taxes.form.taxRatePlaceholder')}
                step='0.01'
                required
                wrapperClassName='xl:col-span-1'
              />
            </>
          )}
        </EditModal>
      </form>
    </Form>
  );
}
