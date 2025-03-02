// scripts/inject-preload.js
import fs from "fs/promises";
import path from "path";

async function injectPreload() {
  const htmlPath = path.resolve("dist/index.html");
  const cssFiles = await fs.readdir("dist/assets");
  const cssFile = cssFiles.find(
    (file) => file.startsWith("index-") && file.endsWith(".css")
  );
  if (!cssFile) return;

  const html = await fs.readFile(htmlPath, "utf-8");
  const preloadTag = `<link rel="preload" href="/assets/${cssFile}" as="style" onload="this.rel='stylesheet'">\n  `;
  const updatedHtml = html.replace("</head>", `${preloadTag}</head>`);
  await fs.writeFile(htmlPath, updatedHtml, "utf-8");
  console.log("Preload tag injected for", cssFile);
}

injectPreload();
