# Full SEO Audit Report: Sherpa Food Tours

**URL:** https://www.sherpafoodtours.com/
**Date:** May 31, 2026
**Business Type:** Food Tour Operator (Tourism, Multi-Location)
**Locations:** 8 cities (Buenos Aires, Barcelona, Mexico City, Lima, London, Amsterdam, Paris, Cartagena)
**Tech Stack:** Next.js 15 App Router, WordPress Headless CMS, Tailwind CSS, TypeScript
**Hosting:** Vercel Edge Network
**Pages in Sitemap:** 98 (live count)

---

## SEO Health Score: 62/100

| Category | Score | Weight | Weighted |
|---|---|---|---|
| Technical SEO | 76/100 | 22% | 16.7 |
| Content Quality & E-E-A-T | 63/100 | 23% | 14.5 |
| On-Page SEO | 60/100 | 20% | 12.0 |
| Schema / Structured Data | 65/100 | 10% | 6.5 |
| Performance (CWV) | 62/100 | 10% | 6.2 |
| AI Search Readiness (GEO) | 71/100 | 10% | 7.1 |
| Images | 54/100 | 5% | 2.7 |
| **TOTAL** | | | **65.7 -> 62/100** |

**Note:** Scores revised downward from initial estimate after subagent deep-dive into codebase revealed additional critical issues.

---

## Executive Summary

Sherpa Food Tours has genuine competitive advantages: a TripAdvisor #1 Best of the Best award, 4.8-star rating across thousands of reviews, Michelin-recognized co-founder, and strong content depth with 70+ travel guide articles. The technical foundation (Next.js SSR, Vercel edge, comprehensive schema) is above average for the industry.

However, the codebase analysis revealed several structural issues that are significantly holding back SEO performance:

### Top 5 Critical Issues
1. **Images served from staging domain** - 30+ images load from `staging.sherpafoodtours.com` due to `NEXT_PUBLIC_WP_URL` environment variable pointing to staging. Affects performance, social sharing, and image indexing.
2. **Dual LCP image pattern** - `MainImage` component renders TWO stacked images simultaneously (both marked `priority`), and the hero preload is commented out. Strong LCP risk.
3. **Review count discrepancy** - Homepage shows "2,000" (Google) + "15,000" (TripAdvisor) in HTML but schema declares `reviewCount: 4,649`. Three conflicting numbers on one page.
4. **Duplicate Article markup** - Travel guide articles emit BOTH JSON-LD Article AND Microdata `itemScope/itemType` attributes, causing conflicting structured data signals.
5. **FacebookBot blocked in robots.txt** - Completely blocks Facebook/Meta link preview crawler, breaking all social sharing on Facebook, Instagram, WhatsApp, and Messenger.

### Top 5 Quick Wins
1. Fix footer logo alt text typo "Shera" -> "Sherpa Food Tours logo" (5 min)
2. Remove `console.log` statements from tour page production code (5 min)
3. Fix "Por:" Spanish text to "By:" in English travel guide articles (5 min)
4. Add H1 to contact page (15 min)
5. Unblock FacebookBot in robots.txt (10 min)

---

## 1. Technical SEO (76/100)

### 1.1 Crawlability (82/100)

**Strengths:**
- robots.txt generated programmatically via `/src/app/robots.ts` (stays in sync with builds)
- Wildcard rule correctly allows all paths, blocks `/private/`, `/admin/`, `/api/`
- AI crawler management: GPTBot, Google-Extended, PerplexityBot, OAI-SearchBot explicitly allowed
- `llms.txt` file exists at `/public/llms.txt` with AI citation permissions
- Clean URL structure with trailing slashes enforced (`trailingSlash: true`)

**Issues:**

