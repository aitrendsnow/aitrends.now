const fs = require("fs");
const path = require("path");

const distCssPath = path.join(__dirname, "../dist/assets/css");

// Read all built CSS files and replace incorrect font paths
fs.readdirSync(distCssPath).forEach((file) => {
  if (file.endsWith(".css")) {
    const filePath = path.join(distCssPath, file);
    let cssContent = fs.readFileSync(filePath, "utf8");

    // Find the correct hashed font file from dist/assets/fonts/
    const fontsPath = path.join(__dirname, "../dist/assets/fonts/");
    const fontFiles = fs.readdirSync(fontsPath);
    const googleSansRegular = fontFiles.find(
      (f) => f.startsWith("GoogleSans-Regular") && f.endsWith(".woff2")
    );

    if (googleSansRegular) {
      cssContent = cssContent.replace(
        /url\(\"\.\/assets\/fonts\/GoogleSans-Regular\.woff2\"\)/g,
        `url("./assets/fonts/${googleSansRegular}")`
      );

      fs.writeFileSync(filePath, cssContent, "utf8");
      console.log(`✅ Fixed GoogleSans-Regular reference in ${file}`);
    } else {
      console.warn("⚠️ No GoogleSans-Regular font found in dist/assets/fonts/");
    }
  }
});
