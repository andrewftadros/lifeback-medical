# LifeBack Medical Website Migration — Design Spec

**Date**: 2026-03-15
**Status**: Reviewed
**Domain**: lifebackmedical.com

## Overview

Migrate lifebackmedical.com from Wix to a self-owned Astro static site deployed on Cloudflare Pages. Full redesign following 2026 medical website design trends — clean, calming, mobile-first, patient-centered. Existing Wix booking system remains active and is linked from the new site.

## Current State

- **Platform**: Wix (Thunderbolt renderer)
- **Registrar**: GoDaddy (expires 2027-03-03)
- **DNS**: Wix DNS (ns4/ns5.wixdns.net)
- **Pages**: ~20 (home, 12 services, doctors, locations, testimonials, blog, book online, contact, downloads, surgery prep)
- **Features**: Wix Booking (2 appointment types), Wix Chat, contact form, insurance logos, social media links
- **Booking URLs**: `/service-page/one-on-one-consultation`, `/service-page/free-phone-consult-with-dr-sedrak`
- **Blog URLs**: `/post/[slug]` (22 existing posts)

## Target State

- **Platform**: Astro 5.x static site
- **Hosting**: Cloudflare Pages (free tier)
- **DNS**: Cloudflare (migrated from Wix DNS)
- **Styling**: Tailwind CSS 3.x
- **Contact form**: Web3Forms (free, no backend)
- **Booking**: External links to existing Wix booking (kept running)
- **Blog**: Astro Content Collections (markdown files)
- **Tracking**: Reachcode script in global `<head>`, Cloudflare Web Analytics

## Design System

### Color Palette

| Role | Color | Hex |
|---|---|---|
| Primary | Deep Teal | `#0D7377` |
| Primary Light | Soft Teal | `#14919B` |
| Accent | Warm Gold | `#D4A843` |
| Dark | Charcoal | `#1A1A2E` |
| Light BG | Warm White | `#FAFAF8` |
| Card BG | Soft Gray | `#F3F4F6` |
| Text | Dark Gray | `#2D3748` |
| Muted Text | Medium Gray | `#6B7280` |
| Success | Green | `#10B981` |
| White | Pure White | `#FFFFFF` |

### Typography

- **Font**: Inter (Google Fonts)
- **Headings**: 700 weight
- **Body**: 400 weight
- **CTA/Accent**: 600 weight

### Design Principles

- Generous whitespace between sections
- Rounded corners (12px) on cards and buttons
- Subtle box shadows on cards
- Full-width hero sections with text overlay
- 8px spacing grid (Tailwind default)
- Subtle fade-in on scroll via Intersection Observer API (vanilla JS in `<script>` tags)
- Smooth hover transitions via CSS
- Mobile-first responsive design

## Site Architecture

### Pages

```
/                              Homepage
/services                      Services overview grid
/services/vein-repair          Individual service (x12)
/services/weight-loss
/services/sleep-studies
/services/cancer-prevention
/services/heartburn-relief
/services/knee-back-pain
/services/hernia-repair
/services/gallbladder-surgery
/services/hemorrhoid-procedures
/services/plastic-surgery
/services/colon-appendix-surgery
/services/corporate-wellness
/doctors                       Meet Our Doctors
/locations                     Office locations with map
/testimonials                  Patient testimonials + before/after photos
/blog                          Blog listing with pagination
/blog/[slug]                   Individual blog posts
/book-online                   Redirect to Wix booking
/contact                       Dedicated contact page
/preparing-for-surgery         Pre-surgery guide
/downloads                     Downloadable resources library
/404                           Custom 404 page
```

### Navigation

```
[Logo]  HOME  SERVICES(dropdown)  DOCTORS  LOCATIONS  TESTIMONIALS  BLOG  [Book Now CTA]  [Phone]
```

- SERVICES dropdown lists all 12 service links
- Book Now is a prominent teal CTA button linking to Wix booking
- Phone number always visible in header
- Mobile: hamburger menu with full navigation

