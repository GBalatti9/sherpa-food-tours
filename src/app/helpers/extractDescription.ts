import he from "he";

export function extractDescription(html: string) {
  // 1. Quitar etiquetas HTML
  const text = html.replace(/<[^>]*>/g, " ");
  // 2. Decodificar entidades tipo &nbsp;, &#8217;, etc.
  const decoded = he.decode(text);
  // 3. Normalizar espacios y cortar a 160 chars
  return decoded.replace(/\s+/g, " ").trim().slice(0, 160);
}