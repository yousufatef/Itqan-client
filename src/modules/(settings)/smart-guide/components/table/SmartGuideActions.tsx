import { Button } from '@/components/ui/button';
import { Edit2Icon, Eye, Trash } from 'lucide-react';
import { useState } from 'react';
import SmartGuideForm from '../SmartGuideForm';
import SmartGuideViewModal from '../SmartGuideViewModal';
import ConfirmDialog from '@/components/shared/customs/CustomConfirmDialog';
import { useTranslation } from 'react-i18next';
import useDeleteSmartGuide from '../../hooks/useDeleteSmartGuide';
import type { HowToUseApp } from '../../types/smart-guide.types';

export default function SmartGuideActions({ smartGuide }: { smartGuide: HowToUseApp }) {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { t } = useTranslation();

  const { mutate: deleteSmartGuide, isPending: isDeleting } = useDeleteSmartGuide({
    onSuccess: () => setIsDeleteOpen(false),
  });

  return (
    <>
      <div className='flex items-center gap-0.5'>
        {/* View */}
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setIsViewOpen(true)}
        >
          <Eye className='size-4' />
        </Button>

        {/* Delete */}
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setIsDeleteOpen(true)}
        >
          <Trash className='size-4' />
        </Button>

        {/* Edit */}
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setIsEditOpen(true)}
        >
          <Edit2Icon className='size-4.5' />
        </Button>
      </div>

      {/* View Modal — fetches by ID */}
      {isViewOpen && (
        <SmartGuideViewModal
          id={smartGuide.id}
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
        />
      )}

      {/* Edit Form */}
      {isEditOpen && (
        <SmartGuideForm
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          smartGuide={smartGuide}
        />
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        open={isDeleteOpen}
        title={<p>{t('smartGuide.actions.deleteTitle', 'Delete Smart Guide?')}</p>}
        description={
          <p className='text-secondary-400'>
            {t('smartGuide.actions.deleteDesc', 'Are you sure you want to delete this smart guide? This action cannot be undone.')}
          </p>
        }
        confirmText={t('smartGuide.actions.delete', 'Delete')}
        cancelText={t('smartGuide.actions.cancel', 'Cancel')}
        onConfirm={() => deleteSmartGuide(smartGuide.id)}
        onCancel={() => setIsDeleteOpen(false)}
        mode='default'
        loading={isDeleting}
      />
    </>
  );
}
