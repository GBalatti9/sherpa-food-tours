# Fix: Unificación de propiedad GA4

## Contexto del problema

El sitio usa **dos propiedades GA4 distintas**:

| Dónde | GA4 ID |
|---|---|
| Scripts del sitio Sherpa (`layout.tsx`) | `G-F4ECJKFD9Z` |
| Parámetro `ga4t` en links de FareHarbor | `G-KJV962ZQ3V` |

Resultado: las sesiones en páginas de Sherpa van a una propiedad, y el flujo de booking en FareHarbor va a otra. Si Google Ads está vinculado solo a una de las dos, la otra queda invisible.

---

## Paso 0 — Verificar cuál propiedad GA4 está vinculada a Google Ads

Antes de tocar código, confirmar cuál de los dos IDs es el "oficial":

1. Entrar a **Google Ads** → engranaje (Configuración) → **Cuentas vinculadas** → Google Analytics 4
2. Ver cuál propiedad GA4 aparece vinculada
3. También verificar en **Google Analytics** → Admin → Propiedad → cuál tiene los datos históricos reales del sitio

Con ese dato, determinar el escenario:

- **Escenario A:** `G-F4ECJKFD9Z` es la propiedad correcta → hay que reemplazar `G-KJV962ZQ3V` en los links de FareHarbor
- **Escenario B:** `G-KJV962ZQ3V` es la propiedad correcta → hay que actualizar `NEXT_PUBLIC_GA_ID` en `.env.local` y reemplazar `G-F4ECJKFD9Z` en los scripts del sitio

> En la mayoría de los casos el **Escenario A** es el correcto (el sitio usa `G-F4ECJKFD9Z` desde el principio), pero esto debe confirmarse antes de proceder.

---

## Paso 1 — Actualizar `.env.local`

El archivo `.env.local` tiene dos valores a revisar:

```
NEXT_PUBLIC_GA_ID=G-F4ECJKFD9Z
NEXT_PUBLIC_DEFAULT_FAREHARBOR_LINK=https://fareharbor.com/embeds/book/sherpafoodtours_argentina/?flow=1413860&ga4t=G-KJV962ZQ3V,...
```

**Si Escenario A** (se queda con `G-F4ECJKFD9Z`):

Reemplazar en `NEXT_PUBLIC_DEFAULT_FAREHARBOR_LINK` el valor `G-KJV962ZQ3V` por `G-F4ECJKFD9Z`:

```
NEXT_PUBLIC_DEFAULT_FAREHARBOR_LINK=https://fareharbor.com/embeds/book/sherpafoodtours_argentina/?flow=1413860&ga4t=G-F4ECJKFD9Z,1083513053.1749557566__1758810037;AW-16551382136,undefined__undefined;&language=en-us&full-items=yes&back=https://www.sherpafoodtours.com/&g4=yes
```

**Si Escenario B** (se queda con `G-KJV962ZQ3V`):

```
NEXT_PUBLIC_GA_ID=G-KJV962ZQ3V
NEXT_PUBLIC_DEFAULT_FAREHARBOR_LINK=https://fareharbor.com/embeds/book/sherpafoodtours_argentina/?flow=1413860&ga4t=G-KJV962ZQ3V,...  (sin cambios)
```

---

## Paso 2 — Actualizar `src/ui/components/book-now.tsx`

**Archivo:** `src/ui/components/book-now.tsx`

Este componente tiene la URL hardcodeada en una constante. Reemplazar el ID en la constante para usar el mismo valor que `NEXT_PUBLIC_GA_ID`:

**Antes:**
```typescript
const FAREHARBOR_BOOK_URL =
  "https://fareharbor.com/embeds/book/sherpafoodtours_argentina/?flow=1413860&ga4t=G-KJV962ZQ3V,1083513053.1749557566__1758810037;AW-16551382136,undefined__undefined;&language=en-us&full-items=yes&back=https://www.sherpafoodtours.com/&g4=yes";
```

**Después (Escenario A):**
```typescript
const FAREHARBOR_BOOK_URL =
  "https://fareharbor.com/embeds/book/sherpafoodtours_argentina/?flow=1413860&ga4t=G-F4ECJKFD9Z,1083513053.1749557566__1758810037;AW-16551382136,undefined__undefined;&language=en-us&full-items=yes&back=https://www.sherpafoodtours.com/&g4=yes";
```

