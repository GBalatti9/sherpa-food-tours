export function slugify(text: string) {
    if (!text) return "";
    
    return text
        .toLowerCase()                 // minusculas
        .replace(/\s+/g, "-")          // espacios → guiones
        .replace(/[^\w-]+/g, "");      // eliminar caracteres no alfanuméricos
}