| Issue | Severity | Details |
|---|---|---|
| FacebookBot blocked | Critical | `Disallow: /` in robots.ts line 18-20. FacebookBot is Meta's link preview crawler, NOT a training agent. Breaks all social sharing previews. |
| `/contacto/` is a thin duplicate | High | Spanish contact page in sitemap (priority 0.7) but page body renders English heading. Mixed language signals. |
| `ClaudeBot` not explicitly managed | Low | Falls under wildcard `*` (currently allowed) but should have explicit rule for clarity |

**File:** `src/app/robots.ts`

### 1.2 Indexability (78/100)

**Strengths:**
- `robots: index, follow` on all pages
- `googlebot: index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1`
- Canonical tags present and correct on all audited pages
- Author pages filtered by description length before sitemap inclusion

**Issues:**

| Issue | Severity | Details |
|---|---|---|
| Contact page missing H1 | Critical | `/src/app/contact/page.tsx` line 65 uses `<h2>` as first heading |
| `llms.txt` contains stale URL | High | Buenos Aires link points to `/city/buenos-aires-2/` (old slug, requires redirect) |
| City links use hardcoded absolute URLs | High | `page.tsx` line 433: `href="https://www.sherpafoodtours.com/city/${city.slug}/"` instead of relative paths |
| `/contacto/` has no reciprocal hreflang | Medium | Spanish metadata but no hreflang cluster with `/contact/` |
| Homepage `revalidate = 86400` (24h) | Low | Price/content updates delayed up to 24 hours |

### 1.3 Security (88/100)

**Excellent security headers:**
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- Comprehensive `Content-Security-Policy` with specific source whitelisting
- `X-Frame-Options: DENY` + `frame-ancestors 'none'`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `poweredByHeader: false` in Next.js config
- HTTP -> HTTPS: 308 Permanent Redirect
- non-www -> www: 301 Redirect

**Issues:**

| Issue | Severity | Details |
|---|---|---|
| CSP uses `unsafe-inline` + `unsafe-eval` | High | Weakens XSS protection. Driven by GTM consent script and third-party widgets |
| `dangerouslyAllowSVG: true` | Low | Mitigated by CSP but undocumented |

### 1.4 URL Structure (70/100)

**Strengths:**
- Clean, semantic URLs: `/city/{slug}/`, `/travel-guide/{city}/{slug}/`, `/tour/{slug}/`
- Consistent trailing slashes via `trailingSlash: true`
- Lowercase, hyphen-separated

**Issues:**

| Issue | Severity | Details |
|---|---|---|
| Massive redirect block commented out in next.config.ts | High | Lines 44-769 commented out, active block at line 771+. Ambiguous which rules are live. |
| `/travel-guide/paris/` redirects to single article | Medium | No hub page for Paris travel guides - bounces to `/travel-guide/paris/parisian-cafes/` |
| `/tour/` redirects to specific BA tour | Low | Generic tour intent bounces to Buenos Aires Local Foodie Experience instead of a listing page |
| Mixed absolute/relative redirect destinations | Medium | Some redirects use full URLs, others relative paths - fragile for staging/preview environments |

### 1.5 Mobile Optimization (84/100)

**Strengths:**
- Correct viewport meta tag
- `display: 'swap'` on local fonts with system fallbacks
- Responsive grid layouts (mobile-first Tailwind)
- Client components scoped to interactive elements only

**Issues:**

| Issue | Severity | Details |
|---|---|---|
| Hero uses `95svh` without `vh` fallback | Medium | Limited browser support (Safari 15.4+, Chrome 108+) |
| Footer social icons are PNG format | Medium | Pixelated on high-DPI screens, should be SVG |
| Footer logo missing `width`/`height` attributes | Medium | Contributes to CLS |

### 1.6 Core Web Vitals (62/100)

**LCP - HIGH RISK:**
- `MainImage` component (`src/ui/components/main-image.tsx`) renders **TWO stacked `next/image` elements simultaneously** - a local placeholder AND WordPress-sourced hero image. Both marked `priority` + `fetchPriority="high"`.
- Hero image served from `staging.sherpafoodtours.com` (extra DNS lookup)
- `<link rel="preload">` for hero image **commented out** in `page.tsx` lines 283-299
- Combination of cross-subdomain origin, dual-priority images, and absent preload creates strong LCP risk (estimated 2.5-4s+ on mobile)

