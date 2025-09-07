/**
 * 🧩 Component Generator Utility
 *
 * Automatically generates React TypeScript components for empty directories
 * in your components folder structure. This utility recursively scans the
 * component tree and creates boilerplate files where needed.
 *
 * 📋 What it does:
 * • Recursively scans all directories in the components folder
 * • Creates a Component.tsx file for each empty directory
 * • Generates an index.ts proxy file for clean imports
 * • Skips directories that already contain files
 * • Excludes specified folders (like 'shared') from component generation
 * • Processes subdirectories while respecting the exclusion rules
 *
 * 📁 File Structure Example:
 * components/
 * ├── Button/          ← Empty: ✅ Creates Button.tsx + index.ts
 * ├── Modal/           ← Has files: ⏭️ Skipped
 * │   └── Modal.tsx
 * ├── Card/            ← Only subdirs: ✅ Creates Card.tsx + index.ts
 * │   ├── Header/      ← Empty subdir: ✅ Creates Header.tsx + index.ts
 * │   └── Body/        ← Empty subdir: ✅ Creates Body.tsx + index.ts
 * └── shared/          ← Excluded: 🚫 No component created (but processes subdirs)
 *     └── Footer/      ← Empty: ✅ Creates Footer.tsx + index.ts
 *
 * 🛠️ Generated Files:
 * ComponentName.tsx - Basic functional component
 * index.ts - Export proxy for clean imports
 *
 * 🚀 Usage:
 * node generate-components.js
 *
 * 📝 Configuration:
 * • Modify `excludedFolders` array to skip specific directories
 * • Adjust `componentsPath` if your components are in a different location
 * • Customize component template in `componentContent` variable
 *
 * @author fabroche
 * @version 1.0.0
 * @since 2025-09-07
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const excludedFolders = ['shared', 'home'];

async function processDirectory(dirPath, level = 0) {
    const indent = "  ".repeat(level);

    try {
        const items = await fs.readdir(dirPath);

        for (const item of items) {
            const itemPath = path.resolve(dirPath, item);
            const stats = await fs.lstat(itemPath);

            if (stats.isDirectory()) {
                console.log(`${indent}📁 Procesando: ${item}`);

                const files = await fs.readdir(itemPath);

                // Filtrar solo archivos (no directorios)
                const actualFiles = [];
                const subDirectories = [];

                for (const file of files) {
                    const filePath = path.resolve(itemPath, file);
                    const fileStats = await fs.lstat(filePath);

                    if (fileStats.isDirectory()) {
                        subDirectories.push(file);
                    } else {
                        actualFiles.push(file);
                    }
                }
                // Si no hay archivos, crear componente
                if (actualFiles.length === 0 && !excludedFolders.includes(item.toLowerCase())) {
                    const componentName = item.charAt(0).toUpperCase() + item.slice(1);

                    const componentContent = `export function ${componentName}() {
    return (
        <section>
        <h1>${componentName}</h1>
        </section>
    );
}
`;
                    const indexContent = `export { ${componentName} } from "./${componentName}";\n`;

                    await Promise.all([
                        fs.writeFile(path.resolve(itemPath, `${componentName}.tsx`), componentContent),
                        fs.writeFile(path.resolve(itemPath, "index.ts"), indexContent)
                    ]);

                    console.log(`${indent}✅ Generado componente: ${componentName}`);
                } else {
                    console.log(`${indent}⏭️  Saltando ${item} (ya tiene ${actualFiles.length} archivo(s))`);
                }

                // RECURSIÓN: Procesar subdirectorios
                if (subDirectories.length > 0) {
                    console.log(`${indent}🔍 Explorando subdirectorios de ${item}...`);
                    await processDirectory(itemPath, level + 1);
                }
            }
        }
    } catch (error) {
        console.error(`❌ Error procesando ${dirPath}:`, error);
    }
}

async function generateComponents() {
    try {
        const componentsPath = path.resolve(__dirname, "..", "components");
        console.log(`🚀 Iniciando generación de componentes en: ${componentsPath}\n`);

        await processDirectory(componentsPath);

        console.log("\n🎉 Proceso completado!");
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

generateComponents();