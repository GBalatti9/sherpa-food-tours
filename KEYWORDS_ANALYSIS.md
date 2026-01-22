# Análisis de Keywords - Sherpa Food Tours

## Keywords Más Usadas en el Proyecto

### Top Keywords (por frecuencia de uso)

#### 1. **"food tours"** - ⭐⭐⭐⭐⭐ (MÁS USADA)
- Aparece en: Homepage, Layout, Tours, Contact, Contacto
- **Frecuencia:** 5+ veces
- **Variaciones encontradas:**
  - "food tours"
  - "food tour" (singular)
  - "local food tours"
  - "walking food tours"
  - "street food tours"
  - "best food tours"
  - "international food tours"
  - "cultural food tours"
  - "travel food tours"
  - "food and wine tours"

#### 2. **"culinary tours"** - ⭐⭐⭐⭐
- Aparece en: Homepage, Layout, Travel Guide
- **Frecuencia:** 3+ veces
- **Variaciones:**
  - "culinary tours"
  - "culinary experiences"
  - "culinary travel guide"
  - "culinary guide"
  - "culinary destinations"

#### 3. **"authentic food experiences"** - ⭐⭐⭐⭐
- Aparece en: Homepage, About Us, Travel Guide
- **Frecuencia:** 3+ veces
- **Variaciones:**
  - "authentic food experiences"
  - "authentic food tour"
  - "authentic culinary experiences"
  - "authentic experiences"
  - "authentic travel experiences"

#### 4. **"local food tours"** - ⭐⭐⭐
- Aparece en: Homepage, Layout
- **Frecuencia:** 2+ veces

#### 5. **"walking food tours"** - ⭐⭐⭐
- Aparece en: Homepage, Layout, Tours
- **Frecuencia:** 3+ veces

#### 6. **"travel guide"** - ⭐⭐⭐
- Aparece en: Travel Guide pages, Author pages
- **Frecuencia:** 3+ veces
- **Variaciones:**
  - "travel guide"
  - "food travel guide"
  - "culinary travel guide"

#### 7. **"local cuisine"** - ⭐⭐
- Aparece en: Homepage, Tours
- **Frecuencia:** 2+ veces

#### 8. **"food experiences"** - ⭐⭐
- Aparece en: Travel Guide, Layout
- **Frecuencia:** 2+ veces

---

## Análisis por Página

### Homepage (`src/app/page.tsx`)
**Keywords (20 total):**
- food tours ⭐
- culinary tours
- authentic food experiences
- local food tours
- walking food tours
- street food tours
- food and culture tours
- gourmet tours
- food adventures
- culinary experiences
- food tastings
- food travel
- cultural food tours
- best food tours
- food tour guides
- local cuisine
- foodie experiences
- travel food tours
- international food tours
- food and wine tours

### Layout (`src/app/layout.tsx`)
**Keywords (18 total):**
- food tours ⭐
- culinary tours
- best food tours worldwide
- gourmet tours
- local food tours
- walking food tours
- street food tours
- food experiences
- authentic culinary experiences
- food and culture tours
- unique food tours
- food tours with local guides
- top city food tours
- culinary experiences in top cities
- international food tours
- cultural food tours
- food adventures
- food tastings
- food and wine tours

### Tours (`src/app/tour/[slug]/page.tsx`)
**Keywords (9 total):**
- tour.title (dinámico)
- food tour ⭐
- culinary experience
- local food guide
- authentic food tour
- walking food tour
- food tasting
- restaurant tour
- local cuisine
- food adventure

### Travel Guide (`src/app/travel-guide/page.tsx`)
**Keywords (14 total):**
- travel guide
- food travel guide
- culinary travel guide
- best restaurants
- food experiences
- travel tips
- food and drink guide
- local food recommendations
- authentic food experiences
- world food guide
- culinary destinations
- food tourism
- restaurant recommendations
- local cuisine guide

### Travel Guide Articles (`src/app/travel-guide/[city]/[slug]/page.tsx`)
**Keywords (dinámicas):**
- cityName (ej: "Buenos Aires")
- `${cityName} guide`
- `${cityName} food`
- `${cityName} travel`
- travel guide
- food guide
- culinary guide
- local experiences
- authentic experiences
- local recommendations
- travel tips
- + keywords extraídas del contenido

### City Pages (`src/app/city/[slug]/page.tsx`)
**⚠️ PROBLEMA DETECTADO:** No tiene keywords definidas en metadata

