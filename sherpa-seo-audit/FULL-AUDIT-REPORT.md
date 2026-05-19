# Full SEO Audit Report: sherpafoodtours.com

**Audit Date:** May 19, 2026
**Site:** https://www.sherpafoodtours.com/
**Platform:** Next.js on Vercel (headless WordPress CMS)
**Pages in Sitemap:** 98 URLs
**Business Type:** Hybrid Service-Area Business -- Food Tour Operator (8 cities, 7 countries)
**Cities:** Buenos Aires, Barcelona, Cartagena, Mexico City, Amsterdam, Lima, London, Paris

---

## SEO Health Score: 55 / 100

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 61/100 | 13.4 |
| Content Quality & E-E-A-T | 23% | 64/100 | 14.7 |
| On-Page SEO | 20% | 62/100 | 12.4 |
| Schema / Structured Data | 10% | 40/100 | 4.0 |
| Performance (CWV) | 10% | 60/100 | 6.0 |
| AI Search Readiness (GEO) | 10% | 58/100 | 5.8 |
| Images | 5% | 55/100 | 2.8 |
| **TOTAL** | **100%** | | **59.1** |

**Adjusted Score: 55/100** (penalized for critical Local SEO gaps: 41/100 local score, no GBP listings, fabricated NAP data)

---

## Executive Summary

Sherpa Food Tours has strong raw assets: a TripAdvisor "Best of the Best" #1 global food experience award, 4,649 reviews at 4.8/5, a co-founder with a Michelin-recognized restaurant, substantive editorial content (84 travel guide articles), and a modern Next.js tech stack with SSR.

However, the site is undermined by several **critical structural issues** that actively harm rankings and trust:

### Top 5 Critical Issues

1. **Production site loads all images from a staging subdomain** (`staging.sherpafoodtours.com`) -- a single point of failure affecting every page
2. **Fabricated contact data in schema** -- placeholder phone number (+1-555-123-4567) and conflicting addresses (NY schema vs UK registration vs Buenos Aires operations)
3. **Zero Google Business Profile presence** across all 8 operating cities -- the #1 local ranking factor is completely absent
4. **No hreflang implementation** despite serving content in English and Spanish across 7 countries
5. **Broken/ugly URL slugs** -- Buenos Aires uses `/city/buenos-aires-2/`, homepage meta description contains raw HTML entities and line breaks

### Top 5 Quick Wins (high impact, low effort)

1. Fix the homepage meta description (remove HTML entities and line breaks) -- 30 minutes
2. Replace the placeholder phone number in schema with a real number or remove it -- 15 minutes
3. Fix `ratingCount: null` on tour page schemas -- 15 minutes
4. Fix "Cartagena, null" string in homepage OfferCatalog description -- 15 minutes
5. Add timezone offsets to all Article `datePublished`/`dateModified` values -- 1 hour

---

## 1. Technical SEO -- 61/100

### Crawlability (78/100)
- robots.txt is clean: allows `/`, blocks `/private/`, `/admin/`, `/api/`
- Sitemap at `/sitemap.xml` with 98 URLs, referenced in robots.txt
- Internal linking from global nav gives city pages depth-1 access
- **Issue:** `/api/` block may affect Next.js data routes for AI crawlers (Medium)

### Indexability (62/100)
- Meta robots correctly set to `index, follow` on all pages
- Googlebot directives include `max-image-preview:large` (good)
- **CRITICAL:** Homepage meta description contains `\n`, `&#8217;` HTML entities, and multiple blank lines -- Google will render garbled text or rewrite entirely
- **HIGH:** `/contact/` and `/contacto/` both indexed with no cross-canonical or hreflang relationship
- **HIGH:** `/city/buenos-aires-2/` and `/tour/san-telmo-tour-2/` have WordPress duplicate slug artifacts

### Security (82/100)
- HTTPS with HSTS preload (max-age 2 years) -- strong
- CSP headers present but use `unsafe-inline` and `unsafe-eval` -- weakens XSS protection
- Cookie consent (Cookiebot) implemented