**CLS - MEDIUM RISK:**
- Footer logo `<img>` has no `width`/`height` (layout reflow on load)
- `MarqueeBanner` fetches data async and conditionally renders (pushes content down)
- `TallyForm` iframe likely renders 0-height initially then expands
- Memories gallery images have no explicit dimensions

**INP - LOW-MEDIUM RISK:**
- FareHarbor script loads globally; check strategy is `afterInteractive` or `lazyOnload`
- `MainImage` fade-in requires JavaScript hydration (opacity controlled by React state)

**Specific Files:**
- `src/ui/components/main-image.tsx` - dual image pattern
- `src/app/page.tsx` lines 283-299 - commented out preload
- `src/ui/components/footer.tsx` line 24 - logo without dimensions

### 1.7 JavaScript Rendering (90/100)

**Strengths:**
- All data-fetching pages are async server components
- `generateStaticParams` implemented on city, tour, and travel guide pages
- `x-nextjs-prerender: 1` confirms SSG/SSR
- Client components correctly scoped (`'use client'` on interactive elements only)

**Issues:**

| Issue | Severity | Details |
|---|---|---|
| `MainImage` client component controls LCP visibility | Medium | Hero image opacity gated by React state - no fallback without JS |
| `console.log({ acf })` in tour page | Low | Lines 207, 217 of `tour/[slug]/page.tsx` - noise in production logs |

### 1.8 IndexNow Protocol (50/100)

- IndexNow key file exists at `/public/7dfb42f3ecf3e85a1fcfeb72e91270ff.txt`
- Key is correct and verifiable
- **But no ping is ever triggered** - new/updated content is never submitted to Bing/Yandex
- Needs a WordPress webhook -> Next.js API route -> IndexNow API implementation

### 1.9 Sitemap (75/100)

**Strengths:**
- Dynamic generation via `/src/app/sitemap.ts`
- 98 URLs, well under 50k limit
- Referenced in robots.txt
- Author pages filtered by description length

**Issues:**

| Issue | Severity | Details |
|---|---|---|
| `lastModified: new Date()` on static pages | Medium | All static pages report as modified on every deploy; Google will deprioritize `lastmod` signals |
| Paris tour page missing from sitemap | Medium | `/tour/paris-private-experience/` returns 200 but not in sitemap |
| URL count discrepancy | Low | Reported 104, actual live count is 98 |
| `priority` and `changefreq` tags | Low | Google ignores both - remove to reduce file weight |
| Cartagena and Barcelona have 0 travel guide articles | Info | Content gap for these cities |

---

## 2. Content Quality & E-E-A-T (63/100)

### 2.1 E-E-A-T Breakdown

**Experience (14/20):**
- Named local guides on city pages (Lu, Denis, Chiara, Maya for BA)
- Customer reviews displayed with star ratings, names, dates
- Homepage "Memories" gallery with 10 customer photos
- Company timeline (OurStory component) from 1998-2025
- Gap: Guide cards have 1-3 sentence bios with no depth, no link to full profiles
- Gap: Memories images have no captions, no user attribution, no alt text

**Expertise (16/25):**
- Co-founder bios: Guille Borthwick (ex-IBM), Alex Pels (Michelin-recognized restaurant creator)
- 70+ travel guide articles with individual author attribution
- Team includes tourism professionals and digital marketing specialist
- Gap: Author pages (`/author/[user]/page.tsx`) have no structured presentation - just avatar, description paragraph, post list
- Gap: `ProfilePage` schema omits `sameAs`, `jobTitle`, `knowsAbout`, `hasCredential`
- Gap: No `Person` schema for co-founders on About page

