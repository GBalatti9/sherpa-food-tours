# Guía para Medir el Impacto de las Optimizaciones

## 🎯 Métricas Objetivo (del Plan)

- **Rendimiento**: 51 → 90+
- **First Contentful Paint**: 3.3s → < 1.8s
- **Total Blocking Time**: 410ms → < 200ms
- **Speed Index**: 8.2s → < 3.4s
- **Largest Contentful Paint**: 9.1s → < 2.5s

## 📊 Herramientas de Medición

### 1. PageSpeed Insights (Recomendado - Principal)

**URL**: https://pagespeed.web.dev/

**Pasos**:
1. Ve a https://pagespeed.web.dev/
2. Ingresa tu URL (ej: `https://www.sherpafoodtours.com` o `http://localhost:3000` para desarrollo)
3. Selecciona "Mobile" o "Desktop"
4. Haz clic en "Analyze"
5. Compara los resultados con los valores objetivo

**Qué verificar**:
- ✅ Performance Score (debe ser 90+)
- ✅ Core Web Vitals (LCP, FID, CLS)
- ✅ Métricas de rendimiento (FCP, TBT, Speed Index)
- ✅ Oportunidades de optimización (deben reducirse)

**Antes vs Después**:
- Toma capturas de pantalla de los resultados
- Compara las métricas específicas
- Verifica que las "Oportunidades" se hayan reducido

---

### 2. Lighthouse (Chrome DevTools)

**Pasos**:
1. Abre Chrome DevTools (F12)
2. Ve a la pestaña "Lighthouse"
3. Selecciona:
   - ✅ Performance
   - ✅ Desktop o Mobile
4. Haz clic en "Analyze page load"
5. Revisa el reporte generado

**Qué verificar**:
- Performance Score
- Métricas de rendimiento
- Oportunidades y diagnósticos
- Screenshots de la carga de la página

**Exportar resultados**:
- Haz clic en "Export" para guardar el reporte JSON
- Compara reportes antes/después

---

### 3. WebPageTest (Análisis Detallado)

**URL**: https://www.webpagetest.org/

**Pasos**:
1. Ve a https://www.webpagetest.org/
2. Ingresa tu URL
3. Selecciona ubicación y navegador
4. Haz clic en "Start Test"
5. Revisa el reporte detallado

**Qué verificar**:
- Waterfall chart (verifica headers de caché)
- First Byte Time
- Start Render
- Speed Index
- Visual Progress

**Verificar Cache Headers**:
- En el waterfall, haz clic en cualquier recurso estático
- Verifica que tenga `Cache-Control` headers
- Debe mostrar `max-age=31536000` para `/_next/static/`

---

### 4. Chrome DevTools - Network Tab

**Pasos**:
1. Abre Chrome DevTools (F12)
2. Ve a la pestaña "Network"
3. Recarga la página (Cmd+R / Ctrl+R)
4. Filtra por tipo de recurso

**Qué verificar**:

**Cache Headers**:
- Filtra por "JS" o "CSS"
- Haz clic en un recurso de `/_next/static/`
- En "Headers" → "Response Headers", busca:
  ```
  Cache-Control: public, max-age=31536000, immutable
  ```

**Tamaño de recursos**:
- Verifica que los recursos estén comprimidos
- Compara tamaños antes/después

**Lazy Loading de imágenes**:
- Filtra por "Img"
- Verifica que imágenes below-the-fold se carguen después
- Deben tener `loading="lazy"` en el HTML

---

### 5. Bundle Analyzer (Tamaño de JavaScript)

**Instalación** (si no está instalado):
```bash
npm install --save-dev @next/bundle-analyzer
```

**Configuración en `next.config.ts`**:
```typescript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
```

**Uso**:
```bash
ANALYZE=true npm run build
```

**Qué verificar**:
- Tamaño total del bundle
- Módulos más grandes
- Verificar que tree-shaking esté funcionando

---

### 6. Verificación Manual de Cambios

