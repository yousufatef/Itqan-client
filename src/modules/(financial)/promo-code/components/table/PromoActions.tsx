import { Button } from '@/components/ui/button';
import { Edit2Icon, Trash } from 'lucide-react';
import { useState } from 'react';
import PromoCodeForm from '../PromoCodeForm';
import ConfirmDialog from '@/components/shared/customs/CustomConfirmDialog';
import { useTranslation } from 'react-i18next';
import type { PromoCode } from '../../types/promo.types';
import useDeletePromoCode from '../../hooks/useDeletePromo';

export default function PromoActions({ promo }: { promo: PromoCode }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { t } = useTranslation();

  const { mutate: deletePromoCode, isPending: isDeleting } = useDeletePromoCode({
    onSuccess: () => setIsDeleteOpen(false),
  });

  function handleDelete() {
    deletePromoCode(promo.id);
  }

  return (
    <>
      <div className='flex items-center gap-0.5'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setIsDeleteOpen(true)}
        >
          <Trash className='size-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setIsEditOpen(true)}
        >
          <Edit2Icon className='size-4.5' />
        </Button>
      </div>

      {isEditOpen && (
        <PromoCodeForm
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          promoCode={promo}
        />
      )}

      <ConfirmDialog
        open={isDeleteOpen}
        title={<p className=''>{t('promo.actions.deleteTitle')}</p>}
        description={<p className='text-secondary-400'>{t('promo.actions.deleteDesc1')} </p>}
        confirmText={t('buildings.actions.delete')}
        cancelText={t('buildings.actions.cancel')}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
        mode='default'
        loading={isDeleting}
      />
    </>
  );
}
