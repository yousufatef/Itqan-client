import { useForm, type UseFormProps, type FieldValues } from 'react-hook-form';
import useSyncFormLocalization from './useSyncFormLocalization';

export default function useLiveForm<TFieldValues extends FieldValues = FieldValues>(
  props?: Omit<UseFormProps<TFieldValues>, 'mode' | 'reValidateMode'>,
) {
  const form = useForm<TFieldValues>({
    ...props,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  useSyncFormLocalization(form);

  return form;
}