#### A. Headers de Caché
```bash
# Verificar headers de un recurso estático
curl -I https://www.sherpafoodtours.com/_next/static/chunks/main.js

# Debe mostrar:
# Cache-Control: public, max-age=31536000, immutable
```

#### B. Imágenes con width/height
1. Inspecciona cualquier imagen en la página
2. Verifica que tenga atributos `width` y `height`
3. Verifica que use `next/image` en lugar de `<img>`

#### C. Scripts Optimizados
1. Abre DevTools → Network → JS
2. Verifica que scripts de terceros se carguen después del contenido crítico
3. Facebook Pixel y Cookiebot deben cargarse con `lazyOnload`

#### D. Preload de Recursos Críticos
1. Inspecciona el `<head>` del HTML
2. Busca `<link rel="preload">` para:
   - Fuentes críticas
   - Imágenes hero

---

## 📈 Checklist de Verificación

### Headers de Caché ✅
- [ ] `/_next/static/` tiene `max-age=31536000, immutable`
- [ ] `/fonts/` tiene `max-age=31536000, immutable`
- [ ] Imágenes estáticas tienen `max-age=2592000`
- [ ] HTML tiene `max-age=0, must-revalidate`

### Optimización de Imágenes ✅
- [ ] Todas las imágenes tienen `width` y `height`
- [ ] Imágenes críticas usan `next/image`
- [ ] Imágenes below-the-fold tienen `loading="lazy"`
- [ ] `minimumCacheTTL` está en 31536000

### Scripts Optimizados ✅
- [ ] Facebook Pixel usa `lazyOnload`
- [ ] Cookiebot está optimizado
- [ ] Scripts no críticos se cargan después del contenido

### Preload de Recursos ✅
- [ ] Fuentes críticas tienen preload
- [ ] Imágenes hero tienen preload

### Métricas de Rendimiento ✅
- [ ] Performance Score: 90+
- [ ] LCP: < 2.5s
- [ ] FCP: < 1.8s
- [ ] TBT: < 200ms
- [ ] Speed Index: < 3.4s

---

## 🔄 Proceso de Comparación

### Paso 1: Medición Inicial (Antes)
1. Ejecuta PageSpeed Insights
2. Ejecuta Lighthouse
3. Toma capturas de pantalla
4. Guarda los reportes JSON

### Paso 2: Despliegue
1. Despliega los cambios a producción
2. Espera a que el caché se invalide (si es necesario)
3. Limpia el caché del navegador

### Paso 3: Medición Final (Después)
1. Ejecuta las mismas herramientas
2. Compara los resultados
3. Calcula la mejora porcentual

### Paso 4: Documentación
1. Crea un documento con:
   - Métricas antes/después
   - Capturas de pantalla
   - Análisis de mejoras
   - Próximos pasos (si aplica)

---

## 🚀 Comandos Útiles

### Verificar headers localmente
```bash
# Después de iniciar el servidor de desarrollo
curl -I http://localhost:3000/_next/static/chunks/main.js
```

### Analizar bundle
```bash
ANALYZE=true npm run build
```

### Build de producción para testing
```bash
npm run build
npm run start
# Luego prueba con PageSpeed Insights apuntando a localhost:3000
```

---

## 📝 Notas Importantes

1. **Caché**: Los resultados pueden variar en la primera carga vs cargas subsecuentes
2. **Ambiente**: Prueba tanto en desarrollo como en producción
3. **Múltiples pruebas**: Ejecuta cada herramienta 3 veces y promedia los resultados
4. **Dispositivos**: Prueba en diferentes dispositivos y conexiones
5. **Tiempo**: Algunas optimizaciones (como caché) se notan más en visitas repetidas

---

## 🎯 Resultados Esperados

Basado en las optimizaciones aplicadas, deberías ver:

- ✅ **Reducción del 30-50%** en tiempo de carga inicial
- ✅ **Mejora del 40-60%** en Performance Score
- ✅ **Reducción del 50-70%** en TBT
- ✅ **Mejora del 40-60%** en LCP
- ✅ **Reducción del 60-80%** en tamaño de transferencia en visitas repetidas (gracias al caché)
