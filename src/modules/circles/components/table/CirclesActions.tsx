import { Button } from '@/components/ui/button';
import { Edit2Icon, Eye, Trash } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmDialog from '@/components/shared/customs/CustomConfirmDialog';
import CirclesForm from '../CirclesForm';
import useDeleteCircle from '../../hooks/useDeleteCircle';
import type { ICircle } from '../../types';

export default function CirclesActions({ circle }: { circle: ICircle }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { mutate: deleteCircle, isPending: isDeleting } = useDeleteCircle({
    onSuccess: () => setIsDeleteOpen(false),
  });

  function handleDelete() {
    deleteCircle(circle.id);
  }

  return (
    <>
      <div className='flex items-center gap-0.5'>
        <Button
          asChild
          aria-label='عرض تفاصيل الحلقة'
          variant='ghost'
          size='sm'
        >
          <Link to={`/circles/${circle.id}`}>
            <Eye className='size-4' />
          </Link>
        </Button>
        <Button
          aria-label='حذف الحلقة'
          variant='ghost'
          size='sm'
          onClick={() => setIsDeleteOpen(true)}
        >
          <Trash className='size-4' />
        </Button>
        <Button
          aria-label='تعديل الحلقة'
          variant='ghost'
          size='sm'
          onClick={() => setIsEditOpen(true)}
        >
          <Edit2Icon className='size-4.5' />
        </Button>
      </div>

      {isEditOpen && (
        <CirclesForm
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          circle={circle}
        />
      )}

      <ConfirmDialog
        open={isDeleteOpen}
        title='حذف الحلقة'
        description={
          <p className='text-secondary-400'>
            هل أنت متأكد من رغبتك في حذف هذه الحلقة؟
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
