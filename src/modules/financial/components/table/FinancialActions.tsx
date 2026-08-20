import { Button } from '@/components/ui/button';
import { Edit2Icon, Trash } from 'lucide-react';
import { useState } from 'react';
import ConfirmDialog from '@/components/shared/customs/CustomConfirmDialog';
import FinancialForm from '../FinancialForm';
import type { IFinancialInvoice } from '../../types';
import useDeleteFinancialInvoice from '../../hooks/useDeleteFinancialInvoice';

export default function FinancialActions({ student }: { student: IFinancialInvoice }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { mutate: deleteInvoice, isPending: isDeleting } = useDeleteFinancialInvoice({
    onSuccess: () => setIsDeleteOpen(false),
  });

  function handleDelete() {
    deleteInvoice(student.id);
  }

  return (
    <>
      <div className='flex items-center gap-0.5'>
        <Button
          aria-label='حذف الطالب'
          variant='ghost'
          size='sm'
          onClick={() => setIsDeleteOpen(true)}
        >
          <Trash className='size-4' />
        </Button>
        <Button
          aria-label='تعديل الطالب'
          variant='ghost'
          size='sm'
          onClick={() => setIsEditOpen(true)}
        >
          <Edit2Icon className='size-4.5' />
        </Button>
      </div>

      {isEditOpen && (
        <FinancialForm
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          student={student}
        />
      )}

      <ConfirmDialog
        open={isDeleteOpen}
        title='حذف الطالب'
        description={
          <p className='text-secondary-400'>
            هل أنت متأكد من رغبتك في حذف هذا الطالب؟
          </p>
        }
        confirmText='حذف'
        cancelText='إلغاء'
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
        loading={isDeleting}
      />
    </>
  );
}