**Authoritativeness (14/25):**
- TripAdvisor #1 Best of the Best award
- Forbes "Featured In" logo
- UK registered company (UK00004135333)
- `sameAs` with Facebook, Instagram, TikTok, TripAdvisor
- Gap: "As Featured In" images have no accessible text, no links to actual press articles
- Gap: TripAdvisor `sameAs` uses Buenos Aires-specific URL for global Organization entity
- Gap: No LinkedIn, no Wikipedia, no GBP URLs in sameAs
- Gap: No Viator, GetYourGuide, or Airbnb Experiences profiles linked

**Trustworthiness (17/30):**
- UK trademark registration in footer
- Cookie consent (Cookiebot) + GDPR consent mode
- Email in schema (`info@sherpafoodtours.com`) but not visible on any page
- HTTPS enforced
- Gap: **No physical address on any page**
- Gap: **No phone number anywhere on the site**
- Gap: **No Privacy Policy link in footer or navigation**
- Gap: **No Terms of Service link**
- Gap: **No refund/cancellation policy page**
- Gap: Contact page has only a Tally form with no visible email, phone, or address

### 2.2 Content Depth

| Page Type | Word Count | Assessment |
|---|---|---|
| Homepage | ~400-500 (hero + sections) | Borderline thin - depends on WP content field |
| City pages | 2,800-4,000 | Strong |
| Tour pages | 300-500 | Borderline - depends on `tour_description` ACF field |
| Travel guide articles | 1,800-2,000+ | Good |
| About Us | 1,200-1,400 | Adequate |
| Travel Guide Hub | 200-300 (listing interface) | Thin - card excerpts, not original copy |
| Contact | ~30 words (one H2 + form) | Critical - extremely thin |

### 2.3 Readability Issues

| Issue | Severity | File |
|---|---|---|
| Homepage meta description: "Sherpa isnt just a food tour" | Critical | WordPress content (missing apostrophe) |
| "Por:" (Spanish) in English articles | High | `travel-guide/[city]/[slug]/page.tsx` line 324 |
| About H1: `<div>` inside `<h1>` (invalid HTML) | High | `about-us/page.tsx` lines 191-196 |
| Tour descriptions split on `\r\n` with `<p><br/>` | Medium | `tour/[slug]/page.tsx` lines 482-489 |
| H6 "EXPLORE OUR CITIES" on homepage | Low | Incorrect heading hierarchy |
| "Mexico city" (lowercase c) inconsistent | Low | Some schemas and H1s |

### 2.4 AI Citation Readiness (41/100 per Content agent)

- No `speakable` schema property anywhere
- Organization schema missing `foundingDate`, `numberOfEmployees`, `areaServed`, `knowsAbout`
- No "key facts" summary boxes in articles
- No structured comparison tables
- CollectionPage ItemList only includes 9 of 70+ articles
- No question-based H2/H3 headings in travel guides
- Statistics scattered in text without inline source attribution

---

## 3. On-Page SEO (60/100)

### 3.1 Title Tags

| Page | Title | Length | Issue |
|---|---|---|---|
| Homepage | "Taste, Share and Explore what locals love \| Sherpa Food Tours - Authentic Culinary Experiences" | 94 chars | Too long (truncated in SERPs) |
| City pages | "[City] Food Tours & Local Culinary Experiences \| Sherpa Food Tours" | 69-72 chars | Slightly long, identical template |
| Travel Guide | "Travel Guide - Food, Drinks & Experiences \| Sherpa Food Tours" | 61 chars | Good |
| About Us | "About Us - Our Story & Values \| Sherpa Food Tours" | 50 chars | Good |
| Contact | "Contact Us - Get in Touch \| Sherpa Food Tours" | 46 chars | Good |

### 3.2 Heading Structure Issues

