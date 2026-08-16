import fs from 'fs';

const files = process.argv.slice(2);
let hasError = false;

// Matches console.log, console.warn, console.error, etc.
const consoleRegex = /console\.(log|warn|error|info|debug)\s*\(/;

for (const file of files) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    let inBlockComment = false;
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      
      // Simple handling for block comments
      if (line.includes('/*') && !line.includes('*/')) {
        inBlockComment = true;
      }
      if (line.includes('*/')) {
        inBlockComment = false;
        continue;
      }
      if (inBlockComment) continue;

      // Skip single line comments
      if (line.trim().startsWith('//')) {
        continue;
      }
      
      if (consoleRegex.test(line)) {
        console.error(`\x1b[31mERROR\x1b[0m: console statement found in ${file} on line ${i + 1}`);
        console.error(`  > ${line.trim()}`);
        hasError = true;
      }
    }
  } catch (error) {
    console.error(`Failed to read file ${file}:`, error.message);
  }
}

if (hasError) {
  console.error('\n\x1b[31mConsole logs check failed. Please remove console statements from the changed files above to commit.\x1b[0m\n');
  process.exit(1);
} else {
  process.exit(0);
}
