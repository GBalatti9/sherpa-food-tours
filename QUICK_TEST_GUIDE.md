# 🚀 Guía Rápida para Probar Optimizaciones

## Método Rápido (5 minutos)

### 1. PageSpeed Insights (Recomendado)
```
1. Ve a: https://pagespeed.web.dev/
2. Ingresa tu URL: https://www.sherpafoodtours.com
3. Haz clic en "Analyze"
4. Compara el Performance Score (objetivo: 90+)
```

### 2. Script de Verificación Automática
```bash
# Para desarrollo local
npm run verify:optimizations

# Para producción
npm run verify:optimizations:prod
```

### 3. Chrome DevTools (2 minutos)
```
1. Abre la página en Chrome
2. Presiona F12 (DevTools)
3. Ve a pestaña "Lighthouse"
4. Selecciona "Performance" + "Desktop"
5. Haz clic en "Analyze page load"
```

## Método Completo (15 minutos)

Sigue la guía detallada en `TESTING_OPTIMIZATIONS.md`

## 📊 Qué Buscar

### ✅ Mejoras Esperadas:
- **Performance Score**: 51 → 90+
- **LCP**: 9.1s → < 2.5s
- **FCP**: 3.3s → < 1.8s
- **TBT**: 410ms → < 200ms

### ✅ Verificaciones Técnicas:
- Headers de caché en recursos estáticos
- Imágenes con width/height
- Scripts optimizados (lazyOnload)
- Uso de next/image

## 🎯 Resultado Esperado

Si todo está bien, deberías ver:
- ✅ Performance Score de 90+ en PageSpeed Insights
- ✅ Headers de caché correctos en DevTools → Network
- ✅ Reducción significativa en tiempo de carga
- ✅ Mejora en Core Web Vitals

