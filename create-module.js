import fs from "node:fs";
import path from "node:path";

const moduleName = process.argv[2];

if (!moduleName) {
  console.log("Please provide module name");
  process.exit(1);
}

const basePath = path.join("src", "modules", moduleName);

const structure = {
  hooks: ["example.ts"],
  pages: ["exampleNew.tsx"],
  service: [`example.service.ts`],
  types: [`index.types.ts`],
  components : [`example.tsx`]
};

Object.entries(structure).forEach(([folder, files]) => {
  const folderPath = path.join(basePath, folder);

  fs.mkdirSync(folderPath, { recursive: true });

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "");
    }
  });
});

console.log(`${moduleName} module created successfully`);
