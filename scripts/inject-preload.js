import fs from "fs/promises";
import path from "path";

async function injectPreload() {
  const htmlPath = path.resolve("dist/index.html");
  const assetsFontsDir = path.resolve("dist/assets/fonts");
  const assetsWebpDir = path.resolve("dist/assets/webp");
  const assetsCssDir = path.resolve("dist/assets/css");

  const cssFiles = await fs.readdir(assetsCssDir);
  const fontFiles = await fs.readdir(assetsFontsDir);
  const imageFiles = await fs.readdir(assetsWebpDir);

  const cssFile = cssFiles.find(
    (file) => file.startsWith("index-") && file.endsWith(".css")
  );
  const fontFile = fontFiles.find(
    (file) => file.startsWith("GoogleSans-Bold-") && file.endsWith(".woff2")
  );
  const imageFile = imageFiles.find(
    (file) => file.startsWith("profile-image-") && file.endsWith(".webp")
  );

  let html = await fs.readFile(htmlPath, "utf-8");
  if (cssFile) {
    const cssPreloadTag = `<link rel="preload" href="/aitrends.now/assets/css/${cssFile}" as="style" onload="this.rel='stylesheet'">\n  `;
    html = html.replace("</head>", `${cssPreloadTag}</head>`);
    console.log("CSS preload tag injected for", cssFile);
  }
  if (fontFile) {
    const fontPreloadTag = `<link rel="preload" href="/aitrends.now/assets/fonts/${fontFile}" as="font" type="font/woff2" crossorigin>\n  `;
    html = html.replace("</head>", `${fontPreloadTag}</head>`);
    console.log("Font preload tag injected for", fontFile);
  }
  if (imageFile) {
    const imagePreloadTag = `<link rel="preload" href="/aitrends.now/assets/webp/${imageFile}" as="image">\n  `;
    html = html.replace("</head>", `${imagePreloadTag}</head>`);
    console.log("Image preload tag injected for", imageFile);
  }
  await fs.writeFile(htmlPath, html, "utf-8");
}

injectPreload();