### About Us (`src/app/about-us/page.tsx`)
**Keywords (12 total):**
- about sherpa food tours
- our story
- our values
- local food guides
- authentic food experiences
- culinary mission
- food tour company
- meet our guides
- food tour philosophy
- authentic travel experiences
- local food experts
- food tourism company

### Contact (`src/app/contact/page.tsx`)
**Keywords (6 total):**
- contact sherpa food tours
- food tour inquiries
- culinary tour questions
- food tour booking
- contact food tours
- food tour support

---

## Recomendaciones para Optimizar "Buenos Aires" y "Food Tours"

### 1. **Agregar Keywords a City Pages** (PRIORIDAD ALTA)

La página de ciudades NO tiene keywords definidas. Debe agregarse:

```typescript
// En src/app/city/[slug]/page.tsx
keywords: [
    cityBySlug.city_name, // "Buenos Aires"
    `${cityBySlug.city_name} food tours`, // "Buenos Aires food tours" ⭐
    `food tours ${cityBySlug.city_name}`, // "food tours Buenos Aires" ⭐
    `${cityBySlug.city_name} culinary tours`,
    `best food tours ${cityBySlug.city_name}`,
    `walking food tours ${cityBySlug.city_name}`,
    `${cityBySlug.city_name} local food`,
    `${cityBySlug.city_name} street food`,
    `authentic food experiences ${cityBySlug.city_name}`,
    `${cityBySlug.city_name} food guide`,
    "food tours",
    "culinary tours",
    "local food tours",
    "authentic food experiences"
]
```

### 2. **Optimizar Homepage para "Buenos Aires Food Tours"**

Agregar variaciones específicas:

```typescript
// En src/app/page.tsx - agregar al inicio del array
keywords: [
    "Buenos Aires food tours", // ⭐ NUEVO
    "food tours Buenos Aires", // ⭐ NUEVO
    "food tours",
    // ... resto de keywords
]
```

### 3. **Optimizar Travel Guide Articles**

Ya tienen buena estructura, pero asegurar que incluyan:

```typescript
// En src/app/travel-guide/[city]/[slug]/page.tsx
keywords: [
    cityName, // "Buenos Aires"
    `${cityName} food tours`, // ⭐ NUEVO
    `food tours ${cityName}`, // ⭐ NUEVO
    `${cityName} guide`,
    `${cityName} food`,
    // ... resto
]
```

### 4. **Optimizar Tours para Ciudades Específicas**

Si los tours están asociados a ciudades, agregar:

```typescript
// En src/app/tour/[slug]/page.tsx
// Si el tour tiene ciudad asociada:
keywords: [
    tour.title,
    `${cityName} food tour`, // ⭐ NUEVO
    `food tour ${cityName}`, // ⭐ NUEVO
    'food tour',
    // ... resto
]
```

### 5. **Keywords Combinadas Recomendadas**

Para maximizar SEO de "Buenos Aires" + "Food Tours":

1. **"Buenos Aires food tours"** ⭐⭐⭐ (PRINCIPAL)
2. **"food tours Buenos Aires"** ⭐⭐⭐ (PRINCIPAL)
3. **"Buenos Aires culinary tours"**
4. **"best food tours Buenos Aires"**
5. **"walking food tours Buenos Aires"**
6. **"authentic food tours Buenos Aires"**
7. **"local food tours Buenos Aires"**
8. **"Buenos Aires street food tours"**
9. **"food experiences Buenos Aires"**
10. **"Buenos Aires food guide"**

---

## Resumen de Acciones Requeridas

### ✅ Prioridad Alta
1. **Agregar keywords a `city/[slug]/page.tsx`** - Actualmente NO tiene keywords
2. **Agregar "Buenos Aires food tours" y "food tours Buenos Aires" en páginas relevantes**

### ✅ Prioridad Media
3. Optimizar homepage con keywords de ciudades principales
4. Asegurar que todos los artículos del travel guide incluyan variaciones de "city + food tours"

### ✅ Prioridad Baja
5. Revisar y consolidar keywords duplicadas
6. Agregar keywords long-tail más específicas

---

## Keywords Long-Tail Recomendadas

Para mejor posicionamiento, considerar agregar:

- "best food tours in Buenos Aires"
- "Buenos Aires food tour with local guide"
- "authentic Buenos Aires food experiences"
- "Buenos Aires walking food tour"
- "private food tours Buenos Aires"
- "Buenos Aires street food tour"
- "culinary tour Buenos Aires Argentina"
- "food and culture tour Buenos Aires"

---

**Última actualización:** Generado automáticamente
**Próximos pasos:** Implementar keywords en city pages y optimizar variaciones de "Buenos Aires food tours"

