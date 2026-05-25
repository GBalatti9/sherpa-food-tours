# 16 Items Pendientes - Acciones Manuales

## INFRAESTRUCTURA (requiere devops/CMS)

### 1. Migrar imágenes de staging a produccion
- **Impacto:** CRITICO
- **Qué:** Todas las imágenes del sitio cargan desde `staging.sherpafoodtours.com`. Hay que moverlas a un CDN de producción o al dominio principal.
- **Dónde:** WordPress Media Library + configuración de CDN
- **Riesgo:** Si staging se cae, el sitio pierde TODAS las fotos

### 2. Fix slug de Buenos Aires (/city/buenos-aires-2/)
- **Impacto:** ALTO
- **Qué:** El slug tiene un "-2" porque WordPress creó un duplicado. Hay que renombrar el slug en WP a "buenos-aires" y actualizar el redirect en next.config.ts para invertir la dirección.
- **Dónde:** WordPress > Cities > Buenos Aires > slug

### 3. Fix slug de San Telmo Tour (/tour/san-telmo-tour-2/)
- **Impacto:** ALTO
- **Qué:** Mismo problema que Buenos Aires. Renombrar en WP.
- **Dónde:** WordPress > Tours > San Telmo > slug

---

## PLATAFORMAS EXTERNAS (requiere creación de cuentas/perfiles)

### 4. Crear Google Business Profile para las 8 ciudades
- **Impacto:** CRITICO
- **Qué:** No existe ningún perfil GBP. Es el factor #1 para aparecer en el mapa de Google. Crear uno por ciudad con categoría "Tour Operator".
- **Ciudades:** Buenos Aires, Barcelona, London (prioridad alta), luego Paris, Mexico City, Amsterdam, Lima, Cartagena
- **Tip:** Activar "Reserve with Google" a través de FareHarbor

### 5. Registrarse en Viator y GetYourGuide
- **Impacto:** ALTO
- **Qué:** Estas plataformas dominan las primeras posiciones en Google para "food tour [ciudad]". Estar listado genera backlinks de alta autoridad + revenue directo.
- **Acción:** Crear perfil de operador en ambas plataformas para las 8 ciudades

### 6. Agregar Google Maps embeds a las city pages
- **Impacto:** ALTO
- **Qué:** Ninguna página tiene un mapa embebido. Agregar un mapa mostrando el barrio del tour o el meeting point.
- **Dónde:** WordPress ACF - agregar campo de embed de mapa por ciudad

---

## CONTENIDO EDITORIAL (requiere redacción)

### 7. Publicar artículos de Barcelona (mínimo 3)
- **Impacto:** CRITICO
- **Qué:** Barcelona tiene tours activos pero CERO artículos en el Travel Guide. Google no puede considerar al sitio una autoridad en Barcelona food sin contenido.
- **Sugerencia:** 1 guía general de comida en Barcelona, 1 artículo de un plato/barrio específico, 1 artículo de mercados/restaurantes

### 8. Publicar artículos de Cartagena (mínimo 3)
- **Impacto:** CRITICO
- **Qué:** Misma situación que Barcelona. Cero contenido.
- **Sugerencia:** 1 guía de comida caribeña, 1 artículo de street food, 1 de restaurantes en la ciudad amurallada

### 9. Expandir contenido de Lima (target 5+ artículos)
- **Impacto:** ALTO
- **Qué:** Solo hay 1 artículo pero se está promoviendo Lima con 30% de descuento. La inversión en promo no tiene soporte de contenido.

### 10. Agregar FAQ blocks con respuestas directas a los top 10 artículos
- **Impacto:** ALTO
- **Qué:** Los artículos tienen buena info pero no están estructurados para que Google AI o ChatGPT puedan citarlos. Agregar bloques de pregunta/respuesta explícitos (H3 con pregunta + párrafo de 130-160 palabras con respuesta directa).

### 11. Agregar estadísticas con fuentes a los artículos
- **Impacto:** MEDIO
- **Qué:** Frases como "ranked as the world's best" no tienen link a la fuente. Los motores de AI desconfían de claims sin cita. Agregar links a TripAdvisor, UNESCO, World's 50 Best, etc.

---

## DECISIONES DE NEGOCIO (requiere definición interna)

### 12. Definir y publicar NAP visible (Name, Address, Phone)
- **Impacto:** MEDIO
- **Qué:** La página de contacto no tiene información de contacto visible. Ni teléfono, ni dirección, ni email en el footer. Para SEO local es fundamental mostrar NAP consistente.
- **Decisión:** ¿Qué dirección pública usar? ¿Teléfono real? ¿WhatsApp por ciudad?

### 13. Actualizar bio de Sofia Gonzalez con credenciales verificables
- **Impacto:** MEDIO
- **Qué:** Su bio actual dice "deep passion for food culture and storytelling" sin credenciales. Google E-E-A-T necesita: ciudades donde vivió, idiomas, publicaciones, formación.
- **Dónde:** WordPress > Users > Sofia Gonzalez > Biographical Info

### 14. Reescribir openers de secciones como respuestas directas
- **Impacto:** ALTO
- **Qué:** Los artículos empiezan con prosa evocativa ("A quasi-religious practice...") en vez de una definición directa. Para AI, la primera oración bajo cada H2 debe ser el claim principal. La narrativa va después.
- **Esto es un cambio editorial ongoing** - no un fix puntual.

### 15. Geo-targetear el marquee banner de Lima
- **Impacto:** MEDIO
- **Qué:** El banner de "30% Off Lima Tours" aparece en TODAS las páginas del sitio, incluyendo Londres y Barcelona. Debería mostrarse solo en la página de Lima y en el homepage.
- **Opciones:** (a) Agregar campo ACF para filtrar por ciudad, o (b) crear banners separados por ciudad en WP

### 16. Crear video walkthrough del tour (60-90 segundos)
- **Impacto:** MEDIO
- **Qué:** Ningún competidor en el top 10 usa video prominentemente en sus city pages. Un video corto mostrando la experiencia real diferencia enormemente.
- **Dónde:** Embeber en city pages arriba del fold
