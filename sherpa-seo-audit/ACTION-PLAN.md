# SEO Action Plan: sherpafoodtours.com
## Prioritized Recommendations (Critical > High > Medium > Low)

**Current Score: 55/100 | Target Score: 75+ within 90 days**

---

## CRITICAL -- Fix Immediately (Week 1)

### 1. Fix homepage meta description
**Impact:** Every SERP snippet for homepage is garbled
**Current:** `\nSherpa isn&#8217;t just a food tour...` (HTML entities, line breaks)
**Action:** Rewrite to clean 140-155 character sentence, update og:description and twitter:description
**Effort:** 30 minutes

### 2. Fix fabricated phone number in schema
**Impact:** Corrupts all scraped citation records; direct trustworthiness failure
**Current:** `"telephone": "+1-555-123-4567"` (placeholder 555 number)
**Action:** Replace with real E.164 phone number or remove the field entirely
**Effort:** 15 minutes

### 3. Fix null/invalid values in tour page schemas
**Impact:** Breaks star rating rich results on all tour pages
**Current:** `ratingCount: null`, `ratingValue: 5` (placeholder), `"Cartagena, null"`
**Action:** Set ratingCount to actual review integer; fix Cartagena country template rendering
**Effort:** 30 minutes

### 4. Fix schema data types
**Impact:** AggregateRating won't render as stars in SERPs
**Current:** `"ratingValue": "4.8"` and `"reviewCount": "4649"` (strings)
**Action:** Convert to numeric: `"ratingValue": 4.8` and `"reviewCount": 4649`
**Effort:** 15 minutes

### 5. Add timezone offsets to article dates
**Impact:** Date freshness signals are ambiguous to Google
**Current:** `"datePublished": "2026-05-11T14:23:51"` (no timezone)
**Action:** Append offset: `"datePublished": "2026-05-11T14:23:51-03:00"`
**Effort:** 1 hour

### 6. Migrate images from staging to production
**Impact:** Single point of failure for ALL visual content site-wide
**Current:** All images load from `staging.sherpafoodtours.com/wp-content/uploads/`
**Action:** Move assets to production CDN; update all image refs in schema, content, and CSS
**Effort:** 1-2 days

### 7. Resolve NAP conflicts
**Impact:** Three different countries in schema vs footer vs About Us
**Action:** Decide on primary business address (UK registered or operational); make consistent across schema, footer, contact page
**Effort:** 2-3 hours

---

## HIGH -- Fix Within 2 Weeks

### 8. Create GBP listings for top 3 cities
**Impact:** Unlocks local pack presence -- #1 local ranking factor
**Action:** Create verified GBP for Buenos Aires, London, Barcelona; category "Tour Operator"; activate FareHarbor "Reserve with Google"
**Effort:** 2-3 days per city

### 9. Fix Buenos Aires URL slug
**Impact:** Flagship city has unprofessional `-2` suffix
**Action:** Create `/city/buenos-aires/`, 301 redirect from `-2`, update sitemap + internal links
**Effort:** 2-3 hours

### 10. Implement hreflang
**Impact:** Google can't determine which page to serve which locale
**Action:** Add hreflang to `/contact/` and `/contacto/` pair as immediate fix; design full strategy for all locales
**Effort:** 2-4 hours (initial pair), 1-2 weeks (full strategy)

### 11. Create llms.txt
**Impact:** AI systems must guess what to cite vs being directed to best content
**Action:** Create `/llms.txt` with company description, 8 city tour pages, top 10 articles, permission language
**Effort:** 2-4 hours

### 12. Add entity linking via @id across schema
**Impact:** Google can't resolve TravelAgency + Organization + publisher as same entity
**Action:** Add `"@id": "https://www.sherpafoodtours.com/#organization"` to both blocks; reference in Article/TouristTrip publisher
**Effort:** 3-4 hours

### 13. Add WebSite schema with SearchAction
**Impact:** Missing sitelinks searchbox eligibility
**Action:** Add WebSite JSON-LD block to homepage
**Effort:** 30 minutes

