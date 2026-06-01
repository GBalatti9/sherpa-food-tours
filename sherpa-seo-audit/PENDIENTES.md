# Items Pendientes - Acciones Manuales

## PLATAFORMAS EXTERNAS (requiere creación de cuentas/perfiles)

### 1. Crear Google Business Profile para las 8 ciudades
- **Impacto:** CRITICO
- **Qué:** No existe ningún perfil GBP. Es el factor #1 para aparecer en el mapa de Google. Crear uno por ciudad con categoría "Tour Operator".
- **Ciudades:** Buenos Aires, Barcelona, London (prioridad alta), luego Paris, Mexico City, Amsterdam, Lima, Cartagena
- **Tip:** Activar "Reserve with Google" a través de FareHarbor

### 2. Registrarse en Viator y GetYourGuide
- **Impacto:** ALTO
- **Qué:** Estas plataformas dominan las primeras posiciones en Google para "food tour [ciudad]". Estar listado genera backlinks de alta autoridad + revenue directo.
- **Acción:** Crear perfil de operador en ambas plataformas para las 8 ciudades

### 3. Agregar Google Maps embeds a las city pages
- **Impacto:** ALTO
- **Qué:** Ninguna página tiene un mapa embebido. Agregar un mapa mostrando el barrio del tour o el meeting point.
- **Dónde:** WordPress ACF - agregar campo de embed de mapa por ciudad

---

## CONTENIDO EDITORIAL (requiere redacción)

### 4. Publicar artículos de Barcelona (mínimo 3)
- **Impacto:** CRITICO
- **Qué:** Barcelona tiene tours activos pero CERO artículos en el Travel Guide. Google no puede considerar al sitio una autoridad en Barcelona food sin contenido.
- **Sugerencia:** 1 guía general de comida en Barcelona, 1 artículo de un plato/barrio específico, 1 artículo de mercados/restaurantes

### 5. Publicar artículos de Cartagena (mínimo 3)
- **Impacto:** CRITICO
- **Qué:** Misma situación que Barcelona. Cero contenido.
- **Sugerencia:** 1 guía de comida caribeña, 1 artículo de street food, 1 de restaurantes en la ciudad amurallada

### 6. Expandir contenido de Lima (target 5+ artículos)
- **Impacto:** ALTO
- **Qué:** Solo hay 1 artículo pero se está promoviendo Lima con 30% de descuento. La inversión en promo no tiene soporte de contenido.

### 7. Agregar FAQ blocks con respuestas directas a los top 10 artículos
- **Impacto:** ALTO
- **Qué:** Los artículos tienen buena info pero no están estructurados para que Google AI o ChatGPT puedan citarlos. Agregar bloques de pregunta/respuesta explícitos (H3 con pregunta + párrafo de 130-160 palabras con respuesta directa).

### 8. Agregar estadísticas con fuentes a los artículos
- **Impacto:** MEDIO
- **Qué:** Frases como "ranked as the world's best" no tienen link a la fuente. Los motores de AI desconfían de claims sin cita. Agregar links a TripAdvisor, UNESCO, World's 50 Best, etc.

### 9. Reescribir openers de secciones como respuestas directas
- **Impacto:** ALTO
- **Qué:** Los artículos empiezan con prosa evocativa ("A quasi-religious practice...") en vez de una definición directa. Para AI, la primera oración bajo cada H2 debe ser el claim principal. La narrativa va después.
- **Esto es un cambio editorial ongoing** - no un fix puntual.

---

## DECISIONES DE NEGOCIO (requiere definición interna)

### 10. Definir y publicar NAP visible (Name, Address, Phone)
- **Impacto:** MEDIO
- **Qué:** La página de contacto no tiene información de contacto visible. Ni teléfono, ni dirección, ni email en el footer. Para SEO local es fundamental mostrar NAP consistente.
- **Decisión:** ¿Qué dirección pública usar? ¿Teléfono real? ¿WhatsApp por ciudad?

### 11. Actualizar bio de Sofia Gonzalez con credenciales verificables
- **Impacto:** MEDIO
- **Qué:** Su bio actual dice "deep passion for food culture and storytelling" sin credenciales. Google E-E-A-T necesita: ciudades donde vivió, idiomas, publicaciones, formación.
- **Dónde:** WordPress > Users > Sofia Gonzalez > Biographical Info

### 12. Crear video walkthrough del tour (60-90 segundos)
- **Impacto:** MEDIO
- **Qué:** Ningún competidor en el top 10 usa video prominentemente en sus city pages. Un video corto mostrando la experiencia real diferencia enormemente.
- **Dónde:** Embeber en city pages arriba del fold

---

## PENDIENTES DE SEGUNDA AUDITORIA (31 de mayo 2026)

### 14. Agregar alt text a 18+ imágenes en WordPress
- **Impacto:** ALTO
- **Qué:** 52% de las imágenes del homepage no tienen alt text. Incluye: 8 banderas de países, 6 imágenes del gallery, 2 imágenes de "experience section", 2 logos de "featured in".
- **Dónde:** WordPress > Media Library

### 17. Crear Privacy Policy y Terms of Service
- **Impacto:** ALTO (E-E-A-T trust)
- **Qué:** No existen links a Privacy Policy ni Terms en ninguna parte del sitio.
- **Acción:** Crear las páginas con contenido legal y agregar links en el footer.

### 18. Agregar Person schema para co-founders en About page
- **Impacto:** ALTO
- **Qué:** Guille Borthwick (ex-IBM) y Alex Pels (Michelin) tienen credenciales fuertes pero no tienen schema Person.
- **Acción:** Agregar JSON-LD Person con jobTitle, description, sameAs (LinkedIn) y worksFor.
- **Requiere:** URLs de LinkedIn de ambos co-founders

### 19. Agregar geo coordinates al schema TourOperator en city pages
- **Impacto:** ALTO (local SEO)
- **Qué:** Ningún city page tiene coordenadas geográficas en el schema. Para un SAB sin dirección, las coords son la señal principal de ubicación.
- **Acción:** Agregar campo ACF para lat/lng por ciudad, o hardcodear coordenadas centrales.

### 20. Agregar addressCountry al TourOperator schema en city pages
- **Impacto:** MEDIO
- **Qué:** Solo tiene `addressLocality` sin `addressCountry`. Google necesita ambos.
- **Acción:** Agregar mapping ciudad->país ISO o campo ACF.

### 21. Mejorar Person schema en author pages
- **Impacto:** MEDIO
- **Qué:** ProfilePage schema actual no tiene `knowsAbout`, `jobTitle`, ni `sameAs`.
- **Acción:** Agregar estas propiedades. Puede requerir nuevos campos ACF.

### 22. Crear página /groups o /corporate
- **Impacto:** MEDIO
- **Qué:** Cero contenido B2B. "Partner With Us" y "Careers" apuntan a la misma página de contacto.
- **Acción:** Crear página dedicada con formulario de grupo, pricing, y testimonios corporativos.

### 23. Transformar Travel Guide hub en pillar page
- **Impacto:** MEDIO
- **Qué:** Actualmente es un index de tarjetas con ~200 palabras propias. Google premia pillar pages de 1500+ palabras.
- **Acción:** Agregar 800-1200 palabras de copy editorial original como intro.