### URL Structure (70/100)
- Clean URL pattern: `/city/[name]/`, `/tour/[name]/`, `/travel-guide/[city]/[slug]/`
- **HIGH:** `-2` suffix on Buenos Aires and San Telmo URLs signals CMS issues
- **HIGH:** `/tour` parent URL redirects (308) to a random tour page, not a tours index -- breadcrumb schema references it as a canonical @id

### Mobile Optimization (85/100)
- Next.js responsive framework with proper viewport meta
- `font-display: swap` with fallback metrics (reduces CLS)
- Some raw `<img>` tags lack width/height attributes (minor CLS risk)

### Core Web Vitals (60/100)
- Two hero images preloaded simultaneously (one from staging) -- LCP competition
- 0.6s opacity crossfade transition on hero adds rendering delay
- WebP image format used (positive)
- Next.js code-splitting and SSR (positive)

### JavaScript Rendering (88/100)
- Next.js SSR delivers full HTML on initial response -- excellent for all crawlers
- No JavaScript rendering barriers encountered during fetches

### International SEO (10/100 -- CRITICAL FAIL)
- **ZERO hreflang tags** anywhere on the site
- Spanish content exists (`/contacto/`) with Spanish meta title/description
- Operates in 7 countries with distinct language and regional search intents
- No `x-default` declaration

### IndexNow (0/100)
- Not implemented; `/indexnow` returns 404

---

## 2. Content Quality & E-E-A-T -- 64/100

### E-E-A-T Composite: 61/100

| Factor | Score | Key Finding |
|---|---|---|
| Experience | 72 | Strong first-hand signals in best articles (asado, Peruvian food); weaker in Paris/Amsterdam content |
| Expertise | 65 | Alex Pels has Michelin-recognized credentials; Ana Rodriguez studying gastro journalism; Sofia Gonzalez has no verifiable credentials |
| Authoritativeness | 60 | TripAdvisor #1 Best of Best is major signal; "As Featured In" section is visual-only with no schema backing |
| Trustworthiness | 55 | Placeholder phone number, staging image URLs, and mixed entity signals (US LLC vs UK Ltd) undermine trust |

### Content Highlights
- **Strong articles:** "What is Asado?" (2,000+ words, genuine local voice, specific butcher shops named), "Why Peruvian Food is the Best" (2,500+ words, 8 structured sections), "Sherpa Buenos Aires: #1 Food Tour" (company founding story with dates)
- **Weak content:** Paris/Amsterdam articles read as researched summaries without first-person experience signals; Sofia Gonzalez's bio matches AI-generated content patterns
- **Homepage:** Only ~250-300 words of body text -- critically thin

### Content Coverage Gaps (CRITICAL)

| City | Articles | Tours Active | Gap Severity |
|---|---|---|---|
| Buenos Aires | 27 | Yes | None |
| Mexico City | 15 | Yes | Low |
| Amsterdam | 14 | Yes | Low |
| Paris | 9 | Yes | Medium |
| London | 4 | Yes | High |
| Lima | 1 | Yes (new, promoted) | High |
| Cartagena | 0 | Yes | CRITICAL |
| Barcelona | 0 | Yes | CRITICAL |

Barcelona and Cartagena are active tour cities with **zero editorial content** supporting them.

### Author Pages

| Author | Credentials | Posts | E-E-A-T Rating |
|---|---|---|---|
| Alex Pels | Co-founder, Michelin-recognized Fogon Asado | 1 | HIGH (underutilized) |
| Ana Rodriguez | Gastro journalism student | 10+ | MEDIUM-HIGH |
| Guille Borthwick | Co-founder, IBM Innovation, 4 countries | 5+ | MEDIUM-HIGH |
| Sofia Gonzalez | "deep passion for food" -- no credentials | 10+ | LOW |
| Gaston Balatti | Page exists, zero posts, no bio | 0 | N/A -- DEAD PAGE |

