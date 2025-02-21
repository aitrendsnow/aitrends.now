// subset-fonts.js
import Fontmin from "fontmin";
import fs from "fs";
import { glob } from "glob";
import GlyphHanger from "glyphhanger"; // Import glyphhanger
import ttf2woff2 from "ttf2woff2"; // Import ttf2woff2

function extractTextFromFiles(filePaths) {
  let allText = "";
  filePaths.forEach((filePath) => {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      // Basic text extraction (improve based on your file types)
      allText += content.replace(/<[^>]*>/g, " ").replace(/\{[^}]*\}/g, " "); // Remove HTML tags and React expressions
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
    }
  });
  return allText;
}

const filesToAnalyze = glob.sync("./src/**/*.{html,tsx,jsx,ts,js}"); // Adjust paths
const text = extractTextFromFiles(filesToAnalyze);

// Use glyphhanger to get the glyphs
new GlyphHanger({ text: text }, function (glyphs) {
  const fontmin = new Fontmin()
    .src("./src/assets/fonts/GoogleSans-Regular.woff2") // Path to your original font
    .dest("./src/assets/fonts/subsetted") // Output directory for the subsetted font
    .use(Fontmin.glyphhanger({ text: glyphs })) //  Pass glyphs
    .use(ttf2woff2({ clone: true })); // Use ttf2woff2 directly

  fontmin.run(function (err, files) {
    if (err) {
      console.error("Fontmin error:", err);
    } else {
      console.log("Fonts subsetted successfully!");
    }
  });
});