### Footer

- Column 1: Contact info (phone, email, hours: Mon-Sat 9am-7pm)
- Column 2: Quick links to key pages
- Column 3: Social media (Instagram, Facebook, YouTube) for both LifeBack Medical and LifeBack Weight Loss
- Column 4: Contact form (Web3Forms)
- Bottom bar: Copyright 2012-2026 Life Back Medical

## Page Layouts

### Homepage

1. **Hero**: Full-width image/gradient, headline "Get Your Life Back", subtitle, two CTAs (Book Appointment, Call Us)
2. **Trust Bar**: 4 stats — Years in Practice, Patients Served, Services Offered, Locations
3. **Services Grid**: 3x4 grid (desktop), 1-col (mobile). Each card: icon/image + title + 1-line description. "View All Services" link
4. **Why Choose Us**: Split layout — clinic image left, 4 bullet points right (board-certified, minimally invasive, PPO accepted, same-week appointments). "Meet Our Doctors" link
5. **CTA Banner**: Teal background, "Ready to feel like yourself again?", Book consultation button
6. **Testimonials Carousel**: 3 rotating cards with quote, patient name, star rating. "Read More Stories" link
7. **Insurance Bar**: "We accept nearly all PPO plans" + logo grid
8. **Blog Preview**: Latest 3 posts as cards. "Visit Our Blog" link
9. **Footer**

### Individual Service Page

1. **Short Hero**: Service name + breadcrumb navigation
2. **Overview**: Split layout — description text left, relevant image right
3. **What to Expect**: 3-step process with icons (Consultation, Treatment, Recovery)
4. **CTA Banner**: Book consultation + Call Us buttons
5. **Related Services**: 3 service cards linking to other procedures
6. **Footer**

### Doctors Page

1. **Hero**: "Meet Our Doctors"
2. **Doctor Cards**: Large photo + name + specialty + credentials + detailed bio + "Book with Dr. X" button
3. **CTA Banner**
4. **Footer**

### Blog Listing

1. **Hero**: "Health & Wellness Blog"
2. **Featured Post**: Full-width card for latest post
3. **Post Grid**: 3-column grid with image + title + date + excerpt
4. **Pagination**
5. **Footer**

### Contact Page

1. **Hero**: "Contact Us"
2. **Two-column layout**: Contact form left, info right (phone, email, hours, address, embedded map)
3. **Footer**

## Component Library

| Component | Purpose |
|---|---|
| `BaseLayout.astro` | HTML shell, `<head>` (Reachcode, fonts, meta), header, footer |
| `Header.astro` | Sticky nav, logo, links, services dropdown, phone, Book Now CTA, mobile hamburger |
| `Footer.astro` | Multi-column footer with contact, links, social, form, copyright |
| `HeroSection.astro` | Full-width hero with configurable image/gradient, heading, subtitle, CTA buttons |
| `ServiceCard.astro` | Image + title + short description + "Learn More" link |
| `DoctorCard.astro` | Photo + name + specialty + bio + booking button |
| `TestimonialCard.astro` | Quote + patient name + star rating |
| `CTABanner.astro` | Full-width colored banner with heading + button |
| `ContactForm.astro` | Web3Forms integration — name, email, phone, message, honeypot spam field, submit |
| `InsuranceBar.astro` | Grid/scroll of insurance logos |
| `BlogPostCard.astro` | Featured image + title + date + excerpt |
| `TrustBar.astro` | Row of 4 stat counters |

## Content Collection Schemas

Defined in `src/content.config.ts` using Zod:

### Services Schema

```ts
{
  title: z.string(),
  slug: z.string(),
  description: z.string(),           // Short description for cards/meta
  image: z.string(),                  // Path to service image
  icon: z.string().optional(),        // Icon identifier for grid display
  order: z.number(),                  // Display order in grid
  relatedServices: z.array(z.string()).optional(), // Slugs of related services
}
```

