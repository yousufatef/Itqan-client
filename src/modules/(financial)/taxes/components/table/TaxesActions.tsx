import { Button } from '@/components/ui/button';
import { Edit2Icon, Trash } from 'lucide-react';
import { useState } from 'react';
import TaxesForm from '../TaxesForm';
import ConfirmDialog from '@/components/shared/customs/CustomConfirmDialog';
import { useTranslation } from 'react-i18next';
import type { Tax } from '../../types/taxes.types';
import useDeleteTaxes from '../../hooks/useDeleteTaxes';

export default function TaxesActions({ tax }: { tax: Tax }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { t } = useTranslation();

  const { mutate: deleteTax, isPending: isDeleting } = useDeleteTaxes({
    onSuccess: () => setIsDeleteOpen(false),
  });

  function handleDelete() {
    deleteTax(tax.id.toString());
  }

  return (
    <>
      <div className='flex items-center gap-0.5'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setIsDeleteOpen(true)}
          disabled={!tax.isActive}
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
        <TaxesForm
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          tax={tax}
        />
      )}

      <ConfirmDialog
        open={isDeleteOpen}
        title={<p className=''>{t('taxes.actions.deleteTitle')}</p>}
        description={<p className='text-secondary-400'>{t('taxes.actions.deleteDesc1')} </p>}
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
