import PageLayout from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import TaxesForm from '../components/TaxesForm';
import TaxesTable from '../components/table/TaxesTable';
// import TaxesTypeTable from '../components/taxes-types/TaxesTypeTable';
import TaxesTypeForm from '../components/taxes-types/TaxesTypeForm';

enum TAXES_TAB_VALUES {
  TAX = 'tax',
  TAX_TYPES = 'taxTypes',
}

const TaxesPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>(TAXES_TAB_VALUES.TAX);
  const [isAddingTax, setIsAddingTax] = useState(false);
  const [isAddingTaxType, setIsAddingTaxType] = useState(false);

  const tabs = useMemo(
    () => [
      {
        value: TAXES_TAB_VALUES.TAX,
        label: t('taxes.tabs.taxes'),
        content: <TaxesTable />,
      },
      // {
      //   value: TAXES_TAB_VALUES.TAX_TYPES,
      //   label: t('taxes.tabs.taxTypes'),
      //   content: <TaxesTypeTable />,
      // },
    ],
    [t],
  );

  const isTaxTypeTab = activeTab === TAXES_TAB_VALUES.TAX_TYPES;

  return (
    <PageLayout
      title={t('taxes.title')}
      subtitle={t('taxes.subtitle')}
    >
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className='mb-6 w-full gap-4'
      >
        <div className='flex items-center justify-between'>
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {isTaxTypeTab ? (
            <Button
              className='flex h-12 items-center gap-1 px-6'
              onClick={() => setIsAddingTaxType(true)}
            >
              <PlusIcon />
              <span>{t('taxesType.form.titleCreate')}</span>
            </Button>
          ) : (
            <Button
              className='flex h-12 items-center gap-1 px-6'
              onClick={() => setIsAddingTax(true)}
            >
              <PlusIcon />
              <span>{t('taxes.createBtn')}</span>
            </Button>
          )}
        </div>

        {tabs.map(({ content, value }) => (
          <TabsContent
            key={value}
            value={value}
          >
            {content}
          </TabsContent>
        ))}
      </Tabs>

      {isAddingTax && (
        <TaxesForm
          isOpen={isAddingTax}
          setIsOpen={setIsAddingTax}
        />
      )}

      {isAddingTaxType && (
        <TaxesTypeForm
          isOpen={isAddingTaxType}
          setIsOpen={setIsAddingTaxType}
        />
      )}
    </PageLayout>
  );
};

export default TaxesPage;
