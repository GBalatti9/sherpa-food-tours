import he from "he";

export function cleanExcerpt(text: string, maxLength = 160): string {
  // 1. Remover etiquetas HTML
  let clean = text.replace(/<[^>]+>/g, "").trim();

  // 2. Decodificar entidades HTML (&nbsp;, &#8217;, etc.)
  clean = he.decode(clean);

  // 3. Limitar longitud sin cortar palabras
  if (clean.length > maxLength) {
    clean = clean.slice(0, clean.lastIndexOf(" ", maxLength)) + "...";
  }

  return clean;
}
