import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function flattenKeys(obj, prefix = '') {
  let keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      keys = keys.concat(flattenKeys(v, newKey));
    } else {
      keys.push(newKey);
    }
  }
  return keys;
}

const enPath = path.join(__dirname, '../src/i18n/locales/en.json');
const itPath = path.join(__dirname, '../src/i18n/locales/it.json');

const enJson = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
const itJson = JSON.parse(fs.readFileSync(itPath, 'utf-8'));

const enKeys = new Set(flattenKeys(enJson));
const itKeys = new Set(flattenKeys(itJson));

function getFiles(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getFiles(fullPath));
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

const argsFiles = process.argv.slice(2);
let files = [];

if (argsFiles.includes('--all')) {
  // Check everything in src if --all flag is passed
  const srcDir = path.join(__dirname, '../src');
  files = getFiles(srcDir);
} else if (argsFiles.length > 0) {
  // Only check files passed as arguments that are JS/TS files
  files = argsFiles.filter(f => /\.(tsx?|jsx?)$/.test(f));
} else {
  // Fallback to checking everything in src
  const srcDir = path.join(__dirname, '../src');
  files = getFiles(srcDir);
}

let hasError = false;

// Matches t('key') or t("key") or i18n.t("key")
const regex = /\bt\(\s*(['"])([^'"]+)\1/g;

for (const file of files) {
  if (file.includes('validate-translations.js')) continue;

  const content = fs.readFileSync(file, 'utf-8');
  let match;
  while ((match = regex.exec(content)) !== null) {
    const key = match[2];
    
    let missingEn = !enKeys.has(key);
    let missingIt = !itKeys.has(key);

    if (missingEn || missingIt) {
      console.error(`\x1b[31mError: Translation key "${key}" not found in locales.\x1b[0m`);
      console.error(`  -> File: ${path.relative(path.join(__dirname, '..'), file)}`);
      if (missingEn) console.error(`  -> Missing in en.json`);
      if (missingIt) console.error(`  -> Missing in it.json`);
      hasError = true;
    }
  }
}

if (hasError) {
  console.error('\n\x1b[31mTranslation validation failed! Please fix the missing keys above.\x1b[0m\n');
  process.exit(1);
} else {
  console.log('\x1b[32mTranslation validation passed.\x1b[0m');
}
