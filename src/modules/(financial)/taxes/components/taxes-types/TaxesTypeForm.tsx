import CustomInput from '@/components/forms/CustomInput';
import EditModal from '@/components/shared/customs/EditModal';
import useLiveForm from '@/hooks/useLiveForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { Form } from '@/components/ui/form';
import MainLoader from '@/components/shared/loader/MainLoader';

import type { TaxType } from '../../types/taxes-types.type';
import useCreateTaxType from '../../hooks/useCreateTaxType';
import useUpdateTaxType from '../../hooks/useUpdateTaxType';
import useTaxTypeDetails from '../../hooks/useTaxTypeDetails';
import { getTaxTypeSchema, type TaxTypeFormValues } from '../../types/taxes-type.schema';

type TaxesTypeFormProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  taxType?: TaxType;
};

export default function TaxesTypeForm({ isOpen, setIsOpen, taxType }: TaxesTypeFormProps) {
  const { t } = useTranslation();

  const isEdit = !!taxType;

  // Fetch fresh data from API when editing
  const { data: taxTypeDetails, isLoading: isFetchingDetails } = useTaxTypeDetails(
    taxType?.id !== undefined ? String(taxType.id) : '',
  );

  const freshData = taxTypeDetails?.result;

  // `values` syncs the form reactively whenever freshData changes (no useEffect needed)
  const form = useLiveForm({
    resolver: zodResolver(getTaxTypeSchema(t)),
    defaultValues: {
      nameEn: '',
      nameIt: '',
    },
    values: isEdit
      ? {
          nameEn: freshData?.nameEn ?? '',
          nameIt: freshData?.nameIt ?? '',
        }
      : undefined,
  });

  const { control, handleSubmit } = form;

  const { mutate: createMutate, isPending: isCreating } = useCreateTaxType({
    onSuccess: () => setIsOpen(false),
  });

  const { mutate: updateMutate, isPending: isUpdating } = useUpdateTaxType({
    onSuccess: () => setIsOpen(false),
  });

  const isPending = isCreating || isUpdating;

  const handleFormSubmit = handleSubmit((values: TaxTypeFormValues) => {
    if (isEdit && taxType) {
      updateMutate({ id: String(taxType.id), ...values });
      return;
    }

    createMutate(values);
  });

  return (
    <Form {...form}>
      <form
        id='tax-type-form'
        className='h-full'
        onSubmit={handleFormSubmit}
      >
        <EditModal
          isOpen={isOpen}
          toggle={setIsOpen}
          title={isEdit ? t('taxesType.form.titleEdit') : t('taxesType.form.titleCreate')}
          formId='tax-type-form'
          submitLabel={isEdit ? t('taxesType.form.submitUpdate') : t('taxesType.form.submitCreate')}
          isLoading={isPending}
        >
          {isEdit && isFetchingDetails ? (
            <MainLoader />
          ) : (
            <>
              <CustomInput
                control={control}
                name='nameEn'
                label={t('taxesType.form.nameEn')}
                placeholder={t('taxesType.form.nameEn')}
              />
              <CustomInput
                control={control}
                name='nameIt'
                label={t('taxesType.form.nameIt')}
                placeholder={t('taxesType.form.nameIt')}
              />
            </>
          )}
        </EditModal>
      </form>
    </Form>
  );
}