> Alternativa más robusta: usar la variable de entorno directamente:
> ```typescript
> const FAREHARBOR_BOOK_URL =
>   `https://fareharbor.com/embeds/book/sherpafoodtours_argentina/?flow=1413860&ga4t=${process.env.NEXT_PUBLIC_GA_ID},1083513053.1749557566__1758810037;AW-16551382136,undefined__undefined;&language=en-us&full-items=yes&back=https://www.sherpafoodtours.com/&g4=yes`;
> ```
> Con esta variante, si en el futuro cambia el GA4 ID, solo hay que actualizar `.env.local`.

---

## Paso 3 — Actualizar `src/ui/components/redy-next-adventure.tsx`

**Archivo:** `src/ui/components/redy-next-adventure.tsx`

Mismo problema: URL hardcodeada con el ID incorrecto.

**Antes (línea 11):**
```tsx
<BookNowButton link="https://fareharbor.com/embeds/book/sherpafoodtours_argentina/?flow=1413860&ga4t=G-KJV962ZQ3V,1083513053.1749557566__1758810037;AW-16551382136,undefined__undefined;&language=en-us&full-items=yes&back=https://www.sherpafoodtours.com/&g4=yes" />
```

**Después (Escenario A):** Reemplazar `G-KJV962ZQ3V` por `G-F4ECJKFD9Z` en el link.

> Alternativa más limpia: en lugar de hardcodear la URL aquí, usar la env var:
> ```tsx
> <BookNowButton link={process.env.NEXT_PUBLIC_DEFAULT_FAREHARBOR_LINK} />
> ```
> Así solo hay un lugar donde se define la URL de FareHarbor (`.env.local`), y este componente simplemente la consume.

---

## Paso 4 — Verificar el navbar (ya usa la env var, no necesita cambio de código)

**Archivo:** `src/ui/components/nav-bar.tsx`

Este componente ya usa correctamente la variable de entorno:
```tsx
<BookNowButton link={fareharborLink ?? process.env.NEXT_PUBLIC_DEFAULT_FAREHARBOR_LINK} />
```

No requiere cambio en el código, solo depende de que `.env.local` esté correcto (Paso 1).

---

## Resumen de archivos a modificar

| Archivo | Tipo de cambio |
|---|---|
| `.env.local` | Actualizar el GA4 ID en `NEXT_PUBLIC_DEFAULT_FAREHARBOR_LINK` |
| `src/ui/components/book-now.tsx` | Reemplazar `G-KJV962ZQ3V` en la constante `FAREHARBOR_BOOK_URL` |
| `src/ui/components/redy-next-adventure.tsx` | Reemplazar `G-KJV962ZQ3V` en el prop `link` |

---

## Paso 5 — Verificación post-cambio

1. Hacer deploy del sitio
2. Abrir el sitio en el browser y aceptar cookies
3. Abrir **GA4 DebugView** (`Admin → DebugView`) en la propiedad que quedó como oficial
4. Navegar por el sitio Y hacer click en Book Now
5. Verificar que:
   - Las páginas de Sherpa (ciudades, tours, home) aparecen en DebugView
   - El evento de booking en FareHarbor también aparece en DebugView
   - Ambos flujos aparecen **en la misma propiedad**
6. En Google Ads, confirmar que los clicks aterrizan en sesiones visibles en esa misma propiedad

---

---

---

# Problema 2 — Cookiebot bloquea GA4 (sesiones no trackeadas)

## Contexto

Los scripts de GA4 en `layout.tsx` tienen estos atributos:

```html
type="text/plain"
data-cookieconsent="statistics"
```

Cookiebot con `data-blockingmode="auto"` los neutraliza y los convierte en scripts inertes hasta que el usuario acepta cookies de estadísticas. Si el usuario rechaza, ignora el banner o simplemente no interactúa con él, **GA4 nunca se ejecuta**. Eso explica la diferencia entre 5.000 clicks y 1.500 sesiones.

## Solución: implementar Google Consent Mode v2

Con Consent Mode v2, GA4 carga siempre pero en modo "sin cookies" por defecto. Solo cuando el usuario acepta, GA4 activa la recolección completa. Para los usuarios que no aceptan, Google usa datos modelados para estimar conversiones sin exponer datos personales. Es GDPR-compliant.

### Paso A — Agregar el script de inicialización de consent en `layout.tsx`

Agregar **antes** de los scripts de GA4 actuales (y antes del script de Cookiebot), un nuevo `<Script>` que inicialice los defaults de consent:

```tsx
<Script
  id="consent-default"
  strategy="beforeInteractive"
>
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500
    });
  `}
</Script>
```

Este script debe ejecutarse **antes** de que cargue GA4. La estrategia `beforeInteractive` garantiza eso.

### Paso B — Quitar el bloqueo de Cookiebot a los scripts de GA4 en `layout.tsx`

Actualmente los scripts de GA4 tienen `type="text/plain"` y `data-cookieconsent="statistics"` para que Cookiebot los bloquee. Con Consent Mode v2 ya no es necesario bloquearlos — el consent default se encarga de eso.

**Antes (script ga-loader):**
```tsx
<Script
  id="ga-loader"
  type="text/plain"
  data-cookieconsent="statistics"
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
/>
```

**Después:**
```tsx
<Script
  id="ga-loader"
  strategy="afterInteractive"
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
/>
```

**Antes (script ga-config):**
```tsx
<Script
  id="ga-config"
  type="text/plain"
  data-cookieconsent="statistics"
>
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
      anonymize_ip: true
    });
  `}