### 14. Add Person/ProfilePage schema to author pages
**Impact:** E-E-A-T entity graph is incomplete
**Action:** Add ProfilePage + Person schema with name, jobTitle, worksFor, sameAs to each author page
**Effort:** 2-3 hours

### 15. Add Google Maps embeds to city + tour pages
**Impact:** Zero Maps integrations site-wide; missing local relevance signal
**Action:** Embed Google Map showing tour neighborhood/meeting point on each page
**Effort:** 1-2 days

### 16. Register on Viator and GetYourGuide
**Impact:** Dominate "food tour [city]" SERPs; critical distribution channels for tours
**Action:** Create operator listings on both platforms for all 8 cities
**Effort:** 1-2 weeks

---

## MEDIUM -- Fix Within 1 Month

### 17. Publish Barcelona and Cartagena editorial content
**Impact:** Active tour cities with zero supporting articles
**Action:** Minimum 3 articles each: city food guide overview, 1 dish-specific, 1 neighborhood article
**Effort:** 2-3 weeks of content creation

### 18. Expand Lima content
**Impact:** Only 1 article for a city being actively promoted with 30% discount
**Action:** Target 5+ articles within 60 days
**Effort:** 2-3 weeks

### 19. Fix alt text on 22 homepage images
**Effort:** 1-2 hours

### 20. Geo-target Lima promotional marquee
**Action:** Show Lima promo only on Lima page and homepage, not other city pages
**Effort:** 1-2 hours

### 21. Add FAQ blocks structured for AI extraction
**Action:** Convert implicit questions in articles to explicit H3 + 134-167 word direct answers; add FAQPage schema
**Effort:** 1-2 weeks across top articles

### 22. Rewrite section openers as direct answers
**Action:** First sentence under every H2/H3 states the core claim; narrative follows
**Effort:** Ongoing editorial standard

### 23. Add sourced statistics to articles
**Action:** Replace unattributed superlatives with specific sourced claims + external links
**Effort:** 1-2 weeks research + editorial

### 24. Embed FareHarbor booking inline
**Action:** Replace external redirect with embedded widget or full-page transition
**Effort:** 1-2 days

### 25. Add "Why Sherpa" differentiation section to city pages
**Action:** 2-3 concrete differentiators (max group size, all-inclusive pricing, vetted local guides)
**Effort:** 1-2 days

### 26. Fix og:image
**Action:** Create dedicated 1200x630px hero image for social sharing (food tour photography)
**Effort:** 2-3 hours

### 27. Implement IndexNow
**Action:** Generate key, host key file, trigger pings on content publish
**Effort:** 2-3 hours

### 28. Update author bios
**Action:** Add verifiable credentials to Sofia Gonzalez; populate or noindex Gaston Balatti page
**Effort:** 1-2 hours

---

## LOW -- Backlog

### 29. Pursue Wikipedia entity page
**Effort:** High (notability research + editorial)

### 30. Add AI crawler directives to robots.txt
**Effort:** 30 minutes

### 31. Implement nonce-based CSP
**Effort:** High (requires Next.js middleware changes)

### 32. Add Event schema for scheduled tours
**Effort:** Medium

### 33. Create tour walkthrough video (60-90s)
**Effort:** High (production)

### 34. Add email capture for non-converting visitors
**Effort:** Medium

### 35. Create "Best food tours in [city]" editorial articles
**Effort:** High (content creation)

---

## Expected Score Impact

| Milestone | Estimated Score | Timeline |
|---|---|---|
| After Sprint 1 (emergency fixes) | 62/100 | Week 1 |
| After Sprint 2 (structural fixes) | 68/100 | Week 3 |
| After Sprint 3 (local SEO foundation) | 72/100 | Week 5 |
| After Sprint 4 (content + E-E-A-T) | 76/100 | Week 8 |
| After Sprint 5 (GEO + AI) | 80/100 | Week 10 |
| After Sprint 6 (conversion + SXO) | 83/100 | Week 12 |

---

*Action plan generated from full SEO audit, May 19, 2026*
