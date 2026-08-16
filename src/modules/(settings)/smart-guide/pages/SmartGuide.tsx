import PageLayout from '@/components/layout/PageLayout';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import SmartGuideForm from '../components/SmartGuideForm';
import SmartGuideTable from '../components/table/SmartGuideTable';


const SmartGuide = () => {
  const { t } = useTranslation();
  const [isAddingSmartGuide, setIsAddingSmartGuide] = useState(false);

  return (
    <PageLayout
      title={t('smartGuide.title')}
      subtitle={t('smartGuide.subtitle')}
      actions={
        <Button
          className='flex h-12 items-center gap-1 px-6'
          onClick={() => setIsAddingSmartGuide(true)}
        >
          <PlusIcon />
          <span>{t('smartGuide.createBtn')}</span>
        </Button>
      }
    >
      <SmartGuideTable />
      {isAddingSmartGuide && (
        <SmartGuideForm
          isOpen={isAddingSmartGuide}
          setIsOpen={setIsAddingSmartGuide}
        />
      )}
    </PageLayout>
  );
};

export default SmartGuide;