- No author pages have Person schema, photos, or external profile links
- Gaston Balatti's author page is indexed in sitemap with "No posts found" -- thin content

---

## 3. On-Page SEO -- 62/100

### Title Tags
- City pages use strong pattern: "[City] Food Tours & Local Culinary Experiences | Sherpa Food Tours"
- Homepage title is 87 characters (too long): "Taste, Share and Explore what locals love | Sherpa Food Tours - Authentic Culinary Experiences"
- Homepage H1 is a brand line, not keyword-aligned -- no user searches this phrase

### Meta Descriptions
- **CRITICAL:** Homepage meta description has raw HTML entities and line breaks
- City page meta descriptions are well-written and keyword-rich
- Article meta descriptions appear templated ("Food and travel guide for [City]")

### Heading Structure
- City pages: H1 "[City] Food Tour" -- correct and keyword-targeted
- Articles: Clear H1 > H2 > H3 hierarchy with thematic progression
- **Issue:** Almost no question-word headings (What/How/Why) across the site -- these trigger AI answer generation

### Internal Linking
- Global nav provides 1-click access to all city pages
- Cross-linking between Travel Guide articles and city/tour booking pages appears sparse
- No "Related tours" or "Related articles" widgets detected on article pages

---

## 4. Schema / Structured Data -- 40/100

### What Exists (Good Foundation)
- Homepage: TravelAgency, AggregateRating, OfferCatalog with 8 TouristTrip items
- City pages: TouristDestination, FAQPage, BreadcrumbList
- Tour pages: TouristTrip with Offer pricing, BreadcrumbList
- Articles: Article with author, publisher, dates, BreadcrumbList
- About Us: Organization
- 1 article: VideoObject

### Critical Schema Errors

| Issue | Severity | Pages |
|---|---|---|
| `ratingValue`/`reviewCount` as strings instead of numbers | Critical | Homepage |
| `aggregateRating.ratingCount: null` on tour pages | Critical | All tour pages |
| `ratingValue: 5` with null count -- likely placeholder data | Critical | Tour pages |
| `datePublished`/`dateModified` missing timezone offset | Critical | All articles |
| Empty `offers` block coexists with `hasOfferCatalog` | Critical | Homepage |
| `image` and `logo` point to the same logo file | Critical | Homepage |
| `"Cartagena, null"` in description | High | Homepage |
| Placeholder phone `+1-555-123-4567` | High | Homepage |
| BreadcrumbList position 1 is `/tour` (redirects) not homepage | High | Tour pages |
| Author URLs have no Person/ProfilePage schema | High | Articles |
| Organization on About Us not linked to TravelAgency via `@id` | Medium | About Us + Homepage |
| Images in schema use staging.sherpafoodtours.com URLs | High | Multiple pages |

### Missing Schema (High Priority)

| Missing Schema | Where | Impact |
|---|---|---|
| WebSite + SearchAction | Homepage | Sitelinks searchbox eligibility |
| `@id` entity linking across pages | Site-wide | Knowledge Graph entity resolution |
| ProfilePage + Person | Author pages | E-E-A-T signal completion |
| Real AggregateRating | London tour (has none) | Star rich results |
| LocalBusiness/TourOperator per city | City pages | Local pack eligibility |
| HowTo | Instructional articles (asado) | AI feature eligibility |
| ItemList | Travel guide hub pages | Hub-spoke authority |

### Note on FAQPage
FAQPage schema on city pages is syntactically valid but Google restricted FAQ rich results to government/healthcare sites since August 2023. The FAQ blocks still retain value for AI/LLM citation purposes (GEO).

---

## 5. Performance (CWV) -- 60/100

| Metric | Estimated Status | Key Issue |
|---|---|---|
| LCP | At Risk | Two hero images preloaded simultaneously; one from staging adds cross-origin hop |
| INP | Likely Pass | Next.js with async GTM; no heavy JS interactions detected |
| CLS | At Risk | Some raw `<img>` tags lack width/height; font swap with metrics override (positive) |

