import fs from 'node:fs';
import path from 'node:path';

const modules = {
  dashboard: {
    pages: [{ name: 'Dashboard', i18nKey: 'sidebar.nav.dashboard', root: true }],
  },
  reservations: {
    pages: [
      { name: 'ApartmentsPage', i18nKey: 'sidebar.reservations.apartments' },
      { name: 'OfficesPage', i18nKey: 'sidebar.reservations.offices' },
      { name: 'SettingsPage', i18nKey: 'sidebar.reservations.settings' },
    ],
  },
  services: {
    pages: [
      { name: 'ServicePage', i18nKey: 'sidebar.services.service' },
      { name: 'ServiceRequestPage', i18nKey: 'sidebar.services.serviceRequest' },
      { name: 'PackagesPage', i18nKey: 'sidebar.services.packages' },
      { name: 'ItemsPage', i18nKey: 'sidebar.services.items' },
    ],
  },
  properties: {
    pages: [
      { name: 'BuildingsPage', i18nKey: 'sidebar.properties.buildings' },
      { name: 'ApartmentsPage', i18nKey: 'sidebar.properties.apartments' },
      { name: 'OfficesPage', i18nKey: 'sidebar.properties.offices' },
      { name: 'AmenitiesPage', i18nKey: 'sidebar.properties.amenities' },
    ],
  },
  financial: {
    pages: [
      { name: 'InvoicesPage', i18nKey: 'sidebar.financial.invoices' },
      { name: 'TaxesPage', i18nKey: 'sidebar.financial.taxes' },
      { name: 'PromoCodePage', i18nKey: 'sidebar.financial.promoCode' },
    ],
  },
  devices: {
    pages: [{ name: 'Devices', i18nKey: 'sidebar.nav.devices', root: true }],
  },
  settings: {
    pages: [
      { name: 'CitiesPage', i18nKey: 'sidebar.settings.cities' },
      { name: 'SmartGuidePage', i18nKey: 'sidebar.settings.smartGuide' },
    ],
  },
};

const pageTemplate = (componentName, i18nKey) => `import PageLayout from '@/components/layout/PageLayout';
import { UnderDevelopment } from '@/components/shared/empty-states';
import { useTranslation } from 'react-i18next';

const ${componentName} = () => {
  const { t } = useTranslation();

  return (
    <PageLayout title={t('${i18nKey}')}>
      <UnderDevelopment />
    </PageLayout>
  );
};

export default ${componentName};
`;

const singular = (name) => {
  if (name === 'Properties') return 'Property';
  return name.replace(/s$/, '');
};

for (const [moduleName, config] of Object.entries(modules)) {
  const base = path.join('src', 'modules', moduleName);
  const typeName = singular(moduleName.charAt(0).toUpperCase() + moduleName.slice(1));
  const queryKey = moduleName.toUpperCase().replace(/-/g, '_') + '_QUERY_KEY';
  const folders = ['components/table', 'constants', 'hooks', 'services', 'types', 'pages'];

  for (const folder of folders) {
    fs.mkdirSync(path.join(base, folder), { recursive: true });
  }

  fs.writeFileSync(
    path.join(base, 'constants', `${moduleName}.constants.ts`),
    `export const ${queryKey} = '${moduleName}' as const;\n`,
  );

  fs.writeFileSync(
    path.join(base, 'types', `${moduleName}.types.ts`),
    `export type ${typeName}ListItem = {\n  id: string;\n};\n`,
  );

  fs.writeFileSync(
    path.join(base, 'services', `${moduleName}.service.ts`),
    `import type { ${typeName}ListItem } from '../types/${moduleName}.types';\n\n// API methods will be added when endpoints are available.\nexport type { ${typeName}ListItem };\n`,
  );

  fs.writeFileSync(
    path.join(base, 'hooks', `use${typeName}s.ts`),
    `import { ${queryKey} } from '../constants/${moduleName}.constants';\n\nexport const use${typeName}s = () => {\n  return {\n    queryKey: ${queryKey},\n  };\n};\n`,
  );

  fs.writeFileSync(
    path.join(base, 'components/table', `${typeName}sTable.tsx`),
    `// Table component will be implemented when API is available.\n\nconst ${typeName}sTable = () => null;\n\nexport default ${typeName}sTable;\n`,
  );

  for (const page of config.pages) {
    const fileName = page.root ? `${page.name}.tsx` : `pages/${page.name}.tsx`;
    fs.writeFileSync(path.join(base, fileName), pageTemplate(page.name, page.i18nKey));
  }
}

console.log('Created modules:', Object.keys(modules).join(', '));
