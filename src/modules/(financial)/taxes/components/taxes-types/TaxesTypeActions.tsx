import { Button } from '@/components/ui/button';
import { Edit2Icon, Trash } from 'lucide-react';
import { useState } from 'react';
import ConfirmDialog from '@/components/shared/customs/CustomConfirmDialog';
import { useTranslation } from 'react-i18next';
import type { TaxType } from '../../types/taxes-types.type';
import TaxesTypeForm from './TaxesTypeForm';
import useDeleteTaxType from '../../hooks/useDeleteTaxType';

export default function TaxesTypeActions({ taxType }: { taxType: TaxType }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { t } = useTranslation();

  const { mutate: deleteTaxType, isPending: isDeleting } = useDeleteTaxType({
    onSuccess: () => setIsDeleteOpen(false),
  });

  function handleDelete() {
    deleteTaxType(taxType.id.toString());
  }

  return (
    <>
      <div className='flex items-center gap-0.5'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setIsDeleteOpen(true)}
          // disabled={!TaxType.isActive}
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
        <TaxesTypeForm
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          taxType={taxType}
        />
      )}

      <ConfirmDialog
        open={isDeleteOpen}
        title={<p className=''>{t('taxesType.actions.deleteTitle')}</p>}
        description={<p className='text-secondary-400'>{t('taxesType.actions.deleteDesc1')} </p>}
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
