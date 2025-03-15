import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Convert __dirname to work in ES module mode
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distCssPath = path.join(__dirname, "../dist/assets/css");
const fontsPath = path.join(__dirname, "../dist/assets/fonts/");

async function fixFontPaths() {
  try {
    // Get the correct hashed font filename
    const fontFiles = await readdir(fontsPath);
    const googleSansRegular = fontFiles.find(
      (f) => f.startsWith("GoogleSans-Regular") && f.endsWith(".woff2")
    );

    if (!googleSansRegular) {
      console.warn("⚠️ No GoogleSans-Regular font found in dist/assets/fonts/");
      return;
    }

    console.log(`🔍 Found GoogleSans-Regular: ${googleSansRegular}`);

    // Process all CSS files in dist/assets/css/
    const cssFiles = await readdir(distCssPath);
    for (const file of cssFiles) {
      if (file.endsWith(".css")) {
        const filePath = path.join(distCssPath, file);
        let cssContent = await readFile(filePath, "utf8");

        // Replace all incorrect references in CSS
        if (cssContent.includes("GoogleSans-Regular.woff2")) {
          cssContent = cssContent.replace(
            /url\(\"\.\/assets\/fonts\/GoogleSans-Regular\.woff2\"\)/g,
            `url("./assets/fonts/${googleSansRegular}")`
          );

          await writeFile(filePath, cssContent, "utf8");
          console.log(`✅ Fixed GoogleSans-Regular reference in ${file}`);
        }
      }
    }
  } catch (error) {
    console.error("❌ Error fixing font paths:", error);
  }
}

// Run the function
fixFontPaths();
