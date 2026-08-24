#!/usr/bin/env node

/**
 * Falla el build si alguna imagen de WordPress quedó servida cruda.
 *
 * WordPress responde `x-robots-tag: noindex, nofollow, noarchive` en cada archivo de
 * /wp-content/uploads/. Por eso todas las imágenes tienen que pasar por el optimizador
 * de Next (src/lib/wp-media.ts), que las re-emite desde el dominio público sin ese
 * header. Ver la entrada "Multimedia Issues" en la bitácora.
 *
 * El problema es que hay dos caminos y sólo uno se defiende solo:
 *
 *   - rewriteHtmlImages() está aplicado dentro de wp.ts, en los getters que devuelven
 *     `content`. El HTML del cuerpo de los posts queda cubierto sin que nadie se acuerde.
 *
 *   - Los ~35 <img> de componentes dependen de que quien los escriba llame a
 *     optimizedUrl(). Eso es una convención: no rompe nada al escribirla mal, rompe
 *     meses después, en silencio, cuando alguien carga el dato que faltaba.
 *
 * Este script cierra ese segundo hueco. Corre en postbuild sobre el HTML ya generado,
 * que es la única fuente de verdad: da igual por qué componente pasó la imagen.
 *
 * Uso:
 *   node scripts/check-wp-image-leaks.js [directorio]   (default: .next/server/app)
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.argv[2] || path.join(".next", "server", "app");

// Sólo atributos que el browser usa para pedir la imagen. Deliberadamente NO se mira el
// resto del HTML: el payload RSC serializa las props de los componentes, así que ahí la
// URL cruda aparece siempre y no significa nada — lo que importa es qué termina pidiendo
// el browser. Las URLs ya optimizadas llevan la de WP percent-encodeada
// (%2Fwp-content%2Fuploads%2F), así que no matchean este patrón.
const LEAK = /(?:src|srcset)="[^"]*?\/wp-content\/uploads\/[^"]*"/gi;

function walk(dir) {
    let out = [];
    let entries;
    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
        return out;
    }
    for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) out = out.concat(walk(full));
        else if (e.name.endsWith(".html")) out.push(full);
    }
    return out;
}

const files = walk(ROOT);

if (files.length === 0) {
    console.error(`\n✖ No se encontró HTML generado en ${ROOT}.`);
    console.error("  Este script corre después de next build. Si el build no generó");
    console.error("  páginas estáticas, revisá el build antes que esto.\n");
    process.exit(1);
}

const leaks = [];
for (const file of files) {
    const html = fs.readFileSync(file, "utf8");
    for (const match of html.match(LEAK) || []) {
        leaks.push({ page: path.relative(ROOT, file).replace(/\.html$/, ""), attr: match });
    }
}

if (leaks.length === 0) {
    console.log(`✓ Imágenes de WordPress: ${files.length} páginas revisadas, ninguna sirve URLs crudas.`);
    process.exit(0);
}

console.error(`\n✖ ${leaks.length} imagen(es) de WordPress servidas sin pasar por el optimizador.`);
console.error("  Se sirven desde el WordPress headless, que responde x-robots-tag: noindex,");
console.error("  así que Google no puede indexarlas y la atribución se la lleva un tercero.\n");

const porPagina = new Map();
for (const l of leaks) {
    if (!porPagina.has(l.page)) porPagina.set(l.page, []);
    porPagina.get(l.page).push(l.attr);
}
for (const [page, attrs] of porPagina) {
    console.error(`  /${page}`);
    for (const a of attrs.slice(0, 3)) console.error(`      ${a.slice(0, 150)}`);
    if (attrs.length > 3) console.error(`      … y ${attrs.length - 3} más`);
}

console.error("\n  Cómo se arregla: envolvé el src con optimizedUrl() de @/lib/wp-media,");
console.error("  con el ancho al que se renderiza la imagen. Para og:image, twitter:image");
console.error("  y JSON-LD usá absoluteOptimizedUrl(), que devuelve la URL absoluta.\n");

process.exit(1);
