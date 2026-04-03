/**
 * Build non-module bundle for file:// use.
 * Run once (we already will run it for you):
 *   node build-vanilla.cjs
 */
const fs = require("fs");
const path = require("path");

const root = __dirname;

function stripImports(src) {
  return src
    .split(/\r?\n/)
    .filter((line) => !/^\s*import\s/.test(line))
    .join("\n");
}

function stripExports(src) {
  return src
    .replace(/export\s+function/g, "function")
    .replace(/export\s+const/g, "const")
    .replace(/export\s+class/g, "class");
}

function readMod(rel) {
  return stripExports(stripImports(fs.readFileSync(path.join(root, rel), "utf8")));
}

function patchThreeHero(src) {
  src = stripImports(src);
  src = src.replace(
    /export function mountThreeHero\(container\) \{/,
    "function mountThreeHero(container) {\n  const THREE = window.THREE;\n  if (!THREE || !container) return () => {};\n"
  );
  return src;
}

const parts = [];
parts.push("(function () {\n'use strict';\n");

// Data + core modules
parts.push(readMod("js/data/robots.js") + "\n");
parts.push(readMod("js/cart.js") + "\n");
parts.push(readMod("js/cursor.js") + "\n");
parts.push(readMod("js/starfield.js") + "\n");
parts.push(readMod("js/scroll-reveal.js") + "\n");
parts.push(readMod("js/utils/tilt.js") + "\n");
parts.push(patchThreeHero(fs.readFileSync(path.join(root, "js/three-hero.js"), "utf8")) + "\n");
parts.push(readMod("js/router.js") + "\n");

// Sections
parts.push(readMod("js/sections/home.js") + "\n");
parts.push(readMod("js/sections/showcase.js") + "\n");
parts.push(readMod("js/sections/detail.js") + "\n");
parts.push(readMod("js/sections/builder.js") + "\n");
parts.push(readMod("js/sections/shop.js") + "\n");
parts.push(readMod("js/sections/faq.js") + "\n");

// App (strip final init() so we can add it once)
let appSrc = readMod("js/app.js");
appSrc = appSrc.replace(/^\s*init\(\);\s*$/m, "");
parts.push(appSrc + "\ninit();\n");

parts.push("})();\n");

fs.writeFileSync(path.join(root, "app.bundle.js"), parts.join("\n"), "utf8");
console.log("Wrote app.bundle.js");

