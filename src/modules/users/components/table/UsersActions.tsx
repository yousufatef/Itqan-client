import { Button } from '@/components/ui/button';
import { Edit2Icon, Trash } from 'lucide-react';
import { useState } from 'react';
import ConfirmDialog from '@/components/shared/customs/CustomConfirmDialog';
import UsersForm from '../UsersForm';
import type { IUser } from '../../types';
import useDeleteUser from '../../hooks/useDeleteUser';

export default function UsersActions({ user }: { user: IUser }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser({
    onSuccess: () => setIsDeleteOpen(false),
  });

  function handleDelete() {
    deleteUser(user.id);
  }

  return (
    <>
      <div className='flex items-center gap-0.5'>
        <Button
          aria-label='حذف المستخدم'
          variant='ghost'
          size='sm'
          onClick={() => setIsDeleteOpen(true)}
        >
          <Trash className='size-4' />
        </Button>
        <Button
          aria-label='تعديل المستخدم'
          variant='ghost'
          size='sm'
          onClick={() => setIsEditOpen(true)}
        >
          <Edit2Icon className='size-4.5' />
        </Button>
      </div>

      {isEditOpen && (
        <UsersForm
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          user={user}
        />
      )}

      <ConfirmDialog
        open={isDeleteOpen}
        title='حذف المستخدم'
        description={
          <p className='text-secondary-400'>
            هل أنت متأكد من رغبتك في حذف هذا المستخدم؟
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
