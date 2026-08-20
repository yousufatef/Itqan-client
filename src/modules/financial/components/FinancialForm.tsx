import CustomInput from '@/components/forms';
import { CustomNumberInput } from '@/components/forms';
import EditModal from '@/components/shared/customs/EditModal';
import useLiveForm from '@/hooks/useLiveForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Form } from '@/components/ui/form';
import useCreateFinancialInvoice from '../hooks/useCreateFinancialInvoice';
import useUpdateFinancialInvoice from '../hooks/useUpdateFinancialInvoice';
import type { IFinancialInvoice } from '../types';

type InvoiceFormValues = {
  studentName: string;
  totalAmount: unknown;
  paidAmount: unknown;
};

type StudentFormProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  student?: IFinancialInvoice;
};

const invoiceSchema = z.object({
  studentName: z.string().min(1, 'اسم الطالب مطلوب'),
  totalAmount: z.coerce.number().positive('يجب أن يكون المبلغ أكبر من صفر'),
  paidAmount: z.coerce.number().min(0, 'لا يمكن أن يكون المدفوع سالباً'),
});

export default function FinancialForm({ isOpen, setIsOpen, student }: StudentFormProps) {
  const isEdit = !!student;
  const form = useLiveForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      studentName: student?.studentName || '',
      totalAmount: student?.totalAmount || 0,
      paidAmount: student?.paidAmount || 0,
    },
  });

  const { control, handleSubmit } = form;

  const { mutate: createMutate, isPending: isCreatePending } = useCreateFinancialInvoice({
    onSuccess: () => setIsOpen(false),
  });
  const { mutate: updateMutate, isPending: isUpdatePending } = useUpdateFinancialInvoice({
    onSuccess: () => setIsOpen(false),
  });

  const handleFormSubmit = handleSubmit((values) => {
    const invoiceValues = {
      studentName: values.studentName,
      totalAmount: Number(values.totalAmount),
      paidAmount: Number(values.paidAmount),
    };
    if (isEdit && student) {
      updateMutate({ id: student.id, values: invoiceValues });
    } else {
      createMutate(invoiceValues);
    }
  });
  return (
    <Form {...form}>
      <form
        id='invoice-form'
        className='h-full'
        onSubmit={handleFormSubmit}
      >
        <EditModal
          isOpen={isOpen}
          toggle={setIsOpen}
          title={isEdit ? 'تعديل الفاتورة' : 'إضافة فاتورة'}
          formId='invoice-form'
          submitLabel={isEdit ? 'حفظ التعديلات' : 'إضافة'}
          isLoading={isCreatePending || isUpdatePending}
        >
          <CustomInput
            required
            control={control}
            name='studentName'
            label='اسم الطالب'
            placeholder='أدخل اسم الطالب'
          />
          <CustomNumberInput
            required
            control={control}
            name='totalAmount'
            label='المبلغ الكلي'
            placeholder='أدخل المبلغ الكلي'
          />
          <CustomNumberInput
            required
            control={control}
            name='paidAmount'
            label='المدفوع'
            placeholder='أدخل المبلغ المدفوع'
          />
        </EditModal>
      </form>
    </Form>
  );
}