| Page | Issue | Severity |
|---|---|---|
| Contact | No H1 (only H2) | Critical |
| About Us | H1 contains `<div>` with logo image (invalid HTML) | High |
| Mexico City | H1 "Mexico city food tour" (lowercase c) | Low |
| Travel Guide Hub | H1 "The travel guide" (generic, not keyword-optimized) | Medium |
| Homepage | H6 "EXPLORE OUR CITIES" (wrong level) | Low |

### 3.3 Internal Linking

**Issues:**

| Issue | Severity | Details |
|---|---|---|
| Homepage city links use hardcoded absolute URLs | High | `page.tsx` line 433 - should use `<Link href="/city/...">` |
| No cross-city linking on city pages | Medium | No "similar experiences in other cities" section |
| "Partner With Us" and "Careers" both -> `/contact/` | Low | Distinct intents sharing one generic page |
| "View the experience" CTA links to wrong anchor | Medium | Points to `#as-feature-in` section instead of tour listings |
| No link to About Us from city pages | Low | Missed E-E-A-T reinforcement |

### 3.4 Open Graph Issues

| Issue | Severity | Details |
|---|---|---|
| og:image URLs use staging domain | Critical | City pages and articles point to `staging.sherpafoodtours.com` |
| `og:type: "article"` on tour pages | High | Tour pages are product/booking pages, not editorial |
| FacebookBot blocked | Critical | Even correct OG tags can't be crawled |

---

## 4. Schema / Structured Data (65/100)

### 4.1 Current Implementation

| Page | Schemas | Status |
|---|---|---|
| Homepage | TravelAgency, WebSite | Issues found |
| City Pages | BreadcrumbList, TouristDestination, TourOperator, FAQPage | Issues found |
| Tour Pages | TouristTrip (with Offer + AggregateRating), BreadcrumbList | Issues found |
| Travel Guide Hub | CollectionPage + ItemList, BreadcrumbList | Issues found |
| Blog Articles | Article, BreadcrumbList, VideoObject (some) | Critical issue |
| Author Pages | ProfilePage + Person, BreadcrumbList | Sparse |
| About Us | Organization, BreadcrumbList | Redundant |
| Contact | **None** | Missing |

### 4.2 Critical Schema Issues

| Issue | Severity | File | Details |
|---|---|---|---|
| Duplicate Article markup (JSON-LD + Microdata) | Critical | `travel-guide/[city]/[slug]/page.tsx` | `<article>` has `itemScope itemType` + `itemProp` attrs alongside complete JSON-LD. Google warns against mixing formats for same entity. Remove Microdata attrs. |
| `offers.price` NaN risk | Critical | `tour/[slug]/page.tsx` line 346 | `Number(price)` returns NaN if price is undefined/empty. NaN serializes as null - invalid Offer. |
| Tour URL missing trailing slash | Critical | `tour/[slug]/page.tsx` line 222 | `tourUrl` lacks trailing `/`, mismatching `alternates.canonical`. Schema URL treated as different resource. |
| Relative logo URL in CollectionPage | Critical | `travel-guide/page.tsx` line 120 | `"/sherpa-complete-logo.webp"` is relative - invalid in JSON-LD. |
| Review count contradicts page UI | Critical | `page.tsx` homepage | Schema: 4,649. UI: "2,000" + "15,000". Three different numbers. |
| AggregateRating on Organization | High | `page.tsx` homepage | No rich result for rating on Organization type. Should be on Product/Service. |
| TripAdvisor sameAs is city-specific | High | `page.tsx` homepage | Buenos Aires URL used for global Organization entity |
| No SearchAction on WebSite | High | `page.tsx` homepage | Missing Sitelinks Searchbox opportunity |
| Contact page: zero structured data | Medium | `contact/page.tsx` | No schema at all |
| TourOperator address missing `addressCountry` | Medium | `city/[slug]/page.tsx` | Only `addressLocality`, no country code |
| `ratingCount` vs `reviewCount` | Medium | `tour/[slug]/page.tsx` | Google prefers `reviewCount` for star display |
| FAQPage on commercial pages | Info | `city/[slug]/page.tsx` | No Google rich result since Aug 2023 restriction. Retain for GEO value. |

