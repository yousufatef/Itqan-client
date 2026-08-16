import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, PlayCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import useSmartGuideById from '../hooks/useSmartGuideById';
import SmartGuideForm from './SmartGuideForm';
import ConfirmDialog from '@/components/shared/customs/CustomConfirmDialog';
import useDeleteSmartGuide from '../hooks/useDeleteSmartGuide';
import type { HowToUseApp } from '../types/smart-guide.types';

type SmartGuideViewModalProps = {
  id: string;
  isOpen: boolean;
  onClose: () => void;
};

function DetailItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className='flex flex-col gap-1'>
      <span className='text-muted-foreground text-xs'>{label}</span>
      <span className='text-foreground text-sm font-semibold'>{value || '—'}</span>
    </div>
  );
}

// ─── inner component rendered OUTSIDE the view Dialog ─────────────────────────
function EditAfterView({ guide, onDone }: { guide: HowToUseApp; onDone: () => void }) {
  const [open, setOpen] = useState(true);

  return (
    <SmartGuideForm
      isOpen={open}
      setIsOpen={(val) => {
        setOpen(val as boolean);
        if (!val) onDone();
      }}
      smartGuide={guide}
    />
  );
}

export default function SmartGuideViewModal({ id, isOpen, onClose }: SmartGuideViewModalProps) {
  const { t } = useTranslation();
  // 'edit' state lives here so Edit form mounts AFTER view unmounts
  const [showEdit, setShowEdit] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data, isLoading } = useSmartGuideById(id);
  const guide = data?.result;

  const { mutate: deleteSmartGuide, isPending: isDeleting } = useDeleteSmartGuide({
    onSuccess: () => {
      setIsDeleteOpen(false);
      onClose();
    },
  });

  return (
    <>
      {/* ── View Dialog ─────────────────────────────────────────────────── */}
      <Dialog
        open={isOpen}
        onOpenChange={(open) => !open && onClose()}
      >
        <DialogContent className='w-97.5 max-w-[calc(100vw-2rem)] gap-0 overflow-hidden p-0 lg:w-165 lg:max-w-165'>
          <DialogHeader className='px-6 pt-6 pb-4'>
            <DialogTitle className='text-xl font-bold'>
              {t('smartGuide.view.title', 'Smart Guide Details')}
            </DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className='flex items-center justify-center py-20'>
              <Loader2 className='text-primary size-8 animate-spin' />
            </div>
          ) : guide ? (
            <>
              {/* ── Video / Thumbnail ─────────────────────────────────── */}
              {guide.fileUrl ? (
                <div
                  className='relative w-full bg-black'
                  style={{ aspectRatio: '16/9' }}
                >
                  <video
                    key={guide.fileUrl}
                    className='h-full w-full'
                    controls
                    controlsList='nodownload'
                    poster={guide.thumbnailURL || undefined}
                    preload='metadata'
                    style={{ display: 'block' }}
                  >
                    <source
                      src={guide.fileUrl}
                      type='video/mp4'
                    />
                    <source src={guide.fileUrl} />
                  </video>
                </div>
              ) : guide.thumbnailURL ? (
                <div
                  className='bg-muted relative w-full'
                  style={{ aspectRatio: '16/9' }}
                >
                  <img
                    src={guide.thumbnailURL}
                    alt={guide.titleEn}
                    className='h-full w-full object-cover'
                  />
                  <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
                    <PlayCircle className='size-16 text-white/80' />
                  </div>
                </div>
              ) : null}

              {/* ── Details ───────────────────────────────────────────── */}
              <div className='bg-muted/30 space-y-4 px-6 py-4'>
                <p className='text-muted-foreground text-sm font-medium'>
                  {t('smartGuide.view.details', 'Details')}
                </p>
                <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
                  <DetailItem
                    label={t('smartGuide.view.titleEn', 'Title (EN)')}
                    value={guide.titleEn}
                  />
                  <DetailItem
                    label={t('smartGuide.view.titleIt', 'Title (IT)')}
                    value={guide.titleIt}
                  />
                  <DetailItem
                    label={t('smartGuide.view.descriptionEn', 'Description (EN)')}
                    value={guide.descriptionEn}
                  />
                  <DetailItem
                    label={t('smartGuide.view.descriptionIt', 'Description (IT)')}
                    value={guide.descriptionIt}
                  />
                </div>
              </div>

              {/* ── Footer ────────────────────────────────────────────── */}
              <div className='grid grid-cols-2 gap-3 border-t px-6 py-4'>
                <Button
                  variant='outline'
                  className='text-primary border-primary hover:bg-primary/5'
                  onClick={() => setIsDeleteOpen(true)}
                >
                  {t('smartGuide.actions.delete', 'Delete')}
                </Button>
                <Button
                  onClick={() => {
                    // close view first, then open edit
                    onClose();
                    setShowEdit(true);
                  }}
                >
                  {t('smartGuide.actions.edit', 'Edit')}
                </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* ── Edit form — mounts only after view dialog closes ────────────── */}
      {showEdit && guide && (
        <EditAfterView
          guide={guide}
          onDone={() => setShowEdit(false)}
        />
      )}

      {/* ── Delete confirm ──────────────────────────────────────────────── */}
      <ConfirmDialog
        open={isDeleteOpen}
        title={<p>{t('smartGuide.actions.deleteTitle', 'Delete Smart Guide?')}</p>}
        description={
          <p className='text-secondary-400'>
            {t(
              'smartGuide.actions.deleteDesc',
              'Are you sure you want to delete this smart guide? This action cannot be undone.',
            )}
          </p>
        }
        confirmText={t('smartGuide.actions.delete', 'Delete')}
        cancelText={t('smartGuide.actions.cancel', 'Cancel')}
        onConfirm={() => deleteSmartGuide(id)}
        onCancel={() => setIsDeleteOpen(false)}
        mode='default'
        loading={isDeleting}
      />
    </>
  );
}
