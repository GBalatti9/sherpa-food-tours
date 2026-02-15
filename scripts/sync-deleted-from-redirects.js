#!/usr/bin/env node
/**
 * Encuentra redirects en next.config.ts cuyo destination está en deleted-urls.json,
 * agrega esos source (URLs viejas) a deleted-urls.json y genera DELETED_URLS_OLD_REDIRECTS.md
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const configPath = path.join(ROOT, "next.config.ts");
const deletedPath = path.join(ROOT, "deleted-urls.json");
const mdPath = path.join(ROOT, "DELETED_URLS_OLD_REDIRECTS.md");

function normalize(p) {
  const s = (p || "").trim();
  return s.replace(/\/$/, "") || "/";
}

function ensureTrailingSlash(p) {
  const s = (p || "").trim();
  return s.endsWith("/") ? s : s + "/";
}

// 1. Cargar deleted-urls.json
const deletedList = JSON.parse(fs.readFileSync(deletedPath, "utf8"));
const deletedSet = new Set(deletedList.map(normalize));
const deletedSetWithSlash = new Set(deletedList.map((p) => normalize(p) + "/"));

// 2. Extraer redirects de next.config.ts (solo bloques no comentados)
const configText = fs.readFileSync(configPath, "utf8");
const redirects = [];
const re = /source:\s*['"]([^'"]+)['"][\s\S]*?destination:\s*['"]([^'"]+)['"]/g;
let m;
while ((m = re.exec(configText)) !== null) {
  const source = m[1].trim();
  const destination = m[2].trim();
  const pos = m.index;
  const lineStart = configText.lastIndexOf("\n", pos) + 1;
  const line = configText.slice(lineStart, lineStart + 80);
  if (/^\s*\/\//.test(line) || line.trimStart().startsWith("//")) continue;
  if (source.includes(":path*") || source.includes("*")) continue;
  redirects.push({ source, destination });
}

// 3. Quedarnos con redirects cuyo destination (normalizado) está en deleted
const oldUrlsToAdd = [];
const details = [];

for (const { source, destination } of redirects) {
  const destNorm = normalize(destination);
  if (deletedSet.has(destNorm) || deletedSetWithSlash.has(destNorm)) {
    const sourceNorm = ensureTrailingSlash(source);
    if (!deletedSet.has(normalize(source)) && !deletedList.includes(sourceNorm) && !deletedList.includes(source)) {
      oldUrlsToAdd.push(sourceNorm);
      details.push({ source: sourceNorm, destination: destination });
    }
  }
}

// Quitar duplicados
const uniqueOld = [...new Set(oldUrlsToAdd)];

// 4. Agregar a deleted-urls.json (sin duplicar)
const existingNormalized = new Set(deletedList.map(normalize));
const toAppend = uniqueOld.filter((u) => !existingNormalized.has(normalize(u)));
const newDeletedList = [...deletedList];
toAppend.forEach((u) => {
  newDeletedList.push(u);
  existingNormalized.add(normalize(u));
});

fs.writeFileSync(deletedPath, JSON.stringify(newDeletedList, null, 2) + "\n", "utf8");

// 5. Escribir DELETED_URLS_OLD_REDIRECTS.md (todas las URLs viejas que apuntan a borrados)
const allOldSources = [...new Set(details.map((d) => d.source))].sort();

let md = `# URLs viejas que redirigían a contenido borrado (410 Gone)

Estas URLs estaban en \`next.config.ts\` como \`source\` de un redirect cuyo \`destination\` está en \`deleted-urls.json\`.
Ahora están en \`deleted-urls.json\` para devolver **410 Gone** en lugar de redirigir.

**Total:** ${allOldSources.length} URLs

## Lista para trackear

| # | URL vieja (source) | Destino (destination) borrado |
|---|--------------------|-------------------------------|
`;

details.forEach((d, i) => {
  md += `| ${i + 1} | \`${d.source}\` | \`${d.destination}\` |\n`;
});

md += `
## Solo URLs viejas (una por línea)

\`\`\`
${allOldSources.join("\n")}
\`\`\`
`;

fs.writeFileSync(mdPath, md, "utf8");

console.log("Redirects que apuntan a deleted:", redirects.filter((r) => deletedSet.has(normalize(r.destination))).length);
console.log("URLs viejas agregadas a deleted-urls.json:", toAppend.length);
console.log("Total en deleted-urls.json:", newDeletedList.length);
console.log("Archivo generado:", mdPath);
