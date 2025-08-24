export function slugify(text: string) {
    return text
        .toLowerCase()                 // minusculas
        .replace(/\s+/g, "-")          // espacios → guiones
        .replace(/[^\w-]+/g, "");      // eliminar caracteres no alfanuméricos
}