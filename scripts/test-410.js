#!/usr/bin/env node
/**
 * Recorre TODAS las URLs de deleted-urls.json y verifica que devuelvan 410 Gone.
 * Uso: node scripts/test-410.js
 *      BASE_URL=https://www.sherpafoodtours.com node scripts/test-410.js  (producción)
 * Antes: npm run dev (para localhost)
 */

const deletedUrls = require("../deleted-urls.json");
const BASE = process.env.BASE_URL || "http://localhost:3000";

// Normaliza a path con trailing slash (el sitio usa trailingSlash: true)
function toPathWithSlash(entry) {
  const raw = typeof entry === "string" ? entry.trim() : "";
  if (!raw) return null;
  let path = raw;
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    try {
      path = new URL(raw).pathname;
    } catch {
      return null;
    }
  }
  if (!path.startsWith("/")) path = "/" + path;
  return path.endsWith("/") ? path : path + "/";
}

const pathsToTest = deletedUrls.map(toPathWithSlash).filter(Boolean);

async function testOne(path, index) {
  const url = BASE + path;
  try {
    const res = await fetch(url, { method: "GET", redirect: "manual" });
    return {
      index: index + 1,
      path,
      status: res.status,
      ok: res.status === 410,
    };
  } catch (err) {
    return {
      index: index + 1,
      path,
      status: null,
      ok: false,
      error: err.message,
    };
  }
}

async function main() {
  console.log("Verificando 410 Gone para todas las URLs en deleted-urls.json");
  console.log("Base:", BASE);
  console.log("Total:", pathsToTest.length);
  console.log("");

  const results = [];
  for (let i = 0; i < pathsToTest.length; i++) {
    const result = await testOne(pathsToTest[i], i);
    results.push(result);
    const icon = result.ok ? "✓" : "✗";
    const status = result.status ?? result.error ?? "?";
    console.log(`${String(i + 1).padStart(3)} ${icon} ${result.path} → ${status}`);
  }

  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok);

  console.log("");
  console.log("--- Resumen ---");
  console.log(`OK (410): ${passed}/${results.length}`);
  if (failed.length > 0) {
    console.log(`Fallas (${failed.length}):`);
    failed.forEach((r) => {
      console.log(`  ${r.index}. ${r.path} → ${r.status ?? r.error ?? "?"}`);
    });
  }

  process.exit(failed.length > 0 ? 1 : 0);
}

main();