### 4.3 Missing Schema Opportunities

| Schema | Where | Impact |
|---|---|---|
| ContactPage + BreadcrumbList | Contact page | Medium |
| LocalBusiness per city with geo coordinates | City pages | High |
| Product/Offer with pricing | Tour pages (enhance existing) | High |
| Person for co-founders | About page | High |
| Person `knowsAbout`/`jobTitle` | Author pages | Medium |
| ItemList per venue | Travel guide articles (e.g., 7 taquerias) | Medium |
| HowTo / itinerary steps | Tour pages | Low |

---

## 5. Performance (62/100)

### 5.1 Server Performance

| Metric | Value | Assessment |
|---|---|---|
| Server | Vercel Edge Network | Excellent |
| Edge cache | `x-vercel-cache: HIT` | Good |
| Pre-rendering | `x-nextjs-prerender: 1` | Excellent |
| Page size | 108KB (HTML) | Acceptable |
| Stale time | 300 seconds | Good |

### 5.2 Critical Performance Issues

**Dual LCP Image Pattern (MainImage component):**
- File: `src/ui/components/main-image.tsx`
- Two `<Image>` elements stacked: local placeholder + WordPress hero
- Both marked `priority` + `fetchPriority="high"`
- Browser told to prioritize TWO large images equally
- WordPress image from staging subdomain = extra DNS lookup
- Hero preload commented out (`page.tsx` lines 283-299)
- Image visibility gated by React state (requires JS hydration)

**Third-Party Script Load:**
- GTM, Cookiebot, FareHarbor, Facebook Pixel, TikTok Analytics, Reddit Pixel (6+ scripts)
- FareHarbor script loads globally via `FareharborScript` component

**Image Loading Issues:**
- "As Featured In" logos use `loading="eager"` + `fetchPriority="high"` but are below fold
- Memories gallery images have no `width`/`height` attributes (CLS risk)

### 5.3 Font Loading (Good)

| Font | Format | Strategy |
|---|---|---|
| DK Otago | WOFF2 | `display: 'swap'` |
| Excelsior | WOFF2 | `display: 'swap'` |
| Excelsior Italic | WOFF2 | `display: 'swap'` |

---

## 6. Images (54/100)

### 6.1 Alt Text Coverage: 52%

- Total images on homepage: ~38
- Images WITH alt text: ~20
- Images WITHOUT alt text: ~18

**Root cause:** `wp.getPostImage()` in `src/lib/wp.ts` line 129 falls back to `alt: ""` when WordPress media has no alt text set. Empty string propagates silently to all components.

**Missing alt text locations:**
- 8 country flag icons in navigation
- 6 gallery/memories section images
- 2 experience section images
- 2 "featured in" logos (Google, Group.png)

**Alt text errors:**
- Footer logo: "Shera complete logo" -> should be "Sherpa Food Tours logo" (typo in `footer.tsx` line 24)

### 6.2 Staging Domain Issue (Critical)

- `NEXT_PUBLIC_WP_URL` environment variable points to staging server
- `normalizeWpImageUrl()` in `wp.ts` rewrites ALL image URLs to staging domain
- 30+ images served cross-origin from staging
- og:image URLs in schema point to staging domain
- No CDN optimization on staging images
- "staging" in URLs signals unfinished site to quality raters

**Fix:** Set `NEXT_PUBLIC_WP_URL` to `https://www.sherpafoodtours.com` in production environment variables. No code change needed.

### 6.3 Raw `<img>` Tags vs Next.js `<Image>`

Only the hero image in `main-image.tsx` uses Next.js `<Image>` component. ALL other images use raw `<img>` tags, forfeiting:
- Automatic `srcset` for responsive images
- Automatic format conversion (AVIF/WebP via `next.config.ts`)
- Lazy loading by default
- CLS prevention via reserved dimensions

