import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

export default function useSyncFormLocalization<TFieldValues extends FieldValues = FieldValues>(
  form: UseFormReturn<TFieldValues>,
) {
  const { i18n } = useTranslation();

  useEffect(() => {
    const errorFields = Object.keys(form.formState.errors);
    if (errorFields.length > 0) {
      form.trigger(errorFields as any);
    }
  }, [i18n.language, form]);
}
