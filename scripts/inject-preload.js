// scripts/inject-preload.js
import fs from "fs/promises";
import path from "path";

async function injectPreload() {
  const htmlPath = path.resolve("dist/index.html");
  const assetsDir = "dist/assets";
  const cssFiles = await fs.readdir(assetsDir);
  const cssFile = cssFiles.find(
    (file) => file.startsWith("index-") && file.endsWith(".css")
  );
  const fontFile = cssFiles.find(
    (file) => file.startsWith("GoogleSans-Bold-") && file.endsWith(".woff2")
  );

  let html = await fs.readFile(htmlPath, "utf-8");
  if (cssFile) {
    const cssPreloadTag = `<link rel="preload" href="/assets/${cssFile}" as="style" onload="this.rel='stylesheet'">\n  `;
    html = html.replace("</head>", `${cssPreloadTag}</head>`);
    console.log("CSS preload tag injected for", cssFile);
  }
  if (fontFile) {
    const fontPreloadTag = `<link rel="preload" href="/assets/${fontFile}" as="font" type="font/woff2" crossorigin>\n  `;
    html = html.replace("</head>", `${fontPreloadTag}</head>`);
    console.log("Font preload tag injected for", fontFile);
  }
  await fs.writeFile(htmlPath, html, "utf-8");
}

injectPreload();