**Affected:** City cards, featured logos, experience section, memories gallery, travel guide thumbnails, footer logo, social icons.

### 6.4 Format Optimization

- Majority: WebP (good)
- Flag icons: PNG (should be SVG)
- Some photos: JPG/JPG (should be WebP)
- At least one `.JPG` uppercase extension (inconsistent)

---

## 7. AI Search Readiness / GEO (71/100)

### 7.1 AI Crawler Access

| Crawler | Status | Impact |
|---|---|---|
| GPTBot | Allowed | ChatGPT can cite |
| OAI-SearchBot | Allowed | ChatGPT real-time search |
| Google-Extended | Allowed | Google AI Overviews |
| PerplexityBot | Allowed | Perplexity citations |
| CCBot | Blocked | Training opt-out (intentional) |
| anthropic-ai | Blocked | Training opt-out (intentional) |
| cohere-ai | Blocked | Training opt-out |
| FacebookBot | Blocked | Costs Meta AI visibility |
| ClaudeBot | Not listed | Falls under wildcard (allowed) but unmanaged |

### 7.2 llms.txt (Present - Partial)

**Strengths:**
- Correct markdown format with clear H1
- Lists all 8 city tour pages
- States explicit citation permissions
- Includes structured Key Facts

**Gaps:**
- Only 3 of 72 travel guide articles listed by name
- No `/llms-full.txt` companion file
- No RSL 1.0 license block
- Author pages not listed
- Stale URL: `/city/buenos-aires-2/` (old slug requiring redirect)

### 7.3 Citability Analysis

**Strengths:**
- FAQ sections on city pages: direct, specific, self-contained answers
- Article content includes specific details (restaurant names, prices)
- TripAdvisor #1 claim is highly citable
- `TravelAgency` schema with entity `@id` anchoring

**Weaknesses:**
- Homepage first 60 words contain no extractable factual claim (tagline-first, not facts-first)
- No structured summary/key facts boxes in articles
- No YouTube channel or video content (0.737 correlation with AI citation frequency)
- No Wikipedia entity page
- No LinkedIn company profile in sameAs
- Review count inconsistency confuses AI systems trying to establish canonical numbers

### 7.4 Platform-Specific Scores

| Platform | Score | Key Factor |
|---|---|---|
| Google AI Overviews | 74/100 | Google-Extended allowed, FAQPage schema, ISR |
| Perplexity AI | 72/100 | PerplexityBot allowed, good article structure |
| ChatGPT | 68/100 | Both bots allowed. Gap: no Wikipedia, no Reddit presence |
| Bing Copilot | 66/100 | No Bing Webmaster Tools, no MSN presence |

---

## 8. Local SEO (38/100)

### 8.1 Critical Local SEO Gaps

| Issue | Severity | Impact |
|---|---|---|
| No confirmed GBP profiles for any city | Critical | Cannot rank in local pack |
| No physical address anywhere on site | Critical | No NAP consistency possible |
| No phone number anywhere | Critical | Missing required LocalBusiness property |
| Business name inconsistency (4 variants) | Critical | "Sherpa Food Tours" vs "Sherpa Food Tours LLC" vs "Sherpa Food Tours International LTD" vs "Sherpa Food Tours - [City] Food Tour" |
| No geo coordinates in schema | High | Missing primary location signal for SAB |
| No per-city AggregateRating | High | Missing city-level review signals |
| Only 1 of 8 TripAdvisor listings linked | High | Buenos Aires only in sameAs |
| Homepage uses `TravelAgency` type | Medium | Should be `TourOperator` (matches city page type) |
| No Google Maps embeds on city pages | Medium | Missing visual location signals |
| No meeting point addresses | Medium | Critical pre-booking info missing for tour operators |

### 8.2 Multi-Location Page Quality (60/100)

