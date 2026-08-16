import fs from 'node:fs';
import path from 'node:path';

const groupedModules = {
  services: [
    { key: 'service', pageFile: 'ServicePage.tsx', titleKey: 'sidebar.services.service' },
    {
      key: 'service-request',
      pageFile: 'ServiceRequestPage.tsx',
      titleKey: 'sidebar.services.serviceRequest',
    },
    { key: 'packages', pageFile: 'PackagesPage.tsx', titleKey: 'sidebar.services.packages' },
    { key: 'items', pageFile: 'ItemsPage.tsx', titleKey: 'sidebar.services.items' },
  ],
  properties: [
    { key: 'buildings', pageFile: 'BuildingsPage.tsx', titleKey: 'sidebar.properties.buildings' },
    {
      key: 'apartments',
      pageFile: 'ApartmentsPage.tsx',
      titleKey: 'sidebar.properties.apartments',
    },
    { key: 'offices', pageFile: 'OfficesPage.tsx', titleKey: 'sidebar.properties.offices' },
    { key: 'amenities', pageFile: 'AmenitiesPage.tsx', titleKey: 'sidebar.properties.amenities' },
  ],
  financial: [
    { key: 'invoices', pageFile: 'InvoicesPage.tsx', titleKey: 'sidebar.financial.invoices' },
    { key: 'taxes', pageFile: 'TaxesPage.tsx', titleKey: 'sidebar.financial.taxes' },
    { key: 'promo-code', pageFile: 'PromoCodePage.tsx', titleKey: 'sidebar.financial.promoCode' },
  ],
  settings: [
    { key: 'cities', pageFile: 'CitiesPage.tsx', titleKey: 'sidebar.settings.cities' },
    {
      key: 'smart-guide',
      pageFile: 'SmartGuidePage.tsx',
      titleKey: 'sidebar.settings.smartGuide',
    },
  ],
};

const toPascalCase = (value) =>
  value
    .split(/[-_/]/g)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('');

const ensureDir = (dirPath) => fs.mkdirSync(dirPath, { recursive: true });

const writeFileIfMissing = (filePath, contents) => {
  ensureDir(path.dirname(filePath));
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, contents);
  }
};

const updatePageFile = (moduleName, feature, pageFileName) => {
  const pagePath = path.join('src', 'modules', moduleName, 'pages', pageFileName);
  if (!fs.existsSync(pagePath)) return;

  const featurePascal = toPascalCase(feature);
  const modulePascal = toPascalCase(moduleName);
  const tableComponent = `${featurePascal}${modulePascal}Table`;
  const tableImport = `@/modules/(${moduleName})/${feature}/components/table/${tableComponent}`;

  const content = fs.readFileSync(pagePath, 'utf8');
  const next = content
    .replace(
      "import { UnderDevelopment } from '@/components/shared/empty-states';\n",
      `import ${tableComponent} from '${tableImport}';\n`,
    )
    .replace('<UnderDevelopment />', `<${tableComponent} />`);

  fs.writeFileSync(pagePath, next);
};

for (const [moduleName, features] of Object.entries(groupedModules)) {
  for (const featureConfig of features) {
    const feature = featureConfig.key;
    const groupBase = path.join('src', 'modules', `(${moduleName})`, feature);
    const featurePascal = toPascalCase(feature);
    const modulePascal = toPascalCase(moduleName);
    const tableComponent = `${featurePascal}${modulePascal}Table`;

    writeFileIfMissing(
      path.join(groupBase, 'constants', `${feature}.constants.ts`),
      `export const ${moduleName.toUpperCase()}_${feature
        .toUpperCase()
        .replace(/-/g, '_')}_QUERY_KEY = '${moduleName}-${feature}' as const;\n`,
    );

    writeFileIfMissing(
      path.join(groupBase, 'types', `${feature}.types.ts`),
      `export type ${featurePascal}${modulePascal}ListItem = {\n  id: string;\n};\n`,
    );

    writeFileIfMissing(
      path.join(groupBase, 'hooks', `use${featurePascal}${modulePascal}.ts`),
      `import { ${moduleName.toUpperCase()}_${feature
        .toUpperCase()
        .replace(/-/g, '_')}_QUERY_KEY } from '../constants/${feature}.constants';\n\nexport const use${featurePascal}${modulePascal} = () => {\n  return {\n    queryKey: ${moduleName.toUpperCase()}_${feature
        .toUpperCase()
        .replace(/-/g, '_')}_QUERY_KEY,\n  };\n};\n`,
    );

    writeFileIfMissing(
      path.join(groupBase, 'services', `${feature}.service.ts`),
      `import type { ${featurePascal}${modulePascal}ListItem } from '../types/${feature}.types';\n\n// API methods will be added when endpoints are available.\nexport type { ${featurePascal}${modulePascal}ListItem };\n`,
    );

    writeFileIfMissing(
      path.join(groupBase, 'components/table', `${tableComponent}.tsx`),
      `import { UnderDevelopment } from '@/components/shared/empty-states';\n\nconst ${tableComponent} = () => {\n  return <UnderDevelopment />;\n};\n\nexport default ${tableComponent};\n`,
    );

    updatePageFile(moduleName, feature, featureConfig.pageFile);
  }
}

console.log('Grouped module scaffolding completed.');
