// Builds the installable web app into the repo root (what GitHub Pages serves).
//
//   src/words.js, icons.jsx, store.js, sheets.jsx, app.jsx ->  app.js        (Babel, classic JSX runtime)
//   src/input.css                               ->  styles.css    (Tailwind)
//   src/index.template.html                     ->  index.html
//   src/sw.template.js                          ->  sw.js         (versioned by a hash of every cached file)
//   node_modules/react*                         ->  vendor/
//   node_modules/@fontsource/*                  ->  fonts/
//
// Run:  npm install && npm run build

import { copyFileSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const babel = require("@babel/core");
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const at = (...p) => path.join(ROOT, ...p);
const read = (...p) => readFileSync(at(...p), "utf8");

// 1. Game code: concatenate sources, compile JSX to plain JS, wrap in an IIFE.
const source = ["src/words.js", "src/icons.jsx", "src/store.js", "src/sheets.jsx", "src/app.jsx"].map((f) => read(f)).join("\n\n");
const compiled = babel.transformSync(source, {
  presets: [[require.resolve("@babel/preset-react"), { runtime: "classic" }]],
  filename: "app.jsx",
  comments: false,
}).code;
writeFileSync(at("app.js"), `(function () {\n"use strict";\n${compiled}\n})();\n`);

// 2. Styles: Tailwind scans src/ for the classes the game actually uses.
execFileSync(
  process.execPath,
  [require.resolve("tailwindcss/lib/cli.js"), "-c", "tailwind.config.cjs", "-i", "src/input.css", "-o", "styles.css", "--minify"],
  { cwd: ROOT, stdio: ["ignore", "ignore", "inherit"] }
);

// 3. Vendored React (browser builds) and self-hosted fonts.
mkdirSync(at("vendor"), { recursive: true });
copyFileSync(at("node_modules/react/umd/react.production.min.js"), at("vendor/react.production.min.js"));
copyFileSync(at("node_modules/react-dom/umd/react-dom.production.min.js"), at("vendor/react-dom.production.min.js"));

mkdirSync(at("fonts"), { recursive: true });
const FONTS = [
  ["big-shoulders-stencil", "big-shoulders-stencil-latin-700-normal.woff2"],
  ["space-grotesk", "space-grotesk-latin-400-normal.woff2"],
  ["space-grotesk", "space-grotesk-latin-500-normal.woff2"],
  ["space-grotesk", "space-grotesk-latin-700-normal.woff2"],
];
for (const [pkg, file] of FONTS) {
  copyFileSync(at("node_modules/@fontsource", pkg, "files", file), at("fonts", file));
}

// 4. index.html
writeFileSync(at("index.html"), read("src/index.template.html"));

// 5. Service worker: precache everything, versioned by content hash so
//    any change to the app makes installed copies update themselves.
const listDir = (dir) => readdirSync(at(dir)).sort().map((f) => `${dir}/${f}`);
const ASSETS = [
  "./",
  "index.html",
  "app.js",
  "styles.css",
  "manifest.webmanifest",
  ...listDir("vendor"),
  ...listDir("fonts"),
  ...listDir("icons"),
];
const hash = createHash("sha1");
for (const a of ASSETS) {
  if (a === "./") continue;
  hash.update(a).update(readFileSync(at(a)));
}
const version = hash.digest("hex").slice(0, 10);
writeFileSync(
  at("sw.js"),
  read("src/sw.template.js").replace("__VERSION__", version).replace("__ASSETS__", JSON.stringify(ASSETS, null, 2))
);

// Summary
const kb = (f) => (statSync(at(f)).size / 1024).toFixed(1) + " KB";
console.log(`Built Cave Talk (cache version ${version})`);
for (const f of ["index.html", "app.js", "styles.css", "sw.js"]) console.log(`  ${f.padEnd(12)} ${kb(f)}`);
console.log(`  ${ASSETS.length} files precached for offline use`);