**Strong:** Unique content per city, named guides, city-specific FAQs, linked travel guides
**Weak:** No maps, no directions, no per-city reviews, no GBP links, no hreflang

---

## 9. Search Experience / SXO Assessment

### 9.1 Page-Type Mismatch Analysis

| Page | Target Keyword | SERP Dominant Type | Current Type | Mismatch |
|---|---|---|---|---|
| Homepage | "food tours" | Operator hub / aggregator | Brand storytelling | HIGH |
| BA City Page | "buenos aires food tour" | Comparison listicle / aggregator | Operator sales page | MEDIUM |
| Travel Guide Hub | "food travel guide" | Long-form editorial pillar | Content index/filter | HIGH |
| Michelin Tacos Article | "michelin tacos mexico city" | Listicle review | Listicle review | ALIGNED |

**Key finding:** Sherpa's BA city page (`/city/buenos-aires/`) is NOT ranking for "buenos aires food tour". Third-party blog reviews of Sherpa outrank Sherpa's own pages because they match the comparison intent Google rewards.

### 9.2 Persona Scores

| Persona | Score | Key Gap |
|---|---|---|
| Corporate Planner | 25/100 | Zero B2B content. No corporate page, no group pricing, no case studies |
| Group Organizer | 44/100 | Private tour buried as 3rd listing. No group inquiry form |
| First-Time Tourist | 56/100 | FAQ buried below fold. No "What to Expect" visual section |
| Deal-Seeker | 62/100 | Value proposition unclear. No cost-per-tasting calculation |
| Foodie Traveler | 69/100 | Strong content but guide credentials not prominently surfaced |

### 9.3 Conversion Path Issues

| Step | Issue |
|---|---|
| Homepage CTA | "Book Now" without city context = friction for new users |
| City page CTA | "View the experience" links to `#as-feature-in` (logos section), not tour listings |
| Travel guide | No mid-content booking CTA except on some articles |
| Booking flow | FareHarbor redirect leaves site; no on-site availability calendar |

---

## Appendix A: Files Examined by Subagents

| File | Audited By |
|---|---|
| `src/app/page.tsx` | Technical, Content, Schema, SXO, Image |
| `src/app/robots.ts` | Technical, GEO |
| `src/app/sitemap.ts` | Technical, Sitemap |
| `src/app/layout.tsx` | Technical, Content |
| `src/app/contact/page.tsx` | Technical, Content, Schema |
| `src/app/contacto/page.tsx` | Technical |
| `src/app/about-us/page.tsx` | Content, Schema |
| `src/app/city/[slug]/page.tsx` | Technical, Content, Schema, Local, SXO |
| `src/app/tour/[slug]/page.tsx` | Technical, Content, Schema |
| `src/app/travel-guide/page.tsx` | Content, Schema, SXO |
| `src/app/travel-guide/[city]/[slug]/page.tsx` | Content, Schema |
| `src/app/author/[user]/page.tsx` | Content, Schema |
| `src/ui/components/main-image.tsx` | Technical (LCP) |
| `src/ui/components/footer.tsx` | Technical, Image |
| `src/ui/components/as-featured-in.tsx` | Image |
| `src/ui/components/meet-local-guides.tsx` | Content |
| `src/ui/components/faq-section.tsx` | Content, GEO |
| `src/lib/wp.ts` | Technical, Image |
| `next.config.ts` | Technical |
| `public/llms.txt` | GEO |
| `public/7dfb42f3ecf3e85a1fcfeb72e91270ff.txt` | Technical (IndexNow) |

## Appendix B: HTTP Security Headers

```
strict-transport-security: max-age=63072000; includeSubDomains; preload
content-security-policy: [comprehensive - see technical section]
x-frame-options: DENY
x-content-type-options: nosniff
referrer-policy: origin-when-cross-origin
permissions-policy: camera=(), microphone=(), geolocation=()
x-dns-prefetch-control: on
access-control-allow-origin: *
```
