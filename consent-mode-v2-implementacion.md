# Implementacion de Google Consent Mode v2

## Que se hizo

Se actualizo la integracion de analitica para que **GA4 cargue siempre** y funcione con **Google Consent Mode v2** junto con **Cookiebot**.

Antes, Cookiebot bloqueaba por completo los scripts de Google Analytics hasta que el usuario aceptaba cookies de estadistica. Eso generaba este comportamiento:

- Si el usuario rechazaba cookies, GA4 no cargaba nunca.
- Si el usuario ignoraba el banner, GA4 no cargaba nunca.
- Si el usuario aceptaba tarde, se perdia parte de la sesion.

Ahora el flujo funciona distinto:

1. Se define un consentimiento inicial restringido antes de cargar Google.
2. GA4 se carga siempre, incluso si el usuario todavia no interactuo con el banner.
3. Mientras no haya consentimiento, Google opera en modo restringido y sin cookies de analitica.
4. Cuando Cookiebot informa la decision del usuario, se actualiza el estado de consentimiento en Google.
5. Si el usuario acepta estadistica, GA4 pasa a medicion completa.
6. Si el usuario no acepta, Google puede usar modelado de conversiones y comportamiento agregado segun Consent Mode.

## Cambios tecnicos aplicados

### 1. Consentimiento por defecto antes de cargar GA4

En `src/app/layout.tsx` se agrego un script `consent-default` con `strategy="beforeInteractive"` para definir el estado inicial:

- `analytics_storage: denied`
- `ad_storage: denied`
- `ad_user_data: denied`
- `ad_personalization: denied`
- `functionality_storage: denied`
- `personalization_storage: denied`
- `security_storage: granted`

Tambien se activo:

- `wait_for_update: 500`
- `ads_data_redaction: true`

Esto hace que Google reciba un estado de consentimiento valido antes de inicializar la medicion.

### 2. GA4 deja de estar bloqueado por Cookiebot

Los scripts de GA4 ya no usan:

- `type="text/plain"`
- `data-cookieconsent="statistics"`

En su lugar, cargan normalmente y se marcan con:

- `data-cookieconsent="ignore"`

Esto evita que Cookiebot los bloquee con `data-blockingmode="auto"`.

### 3. Actualizacion del consentimiento cuando el usuario decide

Se agrego un script `consent-update` que escucha estos eventos de Cookiebot:

- `CookiebotOnConsentReady`
- `CookiebotOnAccept`
- `CookiebotOnDecline`

Cada vez que ocurre uno de esos eventos, se sincroniza el estado de Cookiebot con Google:

- `statistics` -> `analytics_storage`
- `marketing` -> `ad_storage`, `ad_user_data`, `ad_personalization`
- `preferences` -> `functionality_storage`, `personalization_storage`

### 4. Pageviews en navegacion SPA

En `src/ui/components/marketing-scripts.tsx` se ajusto el tracking de cambios de ruta para que:

- siga reportando navegacion interna en el sitio,
- no dependa de que el usuario haya aceptado estadistica para disparar el evento,
- y evite duplicar el primer pageview inicial.

Con esto, el control de que se envia o no se delega a Consent Mode, que es el comportamiento correcto.

## Que mejora esto

### 1. Mejora la cobertura de medicion

Antes solo se media a usuarios que aceptaban cookies de estadistica y lo hacian antes de que el script fuera bloqueado.

Ahora GA4 siempre carga, por lo que Google puede:

- medir completamente a quienes aceptan,
- y estimar mejor sesiones y conversiones para quienes no aceptan usando modelado.

Esto normalmente reduce la brecha entre:

- clicks en Google Ads,
- sesiones en GA4,
- conversiones atribuidas.

### 2. Reduce perdida de datos por banners no interactuados

Muchos usuarios no aceptan ni rechazan inmediatamente. Con el esquema anterior, esos usuarios no quedaban medidos en absoluto.

Con Consent Mode v2, Google igual recibe señales restringidas y puede modelar parte de ese trafico.

### 3. Mantiene cumplimiento de privacidad

El cambio no implica empezar a poner cookies sin permiso. Al contrario:

- por defecto el almacenamiento de analitica y ads queda denegado,
- solo se habilita si Cookiebot informa consentimiento,
- y mientras tanto Google opera en modo restringido.

Esto es consistente con una implementacion GDPR-compliant de Consent Mode v2.

### 4. Mejora la calidad de atribucion para Ads

Consent Mode v2 es especialmente relevante para el ecosistema de Google Ads porque mejora:

- modelado de conversiones,
- observabilidad de trafico no consentido,
- y consistencia entre campañas, sesiones y resultados.

## Archivos modificados

- `src/app/layout.tsx`
- `src/ui/components/marketing-scripts.tsx`

## Validaciones recomendadas

### Caso 1: usuario rechaza cookies

Verificar que:

- `gtag.js` carga igual,
- no se crea la cookie `_ga`,
- el consentimiento queda en `denied`,
- y Google opera en modo restringido.

### Caso 2: usuario acepta cookies de estadistica

Verificar que:

- el consentimiento cambia a `analytics_storage: granted`,
- GA4 puede usar cookies,
- aparecen eventos en DebugView,
- y la navegacion interna sigue enviando pageviews.

### Caso 3: usuario navega varias paginas

Verificar que:

- los cambios de ruta en Next.js siguen reportando `page_path`,
- no hay duplicacion del primer pageview,
- y no se corta la medicion entre paginas.

## Beneficio esperado de negocio

El principal beneficio esperado es una **medicion bastante mas completa** sin romper cumplimiento de consentimiento.

En terminos practicos, esto deberia ayudar a:

- ver mas sesiones reales en GA4,
- mejorar la lectura del rendimiento de Google Ads,
- reducir subatribucion de conversiones,
- y tomar decisiones con datos menos incompletos.

## Referencias oficiales

- Google: https://developers.google.com/tag-platform/security/guides/consent
- Cookiebot: https://support.cookiebot.com/hc/en-us/articles/12756353963292-About-Google-consent-mode
- Cookiebot: https://support.cookiebot.com/hc/en-us/articles/360009063660-Disable-automatic-cookie-blocking-for-a-specific-script
