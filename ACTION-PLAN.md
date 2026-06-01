# SEO Action Plan: Sherpa Food Tours

**Current Score:** 62/100
**Target Score:** 85/100
**Date:** May 31, 2026

---

## Critical Priority (Fix Immediately)

### 1. Fix staging domain image delivery
**Impact:** Images, Performance, Social Sharing, Trust
**Root Cause:** `NEXT_PUBLIC_WP_URL` environment variable points to staging server. `normalizeWpImageUrl()` in `src/lib/wp.ts` rewrites ALL image URLs to staging domain.
**Fix:** Set `NEXT_PUBLIC_WP_URL` to `https://www.sherpafoodtours.com` in Vercel production environment variables. No code change needed.
**Effort:** 10 minutes (env var change + deploy)
**Score Impact:** +5 points (Images 54->70, Performance +3, On-Page +2)

### 2. Fix dual LCP image pattern
**Impact:** Core Web Vitals (LCP), Performance
**Root Cause:** `src/ui/components/main-image.tsx` renders TWO stacked `<Image>` elements (both `priority`). Hero preload commented out in `page.tsx` lines 283-299.
**Fix:** Remove dual-image pattern. Use single `next/image` with `priority`. Replace React state opacity with CSS-only loading state. Uncomment and correct the preload link.
**Effort:** Medium (2-3 hours)
**Score Impact:** +4 points (Performance 62->75)

### 3. Unblock FacebookBot in robots.txt
**Impact:** Social Sharing (Facebook, Instagram, WhatsApp, Messenger)
**Root Cause:** `src/app/robots.ts` line 18-20 groups FacebookBot with training crawlers
**Fix:** Move FacebookBot to its own allowed group:
```typescript
{ userAgent: ['FacebookBot'], allow: '/', disallow: ['/private/', '/admin/', '/api/'] }
```
**Effort:** 10 minutes
**Score Impact:** +2 points (Technical +2)

### 4. Fix review count discrepancy
**Impact:** Schema validity, Trust, AI citation accuracy
**Root Cause:** Homepage shows "2,000" (Google) + "15,000" (TripAdvisor) in HTML (`page.tsx` lines 336, 383) but `aggregateRating` schema uses `reviewCount: 4649` (line 244). Three conflicting numbers.
**Fix:** Reconcile to accurate per-platform counts. Update schema `reviewCount` to match visible text. Or scope `aggregateRating` to one platform explicitly.
**Effort:** Low (1 hour)
**Score Impact:** +2 points (Schema +3)

### 5. Remove duplicate Article markup on travel guide pages
**Impact:** Schema, Structured Data signals
**Root Cause:** `src/app/travel-guide/[city]/[slug]/page.tsx` emits both JSON-LD Article AND Microdata `itemScope/itemType` attributes on `<article>` element (lines 299-313).
**Fix:** Remove all `itemScope`, `itemType`, and `itemProp` attributes from JSX. Keep the complete JSON-LD block.
**Effort:** Low (30 minutes)
**Score Impact:** +2 points (Schema +3)

### 6. Fix tour page schema bugs
**Impact:** Schema validity
**Issues in `src/app/tour/[slug]/page.tsx`:**
- Line 222: `tourUrl` missing trailing slash (mismatches canonical)
- Line 346: `Number(price)` returns NaN if price is empty (invalid Offer)
- `ratingCount` should be `reviewCount`
**Fix:** Add trailing `/` to tourUrl. Guard price conversion. Change property name.
**Effort:** Low (30 minutes)

---

## High Priority (Fix Within 1 Week)

### 7. Fix homepage meta description
**Impact:** CTR, On-Page SEO
**Current:** "Sherpa isnt just a food tour its how you become part of the city..." (grammar errors, truncated)
**Fix:** Write proper 150-155 char description in WordPress CMS or hardcode fallback
**Suggested:** "Sherpa Food Tours offers authentic culinary experiences in 8 cities worldwide. TripAdvisor's #1 food tour. Taste local food with passionate guides. Book now!"
**Effort:** 15 minutes

### 8. Add H1 to contact page
**File:** `src/app/contact/page.tsx` line 65
**Fix:** Change `<h2>` to `<h1>`
**Effort:** 5 minutes

### 9. Fix About Us H1 (invalid HTML)
**File:** `src/app/about-us/page.tsx` lines 191-196
**Current:** `<h1>The <div><img .../></div> manifesto</h1>` - `<div>` inside `<h1>` is invalid
**Fix:** Replace `<div>` with `<span>`, or move image outside H1
**Effort:** 15 minutes