</Script>
```

**Después:**
```tsx
<Script
  id="ga-config"
  strategy="afterInteractive"
>
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
      anonymize_ip: true
    });
  `}
</Script>
```

### Paso C — Agregar listeners de Cookiebot para actualizar consent

Agregar un tercer script en `layout.tsx` que escuche los eventos de Cookiebot y actualice el consent de GA4:

```tsx
<Script
  id="consent-update"
  strategy="afterInteractive"
>
  {`
    window.addEventListener('CookiebotOnAccept', function() {
      gtag('consent', 'update', {
        analytics_storage: window.Cookiebot.consent.statistics ? 'granted' : 'denied',
        ad_storage: window.Cookiebot.consent.marketing ? 'granted' : 'denied',
        ad_user_data: window.Cookiebot.consent.marketing ? 'granted' : 'denied',
        ad_personalization: window.Cookiebot.consent.marketing ? 'granted' : 'denied',
      });
    }, false);

    window.addEventListener('CookiebotOnDecline', function() {
      gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    }, false);
  `}
</Script>
```

### Paso D — Quitar el bloqueo de Cookiebot al Facebook Pixel en `marketing-scripts.tsx`

El Pixel de Meta tiene el mismo problema. Cambiar:

```tsx
<Script
  id="facebook-pixel"
  type="text/plain"
  data-cookieconsent="marketing"
  ...
/>
```

Por:
```tsx
<Script
  id="facebook-pixel"
  strategy="afterInteractive"
  ...
/>
```

El listener de `CookiebotOnAccept` ya controla que el Pixel solo trackee cuando hay consent de marketing — pero para que funcione, el script debe estar cargado. Con el bloqueo de Cookiebot el Pixel directamente no existe en la página.

> **Nota:** Si se quita el bloqueo de Cookiebot al Pixel, hay que asegurarse de que el código del Pixel internamente no trackee hasta que haya consent. La forma correcta es mover la inicialización del Pixel (`fbq('init', ...)` y `fbq('track', 'PageView')`) dentro del listener `CookiebotOnAccept`, no en el script estático.

### Resumen del orden final de scripts en `layout.tsx`

```
1. <Cookies />              → Cookiebot (beforeInteractive)
2. consent-default          → gtag consent defaults (beforeInteractive)
3. ga-loader                → carga gtag.js (afterInteractive)
4. ga-config                → gtag('config', ...) (afterInteractive)
5. consent-update           → listeners CookiebotOnAccept/OnDecline (afterInteractive)
```

---

---

# Problema 3 — Google Ads conversion label `undefined__undefined`

## Contexto

En todos los links de FareHarbor aparece:
```
AW-16551382136,undefined__undefined
```

El formato correcto es `AW-CONVERSION_ID/CONVERSION_LABEL`. El `undefined__undefined` indica que cuando se generó el link, el conversion label no estaba configurado correctamente. Las conversiones de booking pueden no estar llegando a Google Ads.

## Pasos para solucionarlo

### Paso A — Obtener el conversion label desde Google Ads

1. Entrar a **Google Ads** → Goals → Conversions → Summary
2. Buscar la conversión asociada a bookings de FareHarbor
3. Hacer click → ver los detalles → copiar el **Conversion label** (formato: letras y números, ej: `AbCdEfGhIjKlMnOp`)
4. El valor completo a usar en la URL será: `AW-16551382136/AbCdEfGhIjKlMnOp`

> Si no existe ninguna conversión configurada, crearla: Google Ads → Goals → New conversion action → Website → ingresar `sherpafoodtours.com` y seguir los pasos.

### Paso B — Actualizar los tres lugares donde aparece en el código

Una vez obtenido el label, reemplazar `undefined__undefined` por el label real en:

**`.env.local`** — variable `NEXT_PUBLIC_DEFAULT_FAREHARBOR_LINK`:
```
AW-16551382136,undefined__undefined   →   AW-16551382136/TU_CONVERSION_LABEL
```

**`src/ui/components/book-now.tsx`** — constante `FAREHARBOR_BOOK_URL`:
```
AW-16551382136,undefined__undefined   →   AW-16551382136/TU_CONVERSION_LABEL
```

**`src/ui/components/redy-next-adventure.tsx`** — prop `link`:
```
AW-16551382136,undefined__undefined   →   AW-16551382136/TU_CONVERSION_LABEL
```

---

---

# Problema 4 — `Analytics.tsx` es código muerto

## Contexto

El archivo `src/app/Analytics.tsx` existe y tiene lógica de pageview tracking, pero **no está importado en ningún lugar del proyecto**. Es un remanente de una implementación anterior, reemplazada por `marketing-scripts.tsx`.

## Solución

Eliminar el archivo:

```
src/app/Analytics.tsx
```

No hay ningún efecto en producción — ya no se usa. Eliminarlo evita confusión futura sobre qué componente es responsable del tracking.