- WebP images used throughout (positive)
- Next.js code-splitting reduces JS bundle size (positive)
- Google Tag Manager + Cookiebot load asynchronously (positive)
- **Issue:** Removing the dual hero preload and staging dependency would significantly improve LCP

---

## 6. AI Search Readiness (GEO) -- 58/100

| Dimension | Score | Key Issue |
|---|---|---|
| Citability | 52 | Passages either too short (60-90 words) or too long (350-450 words); optimal is 134-167 words |
| Structural Readability | 65 | Good heading hierarchy but section openers are narrative, not direct-answer format |
| Multi-Modal Content | 70 | Quality images, named guides; no video content |
| Authority & Brand Signals | 55 | Strong TripAdvisor data; no Wikipedia entity, no external citations in articles |
| Technical Accessibility | 62 | SSR is excellent for AI crawlers; no llms.txt file |

### Platform-Specific Scores

| Platform | Score | Key Gap |
|---|---|---|
| Google AI Overviews | 62 | No FAQ blocks with direct answers, stats lack citations |
| ChatGPT Web Search | 55 | No llms.txt, no Wikipedia entity, passages not citation-length |
| Perplexity | 60 | No question-format headings, no sourced statistics |
| Bing Copilot | 58 | Benefits from schema but no FAQ markup optimization |