### 10. Fix "Por:" to "By:" in English articles
**File:** `src/app/travel-guide/[city]/[slug]/page.tsx` line 324
**Effort:** 5 minutes

### 11. Remove console.log from production
**File:** `src/app/tour/[slug]/page.tsx` lines 207, 217
**Fix:** Remove `console.log({ acf })` and `console.log({ title })`
**Effort:** 5 minutes

### 12. Fix footer logo alt text typo
**File:** `src/ui/components/footer.tsx` line 24
**Fix:** Change `"Shera complete logo"` to `"Sherpa Food Tours logo"`
**Effort:** 5 minutes

### 13. Fix relative logo URL in CollectionPage schema
**File:** `src/app/travel-guide/page.tsx` line 120
**Fix:** Change `"/sherpa-complete-logo.webp"` to `` `${baseUrl}/sherpa-complete-logo.webp` ``
**Effort:** 5 minutes

### 14. Add alt text to all images
**Fix:** Update WordPress media library alt text for 18+ images with empty alt. Add defensive fallback in `wp.getPostImage()` in `src/lib/wp.ts`.
**Effort:** 1-2 hours

### 15. Add ContactPage schema
**File:** `src/app/contact/page.tsx`
**Fix:** Add `ContactPage` + `BreadcrumbList` JSON-LD with organization reference
**Effort:** 30 minutes

### 16. Shorten homepage title
**Current:** 94 characters (truncated in SERPs)
**Suggested:** "Sherpa Food Tours | Authentic Culinary Experiences Worldwide" (60 chars)
**Effort:** 10 minutes

---

## Medium Priority (Fix Within 1 Month)

### 17. Fix `og:type` on tour pages
**File:** `src/app/tour/[slug]/page.tsx`
**Fix:** Change `type: "article"` to `type: "website"` or remove (defaults to website)
**Effort:** 5 minutes

### 18. Fix sitemap `lastModified` accuracy
**File:** `src/app/sitemap.ts`
**Fix:** Use WordPress `modified` field for city/tour pages. Hardcode dates for static pages. Remove `priority` and `changefreq` (Google ignores both).
**Effort:** 1-2 hours

### 19. Fix stale llms.txt URL
**File:** `public/llms.txt`
**Fix:** Change `/city/buenos-aires-2/` to `/city/buenos-aires/`. Expand to list all 72 articles.
**Effort:** 2-3 hours (create `llms-full.txt` companion)

### 20. Add ClaudeBot to robots.txt
**File:** `src/app/robots.ts`
**Fix:** Add explicit Allow directive for ClaudeBot
**Effort:** 5 minutes

### 21. Change homepage schema type
**File:** `src/app/page.tsx` line 223
**Fix:** Change `"@type": "TravelAgency"` to `"@type": "TourOperator"` (matches city pages)
**Effort:** 5 minutes

### 22. Add LocalBusiness schema per city with geo coordinates
**File:** `src/app/city/[slug]/page.tsx`
**Fix:** Add `geo` with `GeoCoordinates` (latitude/longitude). Add `addressCountry`. Add `aggregateRating` per city. Requires ACF fields for coordinates and per-city reviews.
**Effort:** 4-6 hours

### 23. Add per-city TripAdvisor and GBP links
**Fix:** Find/create TripAdvisor listings for all 8 cities. Add to schema `sameAs` and visible city page links.
**Effort:** 2-3 hours

### 24. Claim Google Business Profiles for all 8 cities
**Impact:** Local pack ranking eligibility
**Fix:** Create/claim GBP per city. Set "Food Tour Agency" as primary category. Add GBP URL to city page schema.
**Effort:** High (4-8 hours across 8 cities)

### 25. Add Person schema for co-founders on About page
**File:** `src/app/about-us/page.tsx`
**Fix:** Add `Person` schema for Guille Borthwick and Alex Pels with `jobTitle`, `description`, `sameAs`
**Effort:** 1-2 hours

### 26. Enhance author page Person schema
**File:** `src/app/author/[user]/page.tsx`
**Fix:** Add `knowsAbout`, `hasOccupation`, `sameAs` to `ProfilePage` schema
**Effort:** 1 hour

### 27. Add meeting point info to city pages
**Fix:** Add ACF field for meeting point address/landmark. Render on city page. Optional: Google Maps embed.
**Effort:** 3-4 hours

### 28. Add Privacy Policy and Terms of Service
**Fix:** Create and link both pages in footer
**Effort:** 4-6 hours (content + implementation)

