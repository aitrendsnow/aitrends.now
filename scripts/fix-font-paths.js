import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distCssPath = path.join(__dirname, "../dist/assets/css");
const fontsPath = path.join(__dirname, "../dist/assets/fonts/");

async function fixFontPaths() {
  try {
    const fontFiles = await readdir(fontsPath);
    const fontMap = {};

    fontFiles.forEach((f) => {
      const match = f.match(/(.+?)\.[a-z0-9]+\.(woff2|woff)/);
      if (match) {
        fontMap[match[1]] = f;
      }
    });

    console.log("Font Map:", fontMap);

    const cssFiles = await readdir(distCssPath);
    for (const file of cssFiles) {
      if (file.endsWith(".css")) {
        const filePath = path.join(distCssPath, file);
        let cssContent = await readFile(filePath, "utf8");

        Object.entries(fontMap).forEach(([originalName, hashedName]) => {
          const regex = new RegExp(
            `url\\(\\s*["']?\\.\\/assets\\/fonts\\/${originalName}\\.(woff2|woff)["']?\\s*\\)`,
            "g"
          );
          cssContent = cssContent.replace(regex, `url(./${hashedName})`);
        });

        await writeFile(filePath, cssContent, "utf8");
        console.log(`✅ Fixed font paths in ${file}`);
      }
    }
  } catch (error) {
    console.error("❌ Error fixing font paths:", error);
  }
}

fixFontPaths();