### Blog Schema

```ts
{
  title: z.string(),
  date: z.coerce.date(),
  excerpt: z.string(),
  image: z.string().optional(),
  author: z.string().default("Life Back Medical"),
  tags: z.array(z.string()).optional(),
}
```

## Project Structure

```
lifeback/
├── astro.config.mjs
├── tailwind.config.mjs              # Tailwind 3.x JS config
├── package.json
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── HeroSection.astro
│   │   ├── ServiceCard.astro
│   │   ├── DoctorCard.astro
│   │   ├── TestimonialCard.astro
│   │   ├── CTABanner.astro
│   │   ├── ContactForm.astro
│   │   ├── InsuranceBar.astro
│   │   ├── BlogPostCard.astro
│   │   └── TrustBar.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── services/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── doctors.astro
│   │   ├── locations.astro
│   │   ├── testimonials.astro
│   │   ├── contact.astro
│   │   ├── preparing-for-surgery.astro
│   │   ├── downloads.astro
│   │   ├── book-online.astro
│   │   └── blog/
│   │       ├── index.astro
│   │       └── [slug].astro
│   ├── content.config.ts              # Zod schemas for collections
│   ├── assets/
│   │   └── images/                    # Optimized via Astro <Image>
│   │       ├── doctors/
│   │       ├── services/
│   │       └── testimonials/
│   ├── content/
│   │   ├── services/
│   │   │   ├── vein-repair.md
│   │   │   ├── weight-loss.md
│   │   │   ├── sleep-studies.md
│   │   │   ├── cancer-prevention.md
│   │   │   ├── heartburn-relief.md
│   │   │   ├── knee-back-pain.md
│   │   │   ├── hernia-repair.md
│   │   │   ├── gallbladder-surgery.md
│   │   │   ├── hemorrhoid-procedures.md
│   │   │   ├── plastic-surgery.md
│   │   │   ├── colon-appendix-surgery.md
│   │   │   └── corporate-wellness.md
│   │   └── blog/
│   │       └── (migrated posts)
│   └── styles/
│       └── global.css
├── public/
│   ├── images/
│   │   └── insurance/                 # Static images (not optimized)
│   ├── downloads/                     # Patient PDFs
│   ├── favicon.ico
│   └── _redirects                     # Cloudflare Pages redirect rules
└── docs/
    └── superpowers/
        └── specs/
```

## Content Migration

1. Scrape all ~20 Wix pages (text + images) using browser automation
2. Extract text into markdown files under `src/content/`
3. Download images into `src/assets/images/` organized by category (for Astro `<Image>` optimization)
4. Static assets (insurance logos, PDFs) go in `public/`
5. Set up redirects via `public/_redirects` for Cloudflare Pages (see Redirect Map below)

## Redirect Map (Cloudflare Pages `_redirects` file)

All old Wix URLs must redirect to new paths to preserve SEO equity and avoid broken links.

### Service Pages (top-level → nested under /services/)

| Old Wix Path | New Path | Status |
|---|---|---|
| `/vein-repair` | `/services/vein-repair` | 301 |
| `/weightloss` | `/services/weight-loss` | 301 |
| `/sleep-studies-and-treatments` | `/services/sleep-studies` | 301 |
| `/cancer-prevention` | `/services/cancer-prevention` | 301 |
| `/heartburn-relief` | `/services/heartburn-relief` | 301 |
| `/knee-and-back-pain-treatments` | `/services/knee-back-pain` | 301 |
| `/hernia-repair` | `/services/hernia-repair` | 301 |
| `/gallbladder-surgery` | `/services/gallbladder-surgery` | 301 |
| `/hemorrhoid-procedures` | `/services/hemorrhoid-procedures` | 301 |
| `/plastic-surgery` | `/services/plastic-surgery` | 301 |
| `/colon-and-appendix-surgeries` | `/services/colon-appendix-surgery` | 301 |
| `/corporate-wellness` | `/services/corporate-wellness` | 301 |

