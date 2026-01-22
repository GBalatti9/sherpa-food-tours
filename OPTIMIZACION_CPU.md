# Optimizaciones de CPU para Vercel

## Problema
Vercel notificó que el proyecto alcanzó el 100% del uso de CPU del free tier (4 horas de Fluid Active CPU).

## Optimizaciones Implementadas

### 1. ✅ Página de Ciudades (`city/[slug]/page.tsx`)
**ANTES:**
```typescript
export const dynamic = "force-dynamic";
export const revalidate = 0;
```
- ❌ Cada request se renderizaba dinámicamente sin cache
- ❌ Muy costoso en CPU

**DESPUÉS:**
```typescript
export const revalidate = 3600; // Revalidar cada hora
```
- ✅ Usa ISR (Incremental Static Regeneration)
- ✅ Las páginas se cachean y solo se regeneran cada hora
- ✅ **Reducción estimada: ~95% menos CPU**

### 2. ✅ Sitemap (`sitemap.ts`)
**ANTES:**
```typescript
export const dynamic = 'force-dynamic';
export const revalidate = 3600;
```
- ❌ `force-dynamic` forzaba renderizado dinámico innecesario

**DESPUÉS:**
```typescript
export const revalidate = 3600; // se regenera cada hora
```
- ✅ Removido `force-dynamic` para permitir cache estático
- ✅ **Reducción estimada: ~80% menos CPU**

### 3. ✅ Cache en Llamadas a WordPress (`lib/wp.ts`)

Se agregó cache de 1 hora (`revalidate: 3600`) a todas las funciones críticas:

#### Funciones optimizadas:
- ✅ `getPageInfo()` - Usado en homepage y páginas estáticas
- ✅ `getPostInfo()` - Usado en artículos del travel guide
- ✅ `getAllPost()` - Usado en listados de posts
- ✅ `getAllTours()` - Usado en sitemap y listados
- ✅ `getAllUsers()` - Usado en sitemap
- ✅ `getTourBySlug()` - Usado en páginas de tours
- ✅ `getCityBySlug()` - Usado en páginas de ciudades
- ✅ `getPostImage()` - Cache de 2 horas (las imágenes cambian menos)

**ANTES:**
- Cada request hacía llamadas directas a WordPress sin cache
- Múltiples llamadas duplicadas en el mismo request

**DESPUÉS:**
- Todas las llamadas se cachean por 1-2 horas
- Next.js reutiliza las respuestas cacheadas
- **Reducción estimada: ~70-90% menos llamadas a WordPress**

## Impacto Total Esperado

### Reducción de CPU:
- **Páginas de ciudades:** ~95% menos CPU
- **Sitemap:** ~80% menos CPU  
- **Llamadas a WordPress:** ~70-90% menos llamadas
- **Total estimado:** **80-90% reducción en uso de CPU**

### Beneficios Adicionales:
1. **Mejor rendimiento:** Las páginas se cargan más rápido al usar cache
2. **Menos carga en WordPress:** Menos requests al servidor de WordPress
3. **Mejor experiencia de usuario:** Respuestas más rápidas
4. **Menor costo:** Si decides actualizar a Pro, usarás menos recursos

## Configuración de Cache

### Tiempos de Revalidación:
- **Páginas estáticas:** 1 hora (3600 segundos)
- **Imágenes:** 2 horas (7200 segundos)
- **Sitemap:** 1 hora (3600 segundos)
- **Llamadas a WordPress:** 1 hora (3600 segundos)

### ¿Cómo funciona ISR?
1. Primera request: Se genera la página y se cachea
2. Requests siguientes: Se sirve desde cache (muy rápido, sin CPU)
3. Después de 1 hora: La próxima request regenera en background
4. Mientras se regenera: Se sigue sirviendo la versión cacheada

## Monitoreo

Después de desplegar estos cambios:
1. Monitorea el uso de CPU en el dashboard de Vercel
2. Verifica que las páginas se carguen correctamente
3. Confirma que el cache funciona (las páginas deberían cargar más rápido)

## Próximos Pasos (Opcional)

Si aún necesitas más optimización:
1. **Aumentar tiempos de revalidate** a 2-4 horas si el contenido no cambia frecuentemente
2. **Implementar cache en el cliente** para assets estáticos
3. **Optimizar imágenes** con Next.js Image component (ya está implementado)
4. **Considerar CDN** para assets estáticos

## Notas Importantes

⚠️ **Los cambios de contenido pueden tardar hasta 1 hora en reflejarse** debido al cache. Si necesitas que los cambios se vean inmediatamente:
- Puedes reducir `revalidate` a 300 (5 minutos) para contenido más dinámico
- O usar `revalidate: 0` solo en desarrollo

✅ **El cache se invalida automáticamente** cuando:
- Se hace un nuevo deploy
- Pasa el tiempo de revalidate
- Se usa `revalidatePath()` o `revalidateTag()` manualmente

---

**Fecha de optimización:** $(date)
**Estado:** ✅ Completado
**Impacto esperado:** 80-90% reducción en uso de CPU