### Key GEO Findings
- **llms.txt is MISSING** (404) -- no machine-readable content declaration for AI systems
- Article openers use evocative travel writing instead of direct definitional answers
- **Zero statistics carry external citations** -- unattributed superlatives are downweighted by AI engines
- No Wikipedia entity page exists despite plausible notability (global #1 award, 4,649 reviews)
- YouTube presence unclear; video correlation with AI citations is ~0.737

---

## 7. Images -- 55/100

| Finding | Severity |
|---|---|
| 22 images on homepage have empty/missing alt text (flags, press logos, gallery photos) | Medium |
| All images served from `staging.sherpafoodtours.com` -- infrastructure vulnerability | Critical |
| WebP format used consistently (positive) | Pass |
| Next.js Image component handles responsive sizing on most images (positive) | Pass |
| `og:image` is the logo, not a social-share-optimized hero (1200x630) | Medium |
| Country flag navigation icons have no alt text -- inaccessible | Medium |

---

## 8. Local SEO -- 41/100 (Supplementary Category)

This is the single largest opportunity gap. Local SEO was scored separately because the audit weighting framework doesn't include it, but for a multi-city tour operator it is arguably the most important category.

### GBP (Google Business Profile) -- CRITICAL GAP
- **Zero GBP activity detectable** across all 8 cities
- No Google Maps embeds on any of the 17 pages analyzed
- No "Reserve with Google" integration despite FareHarbor supporting it
- GBP category selection is the #1 positive local ranking factor (Whitespark 2026)
- Missing GBP means near-zero local pack presence in all 8 competitive travel markets

### NAP Consistency -- CRITICAL

| Source | Address | Phone |
|---|---|---|
| Homepage Schema | New York, NY, US | +1-555-123-4567 (fake) |
| Footer Legal | UK registration UK00004135333 | Not present |
| About Us | Buenos Aires implied | Not present |
| Contact Page | Not present | Not present |

Three different countries referenced. No visible NAP on any page. The contact page contains no contact information.

### Review Health
- TripAdvisor: 4.8/5, 4,649 reviews, #1 Best of Best -- excellent
- Google Reviews: "+400" referenced on one page but unverifiable without GBP
- Schema review data: `ratingCount: 1000` (fabricated round number) on San Telmo tour; `null` on London

### Multi-Location Strategy
- City pages have good unique local content (neighborhoods, dishes, cultural context)
- Identical template sections ("Just relax, we've got it covered") reduce differentiation signals
- No per-city LocalBusiness schema, no geo coordinates, no Maps embeds
- No listings detected on Viator, GetYourGuide, or Google Things to Do

---

## 9. Search Experience (SXO) -- 64/100

### SERP Position Context
- **Buenos Aires:** Sherpa ranks #8 for "Buenos Aires food tour" -- behind 2 editorial roundups, 3 competitor operators, and TripAdvisor
- **Barcelona:** Sherpa does NOT appear in top 10 -- dominated by OTAs (Viator, TripAdvisor, GetYourGuide) and competitors
- **Mexico City:** Sherpa does NOT appear in top 10 -- dominated by specialist operators (Sabores Mexico, Club Tengo Hambre)

### Persona Performance

| Persona | Score | Key Gap |
|---|---|---|
| Comparison Shopper | 59/100 | No "Why Sherpa vs alternatives" section; no press article links; FareHarbor breaks trust flow |
| Group/Event Organizer | 60/100 | "Ask For It" CTA is weak; no group quote form; no corporate testimonials |
| Spontaneous Foodie | 70/100 | No "available today" signals; no sticky mobile CTA; Lima promo on all pages |
| Pre-Trip Planner | 80/100 | Strong Travel Guide; "Not ready to book?" is buried below fold as H4 |
| First-Time Food Tourist | 84/100 | Strong FAQ; no video walkthrough of actual tour experience |

### Conversion Friction Points
1. **HIGH:** "Book Now" redirects to external FareHarbor widget -- breaks on-page trust
2. **HIGH:** Barcelona has only 1 private tour -- dead end for public tour seekers
3. **MEDIUM:** Lima 30% discount marquee runs on ALL city pages (irrelevant noise)
4. **MEDIUM:** No email capture for non-converting researchers

---

## Consolidated Findings by Severity

### CRITICAL (Fix Immediately -- Blocks Indexing, Harms Trust, or Causes Penalties)

| # | Finding | Category | Effort |
|---|---|---|---|
| 1 | All images served from staging.sherpafoodtours.com | Technical / Images | High |
| 2 | Schema phone is placeholder +1-555-123-4567 | Schema / Local | Low |
| 3 | Homepage meta description has HTML entities and line breaks | Technical | Low |
| 4 | No GBP listings for any of the 8 operating cities | Local SEO | High |
| 5 | `aggregateRating.ratingCount: null` on tour pages | Schema | Low |
| 6 | No hreflang despite multi-language/multi-country content | Technical | Medium |
| 7 | "Cartagena, null" in schema description | Schema | Low |
| 8 | `ratingValue`/`reviewCount` as strings not numbers in schema | Schema | Low |
| 9 | Barcelona and Cartagena have zero editorial articles | Content | High |
| 10 | NAP conflicts: NY schema vs UK registration vs BA operations | Local | Medium |

### HIGH (Fix Within 1-2 Weeks -- Significantly Impacts Rankings)

| # | Finding | Category | Effort |
|---|---|---|---|
| 11 | `/city/buenos-aires-2/` slug (CMS artifact) | Technical / URL | Low |
| 12 | `/tour/` breadcrumb @id resolves to redirect chain | Schema | Medium |
| 13 | No WebSite schema with SearchAction on homepage | Schema | Low |
| 14 | No `@id` entity linking across schema declarations | Schema | Medium |
| 15 | No Person/ProfilePage schema on author pages | Schema / E-E-A-T | Medium |
| 16 | FareHarbor external redirect breaks conversion trust | SXO | Medium |
| 17 | No llms.txt file for AI crawler guidance | GEO | Low |
| 18 | City pages lack LocalBusiness/TourOperator schema | Local / Schema | Medium |
| 19 | Google Maps embeds absent from all pages | Local | Low |
| 20 | Not listed on Viator or GetYourGuide | Local / Authority | Medium |
| 21 | `/contact/` and `/contacto/` lack any language relationship | Technical | Medium |
| 22 | `datePublished`/`dateModified` missing timezone offset | Schema | Low |
| 23 | Gaston Balatti author page is indexed thin content | Content | Low |
| 24 | Sofia Gonzalez author bio lacks verifiable credentials | E-E-A-T | Low |
| 25 | No "Why Sherpa vs alternatives" section on city pages | SXO | Medium |

### MEDIUM (Fix Within 1 Month -- Optimization Opportunities)

| # | Finding | Category | Effort |
|---|---|---|---|
| 26 | 22 homepage images missing alt text | Images / Accessibility | Low |
| 27 | Sitemap lastmod reflects build time, not content modification | Technical | Medium |
| 28 | og:image is logo, not social-share-optimized hero | Images / Social | Low |
| 29 | No IndexNow implementation | Technical | Low |
| 30 | Lima promo marquee displays on all non-Lima pages | SXO | Low |
| 31 | No FAQ blocks with direct answers for AI extraction | GEO | Medium |
| 32 | Section openers are narrative, not direct-answer format | GEO / Content | Medium |
| 33 | No question-word H2/H3 headings (What/How/Why) | GEO / On-Page | Medium |
| 34 | Zero sourced statistics with external citations in articles | GEO / E-E-A-T | Medium |
| 35 | CSP uses unsafe-inline and unsafe-eval | Security | High |
| 36 | Article schema keywords field is templated/identical | Schema | Low |
| 37 | No email capture / lead gen for non-converting visitors | SXO | Medium |
| 38 | No video content on any page | SXO / GEO | High |
| 39 | City pages show no pricing/availability above the fold | SXO | Low |
| 40 | No AggregateRating schema on city hub pages | Schema / Local | Low |

### LOW (Backlog -- Nice to Have)

| # | Finding | Category | Effort |
|---|---|---|---|
| 41 | No AI crawler management rules in robots.txt | Technical / GEO | Low |
| 42 | `isFamilyFriendly: "true"` (string) should be boolean | Schema | Low |
| 43 | Breadcrumb first item labeled brand name instead of category | Schema | Low |
| 44 | HSTS preload submission status unverified | Security | Low |
| 45 | No Event schema for scheduled tour departures | Schema | Low |
| 46 | No individual Review objects in schema | Schema | Low |
| 47 | Articles could use BlogPosting subtype instead of Article | Schema | Low |

---

## Implementation Roadmap

### Sprint 1: Emergency Fixes (Week 1)
**Effort: ~1-2 days | Impact: Removes active penalties and trust violations**

1. Fix homepage meta description -- remove HTML entities and line breaks, rewrite to clean 140-155 chars
2. Replace `+1-555-123-4567` with real phone or remove `telephone` field from schema
3. Fix `ratingCount: null` on all tour schemas -- set to real review count
4. Fix `"Cartagena, null"` in OfferCatalog description
5. Convert `ratingValue`/`reviewCount` from strings to numbers
6. Add timezone offsets to all Article datePublished/dateModified
7. Remove empty `offers` block from homepage (keep `hasOfferCatalog`)
8. Add alt text to 22 flagged images (priority: country flag navigation icons)

### Sprint 2: Structural Fixes (Weeks 2-3)
**Effort: ~1 week | Impact: Fixes entity resolution and URL integrity**

9. Migrate ALL image assets from staging.sherpafoodtours.com to production CDN
10. Create clean `/city/buenos-aires/` slug with 301 redirect from `-2` version
11. Fix `/tour/` redirect chain -- create tours index page or update all breadcrumb @ids
12. Implement hreflang for `/contact/` vs `/contacto/` pair
13. Add `@id` anchors to TravelAgency and Organization blocks, link via `publisher`
14. Add WebSite schema with SearchAction to homepage
15. Fix Organization `url` on About Us from `/about-us/` to root domain
16. Add distinct `image` (not logo) to TravelAgency schema

### Sprint 3: Local SEO Foundation (Weeks 3-5)
**Effort: ~2 weeks | Impact: Unlocks local pack presence in 8 markets**

17. Create GBP listings for Buenos Aires, London, and Barcelona (priority markets)
18. Add Google Maps embeds to all 8 city pages and tour detail pages
19. Add per-city LocalBusiness/TourOperator schema with geo coordinates
20. Register on Viator and GetYourGuide as distribution channels
21. Establish visible NAP on contact page and footer
22. Activate FareHarbor "Reserve with Google" integration

### Sprint 4: Content & E-E-A-T (Weeks 5-8)
**Effort: ~3 weeks | Impact: Fills critical content gaps and strengthens authority**

23. Publish minimum 3 articles each for Barcelona and Cartagena
24. Publish 5+ articles for Lima (supports active promotional push)
25. Add Person/ProfilePage schema to all author pages with credentials and external links
26. Update Sofia Gonzalez bio with verifiable credentials
27. Populate or noindex Gaston Balatti author page
28. Add "Why Sherpa" differentiation section to city pages

### Sprint 5: GEO & AI Optimization (Weeks 8-10)
**Effort: ~2 weeks | Impact: Positions site for AI search visibility**

29. Create /llms.txt with curated page index
30. Add FAQ blocks with direct answers (134-167 word passages) to top 10 articles
31. Rewrite section openers to lead with direct answers
32. Add sourced statistics with external citation links to all articles
33. Convert question-format content to H2/H3 headings
34. Implement IndexNow protocol
35. Add AI crawler directives to robots.txt

### Sprint 6: Conversion & SXO (Weeks 10-12)
**Effort: ~2 weeks | Impact: Improves conversion rate and search experience signals**

36. Embed FareHarbor booking widget inline instead of external redirect
37. Add public tour option or waitlist for Barcelona
38. Geo-target Lima promotional marquee to Lima page only
39. Surface pricing, availability, and group size above the fold on city pages
40. Add email capture mechanism for non-converting visitors
41. Create 60-90 second tour walkthrough video for city pages

### Long-term (Month 3+)

42. Pursue Wikipedia entity page for Sherpa Food Tours
43. Expand GBP to remaining 5 cities
44. Design full hreflang strategy for all locale variants
45. Implement nonce-based CSP to remove unsafe-inline/unsafe-eval
46. Create "Best food tours in [city]" editorial articles for owned SERP presence

---

## Category Deep-Dive Reports

The following specialist analyses were conducted as part of this audit:

1. **Technical SEO** -- Crawlability, indexability, security, URLs, mobile, CWV, JS rendering, international SEO
2. **Content Quality & E-E-A-T** -- Experience, expertise, authoritativeness, trustworthiness, readability, content gaps
3. **Schema / Structured Data** -- JSON-LD validation, missing opportunities, entity graph analysis
4. **Sitemap** -- Format validation, URL coverage, lastmod accuracy, priority values
5. **GEO / AI Search Readiness** -- AI crawler access, llms.txt, citability, platform-specific optimization
6. **Local SEO** -- GBP signals, NAP consistency, multi-location strategy, citations, review health
7. **SXO / Search Experience** -- SERP backwards analysis, user intent alignment, persona scoring, conversion paths

---

## Scoring Methodology

Scores were calculated using weighted category averages per the audit framework:

- **Technical SEO (22%):** Based on crawlability, indexability, security, URL structure, mobile, CWV, JS rendering, international SEO, and IndexNow sub-scores
- **Content Quality (23%):** E-E-A-T composite (Experience 20%, Expertise 25%, Authoritativeness 25%, Trustworthiness 30%), plus content depth, coverage balance, readability, and freshness
- **On-Page SEO (20%):** Title tags, meta descriptions, heading structure, internal linking, keyword targeting, above-fold content
- **Schema (10%):** Validation pass/fail rate, missing high-priority types, entity graph completeness
- **Performance (10%):** Estimated CWV status based on code analysis (lab data only; no CrUX field data available)
- **AI Search Readiness (10%):** Citability, structural readability, multi-modal content, authority signals, technical AI accessibility
- **Images (5%):** Alt text coverage, format optimization, responsive implementation, social preview quality

Local SEO (41/100) and SXO (64/100) were scored as supplementary categories and factored into the adjusted total score.

---

*Report generated by claude-seo audit framework, May 19, 2026*
