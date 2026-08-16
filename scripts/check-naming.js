import path from 'path';
import fs from 'fs';

const files = process.argv.slice(2);
let hasError = false;

function isKebabCase(str) {
  // kebab-case: lowercase letters, numbers, and hyphens
  return /^[a-z0-9-]+$/.test(str);
}

function isRouteGroupFolder(str) {
  // Route group folders like "(services)" are valid module organizers.
  return /^\([a-z0-9-]+\)$/.test(str);
}

function isPascalCase(str) {
  // PascalCase: Starts with uppercase, only letters and numbers
  return /^[A-Z][a-zA-Z0-9]*$/.test(str);
}

function isException(file, nameWithoutExt, folders) {
  // Hooks
  if (nameWithoutExt.startsWith('use')) return true;
  
  // Entry points
  if (['main', 'router', 'index', 'App'].includes(nameWithoutExt)) return true;
  
  // shadcn/ui components usually default to kebab-case, so we can ignore them if desired.
  // We'll ignore the 'components/ui' folder path.
  const isUiComponent = folders.includes('components') && folders.includes('ui');
  if (isUiComponent) return true;

  return false;
}

for (const file of files) {
  // Use path.resolve and path.sep to handle different OS path formats properly
  const normalizedFile = path.resolve(file);
  const parts = normalizedFile.split(path.sep);
  const srcIndex = parts.lastIndexOf('src');
  
  if (srcIndex === -1) continue;
  
  // Check folders inside src/
  const folders = parts.slice(srcIndex + 1, -1);
  for (const folder of folders) {
    if (!isKebabCase(folder) && !isRouteGroupFolder(folder)) {
      console.error(`\x1b[31mERROR\x1b[0m: Folder name "${folder}" in path "${file}" does not follow kebab-case convention.`);
      hasError = true;
    }
  }
  
  // Check component filenames
  const filename = parts[parts.length - 1];
  if (filename.endsWith('.tsx') || filename.endsWith('.jsx')) {
    const nameWithoutExt = filename.replace(/\.(tsx|jsx)$/, '');
    
    if (!isPascalCase(nameWithoutExt) && !isException(normalizedFile, nameWithoutExt, folders)) {
      console.error(`\x1b[31mERROR\x1b[0m: Component filename "${filename}" in path "${file}" does not follow CamelCase (PascalCase) convention.`);
      hasError = true;
    }
  }
}

if (hasError) {
  console.error('\n\x1b[31mNaming convention check failed. Please fix the file/folder names above to commit.\x1b[0m\n');
  process.exit(1);
} else {
  process.exit(0);
}
