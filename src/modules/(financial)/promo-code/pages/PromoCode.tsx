import PageLayout from '@/components/layout/PageLayout';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import PromoCodeTable from '../components/table/PromoCodeTable';
import PromoCodeForm from '../components/PromoCodeForm';


const PromoCode = () => {
  const { t } = useTranslation();
  const [isAddingPromo, setIsAddingPromo] = useState(false);

 


  return (
    <PageLayout
      title={t('promoCode.title')}
      subtitle={t('promoCode.subtitle')}
      actions={
        <Button
          className='flex h-12 items-center gap-1 px-6'
          onClick={() => setIsAddingPromo(true)}
        >
          <PlusIcon />
          <span>{t('promoCode.createBtn')}</span>
        </Button>
      }
    >
<PromoCodeTable />
      {isAddingPromo && (
        <PromoCodeForm
          isOpen={isAddingPromo}
          setIsOpen={setIsAddingPromo}
        />
      )}

     
    </PageLayout>
  );
};

export default PromoCode;