### Other Pages

| Old Wix Path | New Path | Status |
|---|---|---|
| `/lifebackmedicalservices` | `/services` | 301 |
| `/meet-our-medical-director` | `/doctors` | 301 |
| `/stories` | `/testimonials` | 301 |
| `/before-and-afters` | `/testimonials` | 301 |
| `/downloads-library` | `/downloads` | 301 |

### Blog Posts

| Old Wix Path | New Path | Status |
|---|---|---|
| `/post/*` | `/blog/*` | 301 |

All 22 existing blog posts use `/post/[slug]` on Wix and must redirect to `/blog/[slug]`.

### Booking

| Old Wix Path | New Path | Status |
|---|---|---|
| `/service-page/*` | Wix direct URL (`*.wixsite.com/...`) | 301 |
| `/booking-calendar/*` | Wix direct URL | 301 |

## Third-Party Integrations

| Integration | Service | Config |
|---|---|---|
| Contact form | Web3Forms | API key in form `<input type="hidden">` |
| Booking | Wix Booking (existing) | External link to Wix direct URL (`*.wixsite.com/.../service-page/...`) |
| Tracking | Reachcode | `<script>` in `BaseLayout.astro` `<head>` |
| Analytics | Cloudflare Web Analytics | Auto-enabled on Cloudflare Pages |
| Fonts | Google Fonts (Inter) | Preloaded in `<head>` |

## DNS Cutover Plan

1. Build and test site on Cloudflare Pages preview URL
2. Add `lifebackmedical.com` to Cloudflare account (get new nameservers)
3. At GoDaddy, change nameservers from Wix DNS to Cloudflare
4. In Cloudflare DNS, add CNAME records pointing to Cloudflare Pages
5. Wix booking remains accessible via direct Wix URLs (e.g., `lifebackmedical.com/booking-calendar/...` will need to be handled — see note below)
6. SSL auto-provisioned by Cloudflare

### Booking URL Handling

When DNS moves to Cloudflare, the Wix booking paths (`/booking-calendar/...`) will no longer resolve to Wix. Two options:

- **Option A**: Change booking links to point to the Wix site's direct URL (e.g., `username.wixsite.com/lifebackmedical/booking-calendar/...`)
- **Option B**: Set up a Cloudflare redirect rule for `/booking-calendar/*` to the Wix booking URL

Option A is simpler and recommended.

### Wix Subscription Requirement

The Wix premium plan **must remain active** for booking to continue working. If the Wix subscription is cancelled in the future, booking must first be migrated to an alternative (Cal.com, Calendly, etc.).

### Staging Precautions

During development, preview deployments on Cloudflare Pages should include `<meta name="robots" content="noindex">` to prevent premature indexing. Remove this only when going live on the production domain.

### Post-Migration Tasks

- Update Google Business Profile with new website URL if needed
- Verify Google Search Console for the domain under Cloudflare
- Monitor 404s in Cloudflare analytics for missing redirects

## SEO Considerations

- Redirect old Wix URLs to new paths where they differ
- Proper `<meta>` tags (title, description) on every page
- Open Graph + Twitter Card meta for social sharing
- Semantic HTML (proper heading hierarchy, landmarks)
- `sitemap.xml` auto-generated by Astro
- `robots.txt` allowing all crawlers
- Structured data (LocalBusiness schema) for Google Knowledge Panel

## Accessibility

- WCAG 2.1 AA compliance target
- Semantic HTML throughout
- Keyboard navigation for all interactive elements
- Sufficient color contrast ratios
- Alt text on all images
- Skip-to-content link
- Focus visible styles

## Out of Scope

- Patient portal
- Online payments
- Live chat replacement (Wix Chat will be lost)
- Email marketing integration
- Multi-language support