### 29. Reduce third-party script impact
**Fix:** Audit which scripts are needed. Load non-critical scripts after user interaction. Change `fetchPriority` on below-fold "As Featured In" logos from "high" to default.
**Effort:** 3-5 hours

### 30. Implement IndexNow pings
**Fix:** Create Next.js API route at `/src/app/api/indexnow/route.ts`. Configure WordPress webhook on publish.
**Effort:** 2-3 hours

---

## Low Priority (Backlog)

### 31. Create dedicated /groups or /corporate page
Corporate planner persona scores 25/100. Zero B2B content exists.

### 32. Transform travel guide hub into editorial pillar page
Currently a content index (SXO score: 40/100). Needs 800-1,200 words of original hub copy.

### 33. Create city-level travel guide hub pages
`/travel-guide/paris/` redirects to single article. Needs a hub page per city.

### 34. Add cross-city linking on city pages
"Explore other cities" section on each city page.

### 35. Create /tour/ listing page
Currently redirects to Buenos Aires tour. Should show all tours across cities.

### 36. Migrate city card images to Next.js `<Image>` component
Currently raw `<img>` tags forfeiting responsive images and format optimization.

### 37. Convert footer social icons PNG -> SVG
Pixelated on high-DPI screens.

### 38. Add footer logo `width`/`height` attributes
Prevents CLS.

### 39. Add LinkedIn company profile to sameAs
Missing from entity graph.

### 40. Create YouTube channel
0.737 correlation with AI citation frequency. Highest-impact brand signal for GEO.

### 41. Add `speakable` schema to city and tour pages
Direct signal to Google AIO for quotable content extraction.

### 42. Add "key facts" summary boxes to travel guide articles
Improve AI citation readiness.

### 43. Resolve `/contacto/` page
Either add proper hreflang cluster or redirect to `/contact/`.

### 44. Clean up commented-out redirect block
`next.config.ts` lines 44-769 commented out. Clarify which rules are active.

### 45. Convert hardcoded absolute internal links to relative
`page.tsx` line 433 and `footer.tsx` use full URLs. Should use `<Link href="/...">`.

---

## Implementation Roadmap

### Week 1 (Critical + Quick Wins)
- [ ] Set `NEXT_PUBLIC_WP_URL` to production domain (Critical #1)
- [ ] Unblock FacebookBot in robots.txt (Critical #3)
- [ ] Fix review count discrepancy (Critical #4)
- [ ] Remove duplicate Microdata from articles (Critical #5)
- [ ] Fix tour page schema bugs (Critical #6)
- [ ] Fix homepage meta description (High #7)
- [ ] Add H1 to contact page (High #8)
- [ ] Fix About H1 invalid HTML (High #9)
- [ ] Fix "Por:" to "By:" (High #10)
- [ ] Remove console.log (High #11)
- [ ] Fix footer logo typo (High #12)
- [ ] Fix relative logo URL in schema (High #13)
- [ ] Add alt text to WordPress images (High #14)

### Week 2
- [ ] Fix dual LCP image pattern (Critical #2)
- [ ] Add ContactPage schema (High #15)
- [ ] Shorten homepage title (High #16)
- [ ] Fix og:type on tour pages (Medium #17)
- [ ] Fix sitemap lastModified (Medium #18)
- [ ] Fix llms.txt stale URL + expand (Medium #19)
- [ ] Add ClaudeBot to robots.txt (Medium #20)

### Week 3-4
- [ ] Change homepage schema to TourOperator (Medium #21)
- [ ] Add LocalBusiness schema per city (Medium #22)
- [ ] Add per-city TripAdvisor links (Medium #23)
- [ ] Claim GBP for all 8 cities (Medium #24)
- [ ] Add Person schema for co-founders (Medium #25)
- [ ] Enhance author page schema (Medium #26)
- [ ] Add meeting point info to city pages (Medium #27)

### Month 2
- [ ] Add Privacy Policy and Terms (Medium #28)
- [ ] Optimize third-party scripts (Medium #29)
- [ ] Implement IndexNow (Medium #30)
- [ ] Create /groups page (#31)
- [ ] Transform travel guide hub (#32)

### Backlog (Month 3+)
- [ ] Items #33-#45

---

## Expected Score Impact

| Phase | Actions | Score Change |
|---|---|---|
| Week 1 (Critical + Quick) | #1-#14 | 62 -> 72 (+10) |
| Week 2 | #2, #15-#20 | 72 -> 77 (+5) |
| Week 3-4 | #21-#27 | 77 -> 82 (+5) |
| Month 2 | #28-#32 | 82 -> 87 (+5) |
| **Total projected** | | **62 -> 87/100** |
