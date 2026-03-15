# LifeBack Medical Website Migration — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild lifebackmedical.com as a static Astro site deployed on Cloudflare Pages, fully replacing the current Wix-hosted site with a modern, fast, mobile-first medical practice website.

**Architecture:** Astro 5.x generates static HTML from `.astro` page templates and markdown content collections. Tailwind 3.x provides utility-first styling with a custom medical theme. Web3Forms handles the contact form serverlessly. All old Wix URLs redirect via Cloudflare Pages `_redirects` file. Wix booking remains active via external links.

**Tech Stack:** Astro 5.x, Tailwind CSS 3.x, TypeScript, Web3Forms, Cloudflare Pages, Google Fonts (Inter)

**Spec:** `docs/superpowers/specs/2026-03-15-lifeback-medical-migration-design.md`

**Deviations from spec:**
- **Blog pagination**: Deferred to future iteration. With 22 posts, a single-page listing is acceptable for launch.
- **Testimonials carousel**: Implemented as a static 3-column grid instead of a rotating carousel. Better for accessibility and simpler to maintain.

---

## File Map

### Config & Root Files
| File | Responsibility |
|---|---|
| `package.json` | Dependencies: astro@5, @astrojs/tailwind, @astrojs/sitemap |
| `astro.config.mjs` | Astro config: site URL, integrations (tailwind, sitemap), output: static |
| `tailwind.config.mjs` | Custom theme: colors, fonts, border-radius per design system |
| `tsconfig.json` | TypeScript config, path aliases (`@components/*`, `@layouts/*`) |
| `src/styles/global.css` | Tailwind directives, Inter font import, base styles |
| `public/_redirects` | Cloudflare Pages redirect rules (30+ old Wix URLs → new paths) |
| `public/robots.txt` | Allow all crawlers |
| `.gitignore` | node_modules, dist, .astro, .firecrawl |

### Content Collections
| File | Responsibility |
|---|---|
| `src/content.config.ts` | Zod schemas for `services` and `blog` collections |
| `src/content/services/*.md` | 12 markdown files, one per medical service (frontmatter + body) |
| `src/content/blog/*.md` | Migrated blog posts from Wix (22 posts) |

### Layouts
| File | Responsibility |
|---|---|
| `src/layouts/BaseLayout.astro` | HTML shell: `<head>` (meta, OG, fonts, Reachcode, noindex for staging), skip-to-content, `<Header/>`, `<slot/>`, `<Footer/>`, scroll-fade JS |

### Components
| File | Responsibility |
|---|---|
| `src/components/Header.astro` | Sticky nav: logo, nav links, services dropdown, phone, Book Now CTA, mobile hamburger |
| *(Mobile menu is inline in Header.astro)* | Slide-out mobile navigation panel (toggled by hamburger) |
| `src/components/Footer.astro` | 4-column footer: contact info, quick links, social media, contact form, copyright |
| `src/components/HeroSection.astro` | Configurable full-width hero: gradient/image bg, heading, subtitle, CTA buttons |
| `src/components/ServiceCard.astro` | Card: image + title + description + "Learn More" link |
| `src/components/DoctorCard.astro` | Card: photo + name + specialty + bio + booking button |
| `src/components/TestimonialCard.astro` | Card: quote + patient name + star rating |
| `src/components/CTABanner.astro` | Full-width teal banner: heading + CTA button |
| `src/components/ContactForm.astro` | Web3Forms form: name, email, phone, message, honeypot, submit |
| `src/components/InsuranceBar.astro` | Grid of insurance provider logos with heading |
| `src/components/BlogPostCard.astro` | Card: image + title + date + excerpt |
| `src/components/TrustBar.astro` | 4-column stats row (years, patients, services, locations) |
| `src/components/Breadcrumb.astro` | Breadcrumb navigation for service/blog pages |

### Pages
| File | Responsibility |
|---|---|
| `src/pages/index.astro` | Homepage: hero, trust bar, services grid, why us, CTA, testimonials, insurance, blog preview |
| `src/pages/services/index.astro` | Services overview: hero + 12-card grid |
| `src/pages/services/[slug].astro` | Dynamic service page: hero, overview, what to expect, CTA, related services |
| `src/pages/doctors.astro` | Doctors page: hero + doctor cards + CTA |
| `src/pages/locations.astro` | Locations: hero + address/map + hours |
| `src/pages/testimonials.astro` | Testimonials: hero + testimonial cards grid |
| `src/pages/contact.astro` | Contact: hero + two-column form/info layout |
| `src/pages/blog/index.astro` | Blog listing: hero + featured post + grid + pagination |
| `src/pages/blog/[slug].astro` | Blog post: article layout with date, author, content |
| `src/pages/preparing-for-surgery.astro` | Static content page |
| `src/pages/downloads.astro` | Downloads library with PDF links |
| `src/pages/book-online.astro` | Redirect page to Wix booking |
| `src/pages/404.astro` | Custom 404 with navigation links |

### Static Assets
| Directory | Contents |
|---|---|
| `public/images/insurance/` | Insurance provider logos |
| `public/downloads/` | Patient PDFs |
| `public/favicon.ico` | Site favicon |
| `src/assets/images/doctors/` | Doctor photos (Astro-optimized) |
| `src/assets/images/services/` | Service images (Astro-optimized) |
| `src/assets/images/testimonials/` | Testimonial photos (Astro-optimized) |
| `src/assets/images/hero/` | Hero background images (Astro-optimized) |

---

## Chunk 1: Project Scaffold & Design System

### Task 1: Initialize Astro Project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`

- [ ] **Step 1: Create Astro project**

```bash
cd /home/andy/lifeback
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict
```

Select minimal template, TypeScript strict. This creates the base Astro scaffolding.

- [ ] **Step 2: Install dependencies**

```bash
cd /home/andy/lifeback
npm install astro@5 @astrojs/tailwind@latest @astrojs/sitemap@latest tailwindcss@3 @tailwindcss/typography
```

- [ ] **Step 3: Configure Astro**

Replace `astro.config.mjs` with:

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.lifebackmedical.com',
  output: 'static',
  integrations: [
    tailwind(),
    sitemap(),
  ],
});
```

- [ ] **Step 4: Update `.gitignore`**

Ensure it contains:

```
node_modules/
dist/
.astro/
.firecrawl/
```

- [ ] **Step 5: Update `tsconfig.json` with path aliases**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@content/*": ["src/content/*"],
      "@assets/*": ["src/assets/*"]
    }
  }
}
```

- [ ] **Step 6: Verify project builds**

```bash
cd /home/andy/lifeback && npx astro build
```

Expected: Build succeeds with no errors.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore src/
git commit -m "feat: initialize Astro project with Tailwind and sitemap"
```

---

### Task 2: Configure Tailwind Design System

**Files:**
- Create: `tailwind.config.mjs`
- Create: `src/styles/global.css`

- [ ] **Step 1: Create Tailwind config**

Create `tailwind.config.mjs`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0D7377',
          light: '#14919B',
        },
        accent: '#D4A843',
        dark: '#1A1A2E',
        'light-bg': '#FAFAF8',
        'card-bg': '#F3F4F6',
        text: '#2D3748',
        muted: '#6B7280',
        success: '#10B981',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
```

- [ ] **Step 2: Create global CSS**

Create `src/styles/global.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    @apply bg-light-bg text-text font-sans;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-bold text-dark;
  }

  a {
    @apply transition-colors duration-200;
  }
}

@layer components {
  .btn-primary {
    @apply inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-card
           hover:bg-primary-light transition-colors duration-200 focus:outline-none focus:ring-2
           focus:ring-primary focus:ring-offset-2;
  }

  .btn-accent {
    @apply inline-flex items-center justify-center px-6 py-3 bg-accent text-dark font-semibold rounded-card
           hover:brightness-110 transition-all duration-200 focus:outline-none focus:ring-2
           focus:ring-accent focus:ring-offset-2;
  }

  .btn-outline {
    @apply inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary font-semibold
           rounded-card hover:bg-primary hover:text-white transition-colors duration-200
           focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2;
  }

  .card {
    @apply bg-white rounded-card shadow-md hover:shadow-lg transition-shadow duration-300;
  }

  .section-padding {
    @apply py-16 md:py-24 px-4 md:px-8 lg:px-16;
  }

  .container-default {
    @apply max-w-7xl mx-auto;
  }

  /* Scroll fade-in animation */
  .fade-in {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }

  .fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }
}
```

- [ ] **Step 3: Verify Tailwind works**

```bash
cd /home/andy/lifeback && npx astro build
```

Expected: Build succeeds, Tailwind processes CSS.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.mjs src/styles/global.css
git commit -m "feat: add Tailwind design system with medical theme"
```

---

### Task 3: Create Content Collection Schemas

**Files:**
- Create: `src/content.config.ts`

- [ ] **Step 1: Create content config with Zod schemas**

Create `src/content.config.ts`:

```ts
import { defineCollection, z } from 'astro:content';

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    icon: z.string().optional(),
    order: z.number(),
    relatedServices: z.array(z.string()).optional(),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    image: z.string().optional(),
    author: z.string().default('Life Back Medical'),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { services, blog };
```

- [ ] **Step 2: Create placeholder service content file to validate schema**

Create `src/content/services/vein-repair.md`:

```markdown
---
title: "Vein Repair"
description: "Advanced vein treatments to restore comfort and confidence."
image: "/images/services/vein-repair.jpg"
order: 1
relatedServices: ["hernia-repair", "knee-back-pain"]
---

Placeholder content — will be replaced with scraped content from Wix.
```

- [ ] **Step 3: Create placeholder blog post to validate schema**

Create `src/content/blog/placeholder.md`:

```markdown
---
title: "Welcome to Our Blog"
date: 2026-01-01
excerpt: "Placeholder blog post for schema validation."
author: "Life Back Medical"
tags: ["general"]
---

Placeholder content — will be replaced with migrated Wix blog posts.
```

- [ ] **Step 4: Verify content collections build**

```bash
cd /home/andy/lifeback && npx astro build
```

Expected: Build succeeds, content collections are recognized.

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/content/
git commit -m "feat: add content collection schemas for services and blog"
```

---

### Task 4: Create Base Layout

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create BaseLayout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
interface Props {
  title: string;
  description?: string;
  ogImage?: string;
  noindex?: boolean;
}

const {
  title,
  description = 'Life Back Medical — Comprehensive medical services in Riverside County. Vein repair, weight loss, surgery, and more. Call 951-547-2056.',
  ogImage = '/images/og-default.jpg',
  noindex = false,
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);

import Header from '@components/Header.astro';
import Footer from '@components/Footer.astro';
import '@/styles/global.css';
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="canonical" href={canonicalURL} />

    <title>{title} | Life Back Medical</title>
    <meta name="description" content={description} />

    {noindex && <meta name="robots" content="noindex, nofollow" />}

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:title" content={`${title} | Life Back Medical`} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={`${title} | Life Back Medical`} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImage} />

    <!-- Google Fonts: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />

    <!-- Reachcode Tracking -->
    <script type="text/javascript" src="//cdn.rlets.com/capture_configs/748/879/bab/2d846a99ab34826f795addf.js" async="async"></script>

    <!-- LocalBusiness Structured Data -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "MedicalBusiness",
        "name": "Life Back Medical",
        "telephone": "+1-951-547-2056",
        "email": "info@lifebackmedical.com",
        "url": "https://www.lifebackmedical.com",
        "openingHours": "Mo-Sa 09:00-19:00",
        "sameAs": [
          "https://www.instagram.com/lifebackmedical/",
          "https://www.facebook.com/officallifebackmedical/",
          "https://www.youtube.com/channel/UCi5P11phorkXUYexj6CV--Q"
        ]
      }
    </script>
  </head>
  <body class="min-h-screen flex flex-col">
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-card">
      Skip to main content
    </a>

    <Header />

    <main id="main-content" class="flex-1">
      <slot />
    </main>

    <Footer />

    <!-- Scroll fade-in observer -->
    <script>
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      document.querySelectorAll('.fade-in').forEach((el) => {
        observer.observe(el);
      });
    </script>
  </body>
</html>
```

Note: This references `Header` and `Footer` which will be built in Tasks 5 and 6. For now the build will fail — that's expected. We build all components before verifying the full build.

- [ ] **Step 2: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add BaseLayout with meta, tracking, structured data, and scroll animations"
```

---

## Chunk 2: Core Components (Header, Footer, Reusable UI)

### Task 5: Build Header Component

**Files:**
- Create: `src/components/Header.astro`
- Create: `src/components/MobileMenu.astro`

- [ ] **Step 1: Create Header component**

Create `src/components/Header.astro`:

```astro
---
const services = [
  { name: 'Vein Repair', href: '/services/vein-repair' },
  { name: 'Weight Loss', href: '/services/weight-loss' },
  { name: 'Sleep Studies', href: '/services/sleep-studies' },
  { name: 'Cancer Prevention', href: '/services/cancer-prevention' },
  { name: 'Heartburn Relief', href: '/services/heartburn-relief' },
  { name: 'Knee & Back Pain', href: '/services/knee-back-pain' },
  { name: 'Hernia Repair', href: '/services/hernia-repair' },
  { name: 'Gallbladder Surgery', href: '/services/gallbladder-surgery' },
  { name: 'Hemorrhoid Procedures', href: '/services/hemorrhoid-procedures' },
  { name: 'Plastic Surgery', href: '/services/plastic-surgery' },
  { name: 'Colon & Appendix Surgery', href: '/services/colon-appendix-surgery' },
  { name: 'Corporate Wellness', href: '/services/corporate-wellness' },
];

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services', dropdown: services },
  { name: 'Doctors', href: '/doctors' },
  { name: 'Locations', href: '/locations' },
  { name: 'Testimonials', href: '/testimonials' },
  { name: 'Blog', href: '/blog' },
];

const currentPath = Astro.url.pathname;
---

<header class="sticky top-0 z-50 bg-white shadow-sm">
  <!-- Top bar with phone -->
  <div class="bg-dark text-white text-sm py-2 px-4 text-center">
    <span>Call or text us! </span>
    <a href="tel:9515472056" class="font-semibold hover:text-accent">951-547-2056</a>
  </div>

  <!-- Main nav -->
  <nav class="container-default flex items-center justify-between py-4 px-4 md:px-8" aria-label="Main navigation">
    <!-- Logo -->
    <a href="/" class="text-2xl font-bold text-primary">
      Life Back <span class="text-accent">Medical</span>
    </a>

    <!-- Desktop nav -->
    <ul class="hidden lg:flex items-center gap-6">
      {navLinks.map((link) => (
        <li class="relative group">
          <a
            href={link.href}
            class:list={[
              'text-sm font-semibold uppercase tracking-wide hover:text-primary transition-colors',
              currentPath === link.href || currentPath.startsWith(link.href + '/') ? 'text-primary' : 'text-dark',
            ]}
          >
            {link.name}
            {link.dropdown && (
              <svg class="inline-block w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </a>
          {link.dropdown && (
            <ul class="absolute top-full left-0 mt-2 w-64 bg-white rounded-card shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50">
              {link.dropdown.map((sub) => (
                <li>
                  <a href={sub.href} class="block px-4 py-2 text-sm text-text hover:bg-card-bg hover:text-primary transition-colors">
                    {sub.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>

    <!-- CTA + Mobile toggle -->
    <div class="flex items-center gap-4">
      <a href="/book-online" class="hidden md:inline-flex btn-primary text-sm">
        Book Now
      </a>

      <!-- Mobile hamburger -->
      <button
        id="mobile-menu-toggle"
        class="lg:hidden p-2 text-dark hover:text-primary"
        aria-label="Open menu"
        aria-expanded="false"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  </nav>

  <!-- Mobile menu -->
  <div id="mobile-menu" class="lg:hidden hidden fixed inset-0 z-50 bg-white overflow-y-auto">
    <div class="flex items-center justify-between p-4 border-b">
      <a href="/" class="text-2xl font-bold text-primary">
        Life Back <span class="text-accent">Medical</span>
      </a>
      <button id="mobile-menu-close" class="p-2 text-dark hover:text-primary" aria-label="Close menu">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <ul class="p-4 space-y-4">
      {navLinks.map((link) => (
        <li>
          <a href={link.href} class="block text-lg font-semibold text-dark hover:text-primary">
            {link.name}
          </a>
          {link.dropdown && (
            <ul class="mt-2 ml-4 space-y-2">
              {link.dropdown.map((sub) => (
                <li>
                  <a href={sub.href} class="block text-sm text-muted hover:text-primary">{sub.name}</a>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
      <li class="pt-4 border-t">
        <a href="/book-online" class="btn-primary w-full text-center">Book Now</a>
      </li>
      <li>
        <a href="tel:9515472056" class="btn-outline w-full text-center">Call 951-547-2056</a>
      </li>
    </ul>
  </div>
</header>

<script>
  const toggle = document.getElementById('mobile-menu-toggle');
  const close = document.getElementById('mobile-menu-close');
  const menu = document.getElementById('mobile-menu');

  toggle?.addEventListener('click', () => {
    menu?.classList.remove('hidden');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  });

  close?.addEventListener('click', () => {
    menu?.classList.add('hidden');
    toggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat: add Header with sticky nav, services dropdown, and mobile menu"
```

---

### Task 6: Build Footer Component

**Files:**
- Create: `src/components/Footer.astro`
- Create: `src/components/ContactForm.astro`

- [ ] **Step 1: Create ContactForm component**

Create `src/components/ContactForm.astro`:

```astro
---
interface Props {
  compact?: boolean;
  idPrefix?: string;
}
const { compact = false, idPrefix = '' } = Astro.props;
const pre = idPrefix ? `${idPrefix}-` : '';
---

<form action="https://api.web3forms.com/submit" method="POST" class="space-y-4">
  <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_KEY" />
  <input type="hidden" name="subject" value="New Contact from LifeBack Medical Website" />
  <input type="hidden" name="from_name" value="LifeBack Medical Website" />

  <!-- Honeypot spam protection -->
  <input type="checkbox" name="botcheck" class="hidden" style="display: none" />

  <div class:list={[compact ? 'space-y-3' : 'grid md:grid-cols-2 gap-4']}>
    <div>
      <label for={`${pre}name`} class="sr-only">Name</label>
      <input
        type="text"
        id={`${pre}name`}
        name="name"
        placeholder="Name *"
        required
        class="w-full px-4 py-3 rounded-card border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
      />
    </div>
    <div>
      <label for={`${pre}email`} class="sr-only">Email</label>
      <input
        type="email"
        id={`${pre}email`}
        name="email"
        placeholder="Email *"
        required
        class="w-full px-4 py-3 rounded-card border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
      />
    </div>
    <div>
      <label for={`${pre}phone`} class="sr-only">Phone</label>
      <input
        type="tel"
        id={`${pre}phone`}
        name="phone"
        placeholder="Phone No."
        class="w-full px-4 py-3 rounded-card border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
      />
    </div>
    {!compact && (
      <div>
        <label for={`${pre}subject-field`} class="sr-only">Subject</label>
        <input
          type="text"
          id={`${pre}subject-field`}
          name="subject_field"
          placeholder="Subject"
          class="w-full px-4 py-3 rounded-card border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
        />
      </div>
    )}
  </div>
  <div>
    <label for={`${pre}message`} class="sr-only">Message</label>
    <textarea
      id={`${pre}message`}
      name="message"
      placeholder="Message"
      rows={compact ? 3 : 5}
      required
      class="w-full px-4 py-3 rounded-card border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
    ></textarea>
  </div>
  <button type="submit" class="btn-primary w-full">
    Send Message
  </button>
</form>
```

- [ ] **Step 2: Create Footer component**

Create `src/components/Footer.astro`:

```astro
---
import ContactForm from './ContactForm.astro';

const quickLinks = [
  { name: 'Services', href: '/services' },
  { name: 'Meet Our Doctors', href: '/doctors' },
  { name: 'Locations', href: '/locations' },
  { name: 'Testimonials', href: '/testimonials' },
  { name: 'Blog', href: '/blog' },
  { name: 'Book Online', href: '/book-online' },
  { name: 'Preparing for Surgery', href: '/preparing-for-surgery' },
  { name: 'Downloads', href: '/downloads' },
];
---

<footer class="bg-dark text-white">
  <div class="container-default section-padding">
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
      <!-- Column 1: Contact Info -->
      <div>
        <h3 class="text-xl font-bold text-white mb-4">Connect With Us</h3>
        <div class="space-y-3 text-gray-300">
          <p>
            <a href="tel:9515472056" class="hover:text-accent transition-colors font-semibold text-lg">
              951-547-2056
            </a>
          </p>
          <p>
            <a href="mailto:info@lifebackmedical.com" class="hover:text-accent transition-colors">
              info@LifeBackMedical.com
            </a>
          </p>
          <div class="pt-2">
            <p class="font-semibold text-white">Hours</p>
            <p>9am - 7pm</p>
            <p>Monday - Saturday</p>
          </div>
        </div>
      </div>

      <!-- Column 2: Quick Links -->
      <div>
        <h3 class="text-xl font-bold text-white mb-4">Quick Links</h3>
        <ul class="space-y-2">
          {quickLinks.map((link) => (
            <li>
              <a href={link.href} class="text-gray-300 hover:text-accent transition-colors">
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <!-- Column 3: Social Media -->
      <div>
        <h3 class="text-xl font-bold text-white mb-4">Follow Us</h3>
        <div class="space-y-4">
          <div>
            <p class="font-semibold text-gray-300 mb-2">Life Back Medical</p>
            <div class="flex gap-3">
              <a href="https://www.instagram.com/lifebackmedical/" target="_blank" rel="noopener noreferrer" aria-label="Life Back Medical Instagram" class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://www.facebook.com/officallifebackmedical/" target="_blank" rel="noopener noreferrer" aria-label="Life Back Medical Facebook" class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <p class="font-semibold text-gray-300 mb-2">Life Back Weight Loss</p>
            <div class="flex gap-3">
              <a href="https://www.instagram.com/lifebackmedicalweightloss/" target="_blank" rel="noopener noreferrer" aria-label="Life Back Weight Loss Instagram" class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://www.facebook.com/LifeBackWeightLoss/" target="_blank" rel="noopener noreferrer" aria-label="Life Back Weight Loss Facebook" class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <p class="font-semibold text-gray-300 mb-2">Life Back Videos</p>
            <div class="flex gap-3">
              <a href="https://www.youtube.com/channel/UCi5P11phorkXUYexj6CV--Q/videos" target="_blank" rel="noopener noreferrer" aria-label="Life Back YouTube" class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Column 4: Contact Form -->
      <div>
        <h3 class="text-xl font-bold text-white mb-4">Contact Us</h3>
        <ContactForm compact idPrefix="footer" />
      </div>
    </div>
  </div>

  <!-- Bottom bar -->
  <div class="border-t border-white/10 py-4 px-4 text-center text-gray-400 text-sm">
    Life Back Medical&trade; &amp; Life Back Medical &copy; 2012-{new Date().getFullYear()}
  </div>
</footer>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ContactForm.astro src/components/Footer.astro
git commit -m "feat: add Footer and ContactForm with Web3Forms and honeypot"
```

---

### Task 7: Build Reusable UI Components

**Files:**
- Create: `src/components/HeroSection.astro`
- Create: `src/components/ServiceCard.astro`
- Create: `src/components/CTABanner.astro`
- Create: `src/components/TrustBar.astro`
- Create: `src/components/TestimonialCard.astro`
- Create: `src/components/BlogPostCard.astro`
- Create: `src/components/InsuranceBar.astro`
- Create: `src/components/DoctorCard.astro`
- Create: `src/components/Breadcrumb.astro`

- [ ] **Step 1: Create HeroSection**

Create `src/components/HeroSection.astro`:

```astro
---
interface Props {
  title: string;
  subtitle?: string;
  primaryCTA?: { text: string; href: string };
  secondaryCTA?: { text: string; href: string };
  size?: 'full' | 'short';
}

const { title, subtitle, primaryCTA, secondaryCTA, size = 'full' } = Astro.props;
---

<section class:list={[
  'relative bg-gradient-to-br from-dark via-primary to-primary-light text-white',
  size === 'full' ? 'py-32 md:py-44' : 'py-16 md:py-24',
]}>
  <div class="container-default px-4 md:px-8 relative z-10">
    <h1 class:list={[
      'font-bold text-white',
      size === 'full' ? 'text-4xl md:text-6xl mb-6' : 'text-3xl md:text-5xl mb-4',
    ]}>
      {title}
    </h1>
    {subtitle && (
      <p class="text-lg md:text-xl text-white/80 max-w-2xl mb-8">{subtitle}</p>
    )}
    {(primaryCTA || secondaryCTA) && (
      <div class="flex flex-wrap gap-4">
        {primaryCTA && (
          <a href={primaryCTA.href} class="btn-accent">{primaryCTA.text}</a>
        )}
        {secondaryCTA && (
          <a href={secondaryCTA.href} class="btn-outline border-white text-white hover:bg-white hover:text-dark">
            {secondaryCTA.text}
          </a>
        )}
      </div>
    )}
  </div>
</section>
```

- [ ] **Step 2: Create ServiceCard**

Create `src/components/ServiceCard.astro`:

```astro
---
interface Props {
  title: string;
  description: string;
  href: string;
  image?: string;
}

const { title, description, href, image } = Astro.props;
---

<a href={href} class="card block overflow-hidden group">
  {image && (
    <div class="h-48 overflow-hidden">
      <img
        src={image}
        alt={title}
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    </div>
  )}
  <div class="p-6">
    <h3 class="text-lg font-bold text-dark mb-2 group-hover:text-primary transition-colors">{title}</h3>
    <p class="text-muted text-sm">{description}</p>
    <span class="inline-block mt-3 text-primary font-semibold text-sm">
      Learn More &rarr;
    </span>
  </div>
</a>
```

- [ ] **Step 3: Create CTABanner**

Create `src/components/CTABanner.astro`:

```astro
---
interface Props {
  title: string;
  buttonText?: string;
  buttonHref?: string;
  secondaryText?: string;
  secondaryHref?: string;
}

const {
  title,
  buttonText = 'Book Your Free Consultation',
  buttonHref = '/book-online',
  secondaryText,
  secondaryHref,
} = Astro.props;
---

<section class="bg-primary py-16 px-4">
  <div class="container-default text-center">
    <h2 class="text-3xl md:text-4xl font-bold text-white mb-8">{title}</h2>
    <div class="flex flex-wrap justify-center gap-4">
      <a href={buttonHref} class="btn-accent">{buttonText}</a>
      {secondaryText && secondaryHref && (
        <a href={secondaryHref} class="btn-outline border-white text-white hover:bg-white hover:text-dark">
          {secondaryText}
        </a>
      )}
    </div>
  </div>
</section>
```

- [ ] **Step 4: Create TrustBar**

Create `src/components/TrustBar.astro`:

```astro
---
const stats = [
  { value: '14+', label: 'Years in Practice' },
  { value: '10,000+', label: 'Patients Served' },
  { value: '12', label: 'Specialized Services' },
  { value: '2', label: 'Locations' },
];
---

<section class="bg-white py-12 px-4 border-y border-gray-100">
  <div class="container-default grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
    {stats.map((stat) => (
      <div class="fade-in">
        <p class="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
        <p class="text-muted text-sm mt-1">{stat.label}</p>
      </div>
    ))}
  </div>
</section>
```

- [ ] **Step 5: Create TestimonialCard**

Create `src/components/TestimonialCard.astro`:

```astro
---
interface Props {
  quote: string;
  name: string;
  rating?: number;
}

const { quote, name, rating = 5 } = Astro.props;
---

<div class="card p-6">
  <div class="flex gap-1 mb-4">
    {Array.from({ length: rating }).map(() => (
      <svg class="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
  <blockquote class="text-text italic mb-4">&ldquo;{quote}&rdquo;</blockquote>
  <p class="font-semibold text-dark">{name}</p>
</div>
```

- [ ] **Step 6: Create BlogPostCard**

Create `src/components/BlogPostCard.astro`:

```astro
---
interface Props {
  title: string;
  date: Date;
  excerpt: string;
  slug: string;
  image?: string;
}

const { title, date, excerpt, slug, image } = Astro.props;
const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
---

<a href={`/blog/${slug}`} class="card block overflow-hidden group">
  {image && (
    <div class="h-48 overflow-hidden">
      <img
        src={image}
        alt={title}
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    </div>
  )}
  <div class="p-6">
    <time class="text-muted text-xs uppercase tracking-wide">{formattedDate}</time>
    <h3 class="text-lg font-bold text-dark mt-2 mb-2 group-hover:text-primary transition-colors">{title}</h3>
    <p class="text-muted text-sm line-clamp-3">{excerpt}</p>
  </div>
</a>
```

- [ ] **Step 7: Create InsuranceBar**

Create `src/components/InsuranceBar.astro`:

```astro
<section class="section-padding bg-white">
  <div class="container-default text-center">
    <h2 class="text-2xl md:text-3xl font-bold text-dark mb-2">Insurance</h2>
    <p class="text-muted mb-8">We accept nearly all PPO work insurance plans</p>
    <div class="flex flex-wrap justify-center items-center gap-8 opacity-70">
      <img src="/images/insurance/insurance-logos.png" alt="Accepted insurance providers" class="max-w-full h-auto" loading="lazy" />
    </div>
  </div>
</section>
```

- [ ] **Step 8: Create DoctorCard**

Create `src/components/DoctorCard.astro`:

```astro
---
interface Props {
  name: string;
  specialty: string;
  bio: string;
  image?: string;
  bookingHref?: string;
}

const { name, specialty, bio, image, bookingHref = '/book-online' } = Astro.props;
---

<div class="card overflow-hidden md:flex">
  {image && (
    <div class="md:w-1/3 h-64 md:h-auto overflow-hidden">
      <img src={image} alt={name} class="w-full h-full object-cover" loading="lazy" />
    </div>
  )}
  <div class="p-8 md:w-2/3">
    <h2 class="text-2xl font-bold text-dark mb-1">{name}</h2>
    <p class="text-primary font-semibold mb-4">{specialty}</p>
    <p class="text-text mb-6">{bio}</p>
    <a href={bookingHref} class="btn-primary">Book with {name.split(' ')[0]}</a>
  </div>
</div>
```

- [ ] **Step 9: Create Breadcrumb**

Create `src/components/Breadcrumb.astro`:

```astro
---
interface Props {
  items: Array<{ label: string; href?: string }>;
}

const { items } = Astro.props;
---

<nav aria-label="Breadcrumb" class="text-sm text-white/70">
  <ol class="flex flex-wrap gap-2">
    <li>
      <a href="/" class="hover:text-white transition-colors">Home</a>
    </li>
    {items.map((item, i) => (
      <li class="flex items-center gap-2">
        <span>/</span>
        {item.href && i < items.length - 1 ? (
          <a href={item.href} class="hover:text-white transition-colors">{item.label}</a>
        ) : (
          <span class="text-white">{item.label}</span>
        )}
      </li>
    ))}
  </ol>
</nav>
```

- [ ] **Step 10: Verify all components build**

```bash
cd /home/andy/lifeback && npx astro build
```

Expected: Build succeeds (or shows only expected warnings about unused components — pages will wire them together).

- [ ] **Step 11: Commit**

```bash
git add src/components/
git commit -m "feat: add all reusable UI components (hero, cards, CTA, trust bar, breadcrumb)"
```

---

## Chunk 3: Pages — Homepage & Services

### Task 8: Build Homepage

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create homepage**

Create `src/pages/index.astro`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import HeroSection from '@components/HeroSection.astro';
import TrustBar from '@components/TrustBar.astro';
import ServiceCard from '@components/ServiceCard.astro';
import CTABanner from '@components/CTABanner.astro';
import TestimonialCard from '@components/TestimonialCard.astro';
import InsuranceBar from '@components/InsuranceBar.astro';
import BlogPostCard from '@components/BlogPostCard.astro';
import { getCollection } from 'astro:content';

const allServices = await getCollection('services');
const services = allServices.sort((a, b) => a.data.order - b.data.order);

const allPosts = await getCollection('blog');
const recentPosts = allPosts
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, 3);

const testimonials = [
  { quote: "Life Back Medical changed my life. The staff is caring and professional.", name: "Patient Review", rating: 5 },
  { quote: "Dr. Sedrak is an amazing doctor. I highly recommend this practice.", name: "Patient Review", rating: 5 },
  { quote: "From consultation to recovery, everything was smooth and well-explained.", name: "Patient Review", rating: 5 },
];
---

<BaseLayout title="Home" description="Life Back Medical — Comprehensive medical services in Riverside County. Vein repair, weight loss, surgery, and more. Call 951-547-2056.">

  <HeroSection
    title="Get Your Life Back"
    subtitle="Compassionate, comprehensive medical care for you and your family. From minimally invasive procedures to transformative treatments — we're here for every step."
    primaryCTA={{ text: 'Book an Appointment', href: '/book-online' }}
    secondaryCTA={{ text: 'Call 951-547-2056', href: 'tel:9515472056' }}
  />

  <TrustBar />

  <!-- Services Grid -->
  <section class="section-padding bg-light-bg">
    <div class="container-default">
      <h2 class="text-3xl md:text-4xl font-bold text-dark text-center mb-12 fade-in">Our Services</h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {services.map((service) => (
          <div class="fade-in">
            <ServiceCard
              title={service.data.title}
              description={service.data.description}
              href={`/services/${service.id}`}
              image={service.data.image}
            />
          </div>
        ))}
      </div>
      <div class="text-center mt-10">
        <a href="/services" class="btn-outline">View All Services</a>
      </div>
    </div>
  </section>

  <!-- Why Choose Us -->
  <section class="section-padding bg-white">
    <div class="container-default grid md:grid-cols-2 gap-12 items-center">
      <div class="fade-in">
        <img src="/images/clinic-team.jpg" alt="Life Back Medical team" class="rounded-card shadow-lg w-full" loading="lazy" />
      </div>
      <div class="fade-in">
        <h2 class="text-3xl md:text-4xl font-bold text-dark mb-6">Why Choose Life Back Medical?</h2>
        <ul class="space-y-4">
          <li class="flex gap-3">
            <span class="text-primary text-xl">&#10003;</span>
            <span>Board-certified surgeons and specialists</span>
          </li>
          <li class="flex gap-3">
            <span class="text-primary text-xl">&#10003;</span>
            <span>Minimally invasive procedures with faster recovery</span>
          </li>
          <li class="flex gap-3">
            <span class="text-primary text-xl">&#10003;</span>
            <span>Most PPO insurance plans accepted</span>
          </li>
          <li class="flex gap-3">
            <span class="text-primary text-xl">&#10003;</span>
            <span>Same-week appointments available</span>
          </li>
        </ul>
        <a href="/doctors" class="btn-primary mt-8 inline-block">Meet Our Doctors</a>
      </div>
    </div>
  </section>

  <CTABanner title="Ready to feel like yourself again?" />

  <!-- Testimonials -->
  <section class="section-padding bg-light-bg">
    <div class="container-default">
      <h2 class="text-3xl md:text-4xl font-bold text-dark text-center mb-12 fade-in">What Our Patients Say</h2>
      <div class="grid md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div class="fade-in">
            <TestimonialCard quote={t.quote} name={t.name} rating={t.rating} />
          </div>
        ))}
      </div>
      <div class="text-center mt-10">
        <a href="/testimonials" class="btn-outline">Read More Stories</a>
      </div>
    </div>
  </section>

  <InsuranceBar />

  <!-- Blog Preview -->
  {recentPosts.length > 0 && (
    <section class="section-padding bg-white">
      <div class="container-default">
        <h2 class="text-3xl md:text-4xl font-bold text-dark text-center mb-12 fade-in">Health & Wellness Blog</h2>
        <div class="grid md:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <div class="fade-in">
              <BlogPostCard
                title={post.data.title}
                date={post.data.date}
                excerpt={post.data.excerpt}
                slug={post.id}
                image={post.data.image}
              />
            </div>
          ))}
        </div>
        <div class="text-center mt-10">
          <a href="/blog" class="btn-outline">Visit Our Blog</a>
        </div>
      </div>
    </section>
  )}

</BaseLayout>
```

- [ ] **Step 2: Verify homepage builds**

```bash
cd /home/andy/lifeback && npx astro build
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add homepage with hero, services grid, testimonials, insurance, blog preview"
```

---

### Task 9: Build Services Pages

**Files:**
- Create: `src/pages/services/index.astro`
- Create: `src/pages/services/[slug].astro`

- [ ] **Step 1: Create services overview page**

Create `src/pages/services/index.astro`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import HeroSection from '@components/HeroSection.astro';
import ServiceCard from '@components/ServiceCard.astro';
import CTABanner from '@components/CTABanner.astro';
import { getCollection } from 'astro:content';

const allServices = await getCollection('services');
const services = allServices.sort((a, b) => a.data.order - b.data.order);
---

<BaseLayout title="Services" description="Explore our comprehensive medical services including vein repair, weight loss, surgery, cancer prevention, and more.">
  <HeroSection title="Our Services" subtitle="Comprehensive care for every part of your health" size="short" />

  <section class="section-padding bg-light-bg">
    <div class="container-default">
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div class="fade-in">
            <ServiceCard
              title={service.data.title}
              description={service.data.description}
              href={`/services/${service.id}`}
              image={service.data.image}
            />
          </div>
        ))}
      </div>
    </div>
  </section>

  <CTABanner title="Not sure which service you need?" buttonText="Book a Free Consultation" />
</BaseLayout>
```

- [ ] **Step 2: Create dynamic service page**

Create `src/pages/services/[slug].astro`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import Breadcrumb from '@components/Breadcrumb.astro';
import CTABanner from '@components/CTABanner.astro';
import ServiceCard from '@components/ServiceCard.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const services = await getCollection('services');
  return services.map((service) => ({
    params: { slug: service.id },
    props: { service },
  }));
}

const { service } = Astro.props;
const { Content } = await service.render();

const allServices = await getCollection('services');
const relatedSlugs = service.data.relatedServices || [];
const relatedServices = allServices.filter((s) => relatedSlugs.includes(s.id)).slice(0, 3);
---

<BaseLayout title={service.data.title} description={service.data.description}>
  <!-- Short Hero -->
  <section class="bg-gradient-to-br from-dark via-primary to-primary-light text-white py-16 md:py-24 px-4">
    <div class="container-default">
      <Breadcrumb items={[{ label: 'Services', href: '/services' }, { label: service.data.title }]} />
      <h1 class="text-3xl md:text-5xl font-bold text-white mt-4">{service.data.title}</h1>
    </div>
  </section>

  <!-- Content -->
  <section class="section-padding bg-white">
    <div class="container-default grid md:grid-cols-2 gap-12 items-start">
      <div class="prose prose-lg max-w-none">
        <Content />
      </div>
      {service.data.image && (
        <div>
          <img src={service.data.image} alt={service.data.title} class="rounded-card shadow-lg w-full" loading="lazy" />
        </div>
      )}
    </div>
  </section>

  <!-- What to Expect -->
  <section class="section-padding bg-light-bg">
    <div class="container-default">
      <h2 class="text-3xl font-bold text-dark text-center mb-12">What to Expect</h2>
      <div class="grid md:grid-cols-3 gap-8 text-center">
        <div class="fade-in">
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-primary text-2xl font-bold">1</span>
          </div>
          <h3 class="font-bold text-dark mb-2">Consultation</h3>
          <p class="text-muted text-sm">Meet with our specialists to discuss your condition and explore treatment options.</p>
        </div>
        <div class="fade-in">
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-primary text-2xl font-bold">2</span>
          </div>
          <h3 class="font-bold text-dark mb-2">Treatment</h3>
          <p class="text-muted text-sm">Receive expert care using the latest minimally invasive techniques for optimal outcomes.</p>
        </div>
        <div class="fade-in">
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-primary text-2xl font-bold">3</span>
          </div>
          <h3 class="font-bold text-dark mb-2">Recovery</h3>
          <p class="text-muted text-sm">Our team supports you every step of the way back to full health and comfort.</p>
        </div>
      </div>
    </div>
  </section>

  <CTABanner
    title="Ready to take the next step?"
    buttonText="Book a Consultation"
    secondaryText="Call 951-547-2056"
    secondaryHref="tel:9515472056"
  />

  <!-- Related Services -->
  {relatedServices.length > 0 && (
    <section class="section-padding bg-white">
      <div class="container-default">
        <h2 class="text-3xl font-bold text-dark text-center mb-12">Related Services</h2>
        <div class="grid md:grid-cols-3 gap-6">
          {relatedServices.map((s) => (
            <ServiceCard title={s.data.title} description={s.data.description} href={`/services/${s.id}`} image={s.data.image} />
          ))}
        </div>
      </div>
    </section>
  )}
</BaseLayout>
```

- [ ] **Step 3: Verify services pages build**

```bash
cd /home/andy/lifeback && npx astro build
```

Expected: Build succeeds, service pages generated from content collection.

- [ ] **Step 4: Commit**

```bash
git add src/pages/services/
git commit -m "feat: add services overview and dynamic service detail pages"
```

---

## Chunk 4: Remaining Pages

### Task 10: Build Doctors, Locations, Testimonials, Contact Pages

**Files:**
- Create: `src/pages/doctors.astro`
- Create: `src/pages/locations.astro`
- Create: `src/pages/testimonials.astro`
- Create: `src/pages/contact.astro`

- [ ] **Step 1: Create Doctors page**

Create `src/pages/doctors.astro`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import HeroSection from '@components/HeroSection.astro';
import DoctorCard from '@components/DoctorCard.astro';
import CTABanner from '@components/CTABanner.astro';

const doctors = [
  {
    name: 'Dr. Sedrak',
    specialty: 'Medical Director',
    bio: 'Placeholder bio — will be replaced with scraped content from Wix.',
    image: '/images/doctors/dr-sedrak.jpg',
  },
];
---

<BaseLayout title="Meet Our Doctors" description="Meet the experienced medical team at Life Back Medical.">
  <HeroSection title="Meet Our Doctors" subtitle="Experienced, compassionate specialists dedicated to your care" size="short" />

  <section class="section-padding bg-light-bg">
    <div class="container-default space-y-8">
      {doctors.map((doc) => (
        <div class="fade-in">
          <DoctorCard
            name={doc.name}
            specialty={doc.specialty}
            bio={doc.bio}
            image={doc.image}
          />
        </div>
      ))}
    </div>
  </section>

  <CTABanner title="Ready to schedule your visit?" />
</BaseLayout>
```

- [ ] **Step 2: Create Locations page**

Create `src/pages/locations.astro`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import HeroSection from '@components/HeroSection.astro';
import CTABanner from '@components/CTABanner.astro';
---

<BaseLayout title="Locations" description="Find Life Back Medical office locations and hours.">
  <HeroSection title="Our Locations" subtitle="Conveniently located to serve you" size="short" />

  <section class="section-padding bg-white">
    <div class="container-default grid md:grid-cols-2 gap-12">
      <div class="fade-in">
        <h2 class="text-2xl font-bold text-dark mb-4">Office Information</h2>
        <div class="space-y-4 text-text">
          <p>Placeholder address — will be replaced with scraped content from Wix.</p>
          <div>
            <p class="font-semibold text-dark">Phone</p>
            <a href="tel:9515472056" class="text-primary hover:text-primary-light">951-547-2056</a>
          </div>
          <div>
            <p class="font-semibold text-dark">Email</p>
            <a href="mailto:info@lifebackmedical.com" class="text-primary hover:text-primary-light">info@LifeBackMedical.com</a>
          </div>
          <div>
            <p class="font-semibold text-dark">Hours</p>
            <p>Monday - Saturday: 9am - 7pm</p>
          </div>
        </div>
      </div>
      <div class="fade-in">
        <div class="rounded-card overflow-hidden shadow-lg h-80 bg-card-bg flex items-center justify-center">
          <p class="text-muted">Map embed placeholder — add Google Maps iframe after content scrape</p>
        </div>
      </div>
    </div>
  </section>

  <CTABanner title="Visit us today" buttonText="Get Directions" />
</BaseLayout>
```

- [ ] **Step 3: Create Testimonials page**

Create `src/pages/testimonials.astro`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import HeroSection from '@components/HeroSection.astro';
import TestimonialCard from '@components/TestimonialCard.astro';
import CTABanner from '@components/CTABanner.astro';

const testimonials = [
  { quote: "Placeholder testimonial — will be replaced with scraped content.", name: "Patient 1", rating: 5 },
  { quote: "Placeholder testimonial — will be replaced with scraped content.", name: "Patient 2", rating: 5 },
  { quote: "Placeholder testimonial — will be replaced with scraped content.", name: "Patient 3", rating: 5 },
];
---

<BaseLayout title="Testimonials" description="Read what our patients say about their experience at Life Back Medical.">
  <HeroSection title="Patient Testimonials" subtitle="Real stories from real patients" size="short" />

  <section class="section-padding bg-light-bg">
    <div class="container-default">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div class="fade-in">
            <TestimonialCard quote={t.quote} name={t.name} rating={t.rating} />
          </div>
        ))}
      </div>
    </div>
  </section>

  <CTABanner title="Ready to become our next success story?" />
</BaseLayout>
```

- [ ] **Step 4: Create Contact page**

Create `src/pages/contact.astro`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import HeroSection from '@components/HeroSection.astro';
import ContactForm from '@components/ContactForm.astro';
---

<BaseLayout title="Contact Us" description="Contact Life Back Medical. Call 951-547-2056 or send us a message.">
  <HeroSection title="Contact Us" subtitle="We're here to help — reach out anytime" size="short" />

  <section class="section-padding bg-white">
    <div class="container-default grid md:grid-cols-2 gap-12">
      <div class="fade-in">
        <h2 class="text-2xl font-bold text-dark mb-6">Send Us a Message</h2>
        <ContactForm />
      </div>
      <div class="fade-in">
        <h2 class="text-2xl font-bold text-dark mb-6">Contact Information</h2>
        <div class="space-y-6">
          <div>
            <p class="font-semibold text-dark">Phone</p>
            <a href="tel:9515472056" class="text-primary hover:text-primary-light text-lg">951-547-2056</a>
          </div>
          <div>
            <p class="font-semibold text-dark">Email</p>
            <a href="mailto:info@lifebackmedical.com" class="text-primary hover:text-primary-light">info@LifeBackMedical.com</a>
          </div>
          <div>
            <p class="font-semibold text-dark">Hours</p>
            <p class="text-text">Monday - Saturday: 9am - 7pm</p>
          </div>
          <div>
            <p class="font-semibold text-dark">Address</p>
            <p class="text-text">Placeholder — will be replaced with scraped content</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/doctors.astro src/pages/locations.astro src/pages/testimonials.astro src/pages/contact.astro
git commit -m "feat: add doctors, locations, testimonials, and contact pages"
```

---

### Task 11: Build Blog Pages

**Files:**
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[slug].astro`

- [ ] **Step 1: Create blog listing page**

Create `src/pages/blog/index.astro`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import HeroSection from '@components/HeroSection.astro';
import BlogPostCard from '@components/BlogPostCard.astro';
import { getCollection } from 'astro:content';

const allPosts = await getCollection('blog');
const posts = allPosts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
const [featured, ...rest] = posts;
---

<BaseLayout title="Blog" description="Health and wellness insights from Life Back Medical.">
  <HeroSection title="Health & Wellness Blog" subtitle="Expert insights for a healthier you" size="short" />

  <section class="section-padding bg-light-bg">
    <div class="container-default">
      {featured && (
        <div class="mb-12 fade-in">
          <a href={`/blog/${featured.id}`} class="card block md:flex overflow-hidden group">
            {featured.data.image && (
              <div class="md:w-1/2 h-64 md:h-auto overflow-hidden">
                <img src={featured.data.image} alt={featured.data.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
              </div>
            )}
            <div class="p-8 md:w-1/2">
              <time class="text-muted text-xs uppercase tracking-wide">
                {featured.data.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
              <h2 class="text-2xl font-bold text-dark mt-2 mb-3 group-hover:text-primary transition-colors">{featured.data.title}</h2>
              <p class="text-muted">{featured.data.excerpt}</p>
              <span class="inline-block mt-4 text-primary font-semibold">Read More &rarr;</span>
            </div>
          </a>
        </div>
      )}

      {rest.length > 0 && (
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => (
            <div class="fade-in">
              <BlogPostCard
                title={post.data.title}
                date={post.data.date}
                excerpt={post.data.excerpt}
                slug={post.id}
                image={post.data.image}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Create blog post page**

Create `src/pages/blog/[slug].astro`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import Breadcrumb from '@components/Breadcrumb.astro';
import CTABanner from '@components/CTABanner.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
const formattedDate = post.data.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
---

<BaseLayout title={post.data.title} description={post.data.excerpt}>
  <section class="bg-gradient-to-br from-dark via-primary to-primary-light text-white py-16 md:py-24 px-4">
    <div class="container-default">
      <Breadcrumb items={[{ label: 'Blog', href: '/blog' }, { label: post.data.title }]} />
      <h1 class="text-3xl md:text-5xl font-bold text-white mt-4 mb-4">{post.data.title}</h1>
      <div class="flex items-center gap-4 text-white/70">
        <time>{formattedDate}</time>
        <span>&middot;</span>
        <span>{post.data.author}</span>
      </div>
    </div>
  </section>

  <article class="section-padding bg-white">
    <div class="container-default max-w-3xl">
      <div class="prose prose-lg max-w-none">
        <Content />
      </div>
    </div>
  </article>

  <CTABanner title="Have questions? We're here to help." buttonText="Contact Us" buttonHref="/contact" />
</BaseLayout>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/
git commit -m "feat: add blog listing with featured post and individual blog post pages"
```

---

### Task 12: Build Utility Pages (404, Book Online, Surgery Prep, Downloads)

**Files:**
- Create: `src/pages/404.astro`
- Create: `src/pages/book-online.astro`
- Create: `src/pages/preparing-for-surgery.astro`
- Create: `src/pages/downloads.astro`

- [ ] **Step 1: Create 404 page**

Create `src/pages/404.astro`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
---

<BaseLayout title="Page Not Found" noindex>
  <section class="section-padding bg-light-bg min-h-[60vh] flex items-center">
    <div class="container-default text-center">
      <h1 class="text-6xl md:text-8xl font-bold text-primary mb-4">404</h1>
      <p class="text-xl text-muted mb-8">The page you're looking for doesn't exist or has moved.</p>
      <div class="flex flex-wrap justify-center gap-4">
        <a href="/" class="btn-primary">Go Home</a>
        <a href="/services" class="btn-outline">View Services</a>
        <a href="/contact" class="btn-outline">Contact Us</a>
      </div>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Create Book Online redirect page**

Create `src/pages/book-online.astro`:

```astro
---
// IMPORTANT: Replace this with the actual Wix direct URL before DNS cutover
// Find it by visiting the Wix dashboard → Site URL (e.g., username.wixsite.com/lifebackmedical/book-online)
const wixBookingUrl = 'https://REPLACE-WITH-WIX-DIRECT-URL/book-online';
---

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content={`0;url=${wixBookingUrl}`} />
    <title>Redirecting to booking...</title>
  </head>
  <body>
    <p>Redirecting to our booking page... <a href={wixBookingUrl}>Click here if not redirected.</a></p>
  </body>
</html>
```

- [ ] **Step 3: Create Preparing for Surgery page**

Create `src/pages/preparing-for-surgery.astro`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import HeroSection from '@components/HeroSection.astro';
import CTABanner from '@components/CTABanner.astro';
---

<BaseLayout title="Preparing for Surgery" description="Important information to help you prepare for your upcoming procedure at Life Back Medical.">
  <HeroSection title="Preparing for Surgery" subtitle="Everything you need to know before your procedure" size="short" />

  <section class="section-padding bg-white">
    <div class="container-default max-w-3xl">
      <div class="prose prose-lg max-w-none">
        <p>Placeholder content — will be replaced with scraped content from Wix.</p>
      </div>
    </div>
  </section>

  <CTABanner title="Have questions about your upcoming procedure?" buttonText="Contact Us" buttonHref="/contact" />
</BaseLayout>
```

- [ ] **Step 4: Create Downloads page**

Create `src/pages/downloads.astro`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import HeroSection from '@components/HeroSection.astro';

const downloads = [
  { name: 'Placeholder Document', file: '/downloads/placeholder.pdf', description: 'Will be replaced with actual downloads from Wix.' },
];
---

<BaseLayout title="Downloads" description="Download patient forms and resources from Life Back Medical.">
  <HeroSection title="Downloads Library" subtitle="Patient forms and helpful resources" size="short" />

  <section class="section-padding bg-light-bg">
    <div class="container-default max-w-3xl">
      <div class="space-y-4">
        {downloads.map((doc) => (
          <a href={doc.file} target="_blank" rel="noopener noreferrer" class="card block p-6 group">
            <div class="flex items-center gap-4">
              <svg class="w-8 h-8 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <h3 class="font-bold text-dark group-hover:text-primary transition-colors">{doc.name}</h3>
                <p class="text-muted text-sm">{doc.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/404.astro src/pages/book-online.astro src/pages/preparing-for-surgery.astro src/pages/downloads.astro
git commit -m "feat: add 404, book-online redirect, surgery prep, and downloads pages"
```

---

## Chunk 5: Redirects, Static Assets & Build Verification

### Task 13: Create Redirects File and Static Assets

**Files:**
- Create: `public/_redirects`
- Create: `public/robots.txt`

- [ ] **Step 1: Create Cloudflare Pages `_redirects` file**

Create `public/_redirects`:

```
# Service pages: top-level → /services/*
/vein-repair /services/vein-repair 301
/weightloss /services/weight-loss 301
/sleep-studies-and-treatments /services/sleep-studies 301
/cancer-prevention /services/cancer-prevention 301
/heartburn-relief /services/heartburn-relief 301
/knee-and-back-pain-treatments /services/knee-back-pain 301
/hernia-repair /services/hernia-repair 301
/gallbladder-surgery /services/gallbladder-surgery 301
/hemorrhoid-procedures /services/hemorrhoid-procedures 301
/plastic-surgery /services/plastic-surgery 301
/colon-and-appendix-surgeries /services/colon-appendix-surgery 301
/corporate-wellness /services/corporate-wellness 301

# Other page renames
/lifebackmedicalservices /services 301
/meet-our-medical-director /doctors 301
/stories /testimonials 301
/before-and-afters /testimonials 301
/downloads-library /downloads 301

# Blog: /post/* → /blog/*
/post/* /blog/:splat 301

# Booking: redirect to Wix direct URL
# TODO: Update these with actual Wix direct URL after confirming
# /service-page/* https://username.wixsite.com/lifebackmedical/service-page/:splat 301
# /booking-calendar/* https://username.wixsite.com/lifebackmedical/booking-calendar/:splat 301
```

- [ ] **Step 2: Create robots.txt**

Create `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://www.lifebackmedical.com/sitemap-index.xml
```

- [ ] **Step 3: Create placeholder directories for assets**

```bash
mkdir -p /home/andy/lifeback/public/images/insurance
mkdir -p /home/andy/lifeback/public/downloads
mkdir -p /home/andy/lifeback/src/assets/images/{doctors,services,testimonials,hero}
```

- [ ] **Step 4: Commit**

```bash
git add public/_redirects public/robots.txt
git commit -m "feat: add Cloudflare Pages redirects and robots.txt"
```

---

### Task 14: Full Build Verification

- [ ] **Step 1: Clean build**

```bash
cd /home/andy/lifeback && rm -rf dist .astro && npx astro build
```

Expected: Build succeeds with all pages generated.

- [ ] **Step 2: Verify page output**

```bash
ls -la /home/andy/lifeback/dist/
find /home/andy/lifeback/dist -name "*.html" | sort
```

Expected: HTML files for all routes:
- `index.html` (home)
- `services/index.html` + `services/vein-repair/index.html` (etc.)
- `doctors/index.html`, `locations/index.html`, `testimonials/index.html`, `contact/index.html`
- `blog/index.html` + `blog/placeholder/index.html`
- `preparing-for-surgery/index.html`, `downloads/index.html`, `book-online/index.html`
- `404.html`

- [ ] **Step 3: Verify redirects file in output**

```bash
cat /home/andy/lifeback/dist/_redirects
```

Expected: Redirects file is present in dist output.

- [ ] **Step 4: Local preview**

```bash
cd /home/andy/lifeback && npx astro preview
```

Open in browser to verify pages render correctly. Check:
- Homepage loads with all sections
- Navigation works (services dropdown, mobile menu)
- Service pages render from markdown content
- Blog listing shows placeholder post
- 404 page renders
- Contact form displays (won't submit without Web3Forms key)

- [ ] **Step 5: Commit any fixes**

```bash
git add -A && git commit -m "fix: resolve build issues from full verification"
```

(Skip if no fixes needed.)

---

## Chunk 6: Content Scraping & Population

### Task 15: Scrape Wix Content

This task uses browser automation to scrape all content from the current Wix site. Run in a separate session or use subagents for parallel scraping.

- [ ] **Step 1: Scrape all 12 service pages**

For each service page URL on the Wix site, navigate to it in Chrome and extract:
- Page title
- Main body text
- Any images (download to `src/assets/images/services/`)

Save each as a markdown file in `src/content/services/` with proper frontmatter matching the schema:

```markdown
---
title: "Service Name"
description: "One-line description for cards"
image: "/images/services/service-name.jpg"
order: N
relatedServices: ["slug1", "slug2"]
---

Scraped body content here...
```

Wix service URLs to scrape:
- `lifebackmedical.com/vein-repair`
- `lifebackmedical.com/weightloss`
- `lifebackmedical.com/sleep-studies-and-treatments`
- `lifebackmedical.com/cancer-prevention`
- `lifebackmedical.com/heartburn-relief`
- `lifebackmedical.com/knee-and-back-pain-treatments`
- `lifebackmedical.com/hernia-repair`
- `lifebackmedical.com/gallbladder-surgery`
- `lifebackmedical.com/hemorrhoid-procedures`
- `lifebackmedical.com/plastic-surgery`
- `lifebackmedical.com/colon-and-appendix-surgeries`
- `lifebackmedical.com/corporate-wellness`

- [ ] **Step 2: Scrape doctor info**

Navigate to `lifebackmedical.com/meet-our-medical-director`. Extract:
- Doctor name(s)
- Specialties
- Bios
- Photos (download to `src/assets/images/doctors/`)

Update `src/pages/doctors.astro` with real data.

- [ ] **Step 3: Scrape testimonials**

Navigate to `lifebackmedical.com/testimonials` and `lifebackmedical.com/stories`. Extract all testimonial quotes and names.

Update `src/pages/testimonials.astro` with real data.

- [ ] **Step 4: Scrape blog posts**

Navigate to `lifebackmedical.com/blog`. For each of the 22 posts:
- Extract title, date, author, content, featured image
- Save as markdown in `src/content/blog/[slug].md`

- [ ] **Step 5: Scrape remaining pages**

- `lifebackmedical.com/locations` — extract address, map embed
- `lifebackmedical.com/preparing-for-surgery` — extract content
- `lifebackmedical.com/downloads-library` — extract download links and PDFs

- [ ] **Step 6: Download insurance logos**

From the homepage, download the insurance logos image to `public/images/insurance/`.

- [ ] **Step 7: Verify content builds**

```bash
cd /home/andy/lifeback && npx astro build
```

Expected: All pages generate with real content.

- [ ] **Step 8: Commit**

```bash
git add src/content/ src/assets/ public/images/ public/downloads/ src/pages/
git commit -m "feat: populate site with scraped content from Wix"
```

---

## Chunk 7: Deployment

### Task 16: Deploy to Cloudflare Pages

- [ ] **Step 1: Initialize git repo for Cloudflare Pages**

Ensure the project is pushed to a git remote (GitHub or GitLab) that Cloudflare Pages can connect to.

```bash
cd /home/andy/lifeback
gh repo create lifeback-medical --private --source=. --push
```

- [ ] **Step 2: Connect to Cloudflare Pages**

In the Cloudflare dashboard:
1. Go to Workers & Pages → Create → Pages → Connect to Git
2. Select the `lifeback-medical` repository
3. Configure build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variable: `NODE_VERSION` = `20`
4. Click "Save and Deploy"

- [ ] **Step 3: Verify preview deployment**

Once the build completes, Cloudflare provides a preview URL like `lifeback-medical.pages.dev`. Verify:
- All pages load correctly
- Navigation works
- Images display
- Contact form renders
- Redirects work (test `/vein-repair` → `/services/vein-repair`)
- 404 page shows for non-existent routes

- [ ] **Step 4: Register Web3Forms API key**

1. Go to `web3forms.com` and create a free account
2. Get an API key for `info@lifebackmedical.com` as the delivery email
3. Replace `YOUR_WEB3FORMS_KEY` in `src/components/ContactForm.astro` with the actual key
4. Push the update

- [ ] **Step 5: Commit**

```bash
git add src/components/ContactForm.astro
git commit -m "feat: add Web3Forms API key for contact form"
git push
```

---

### Task 17: DNS Cutover

**This task requires user action at GoDaddy. Provide instructions and verify.**

- [ ] **Step 1: Add domain to Cloudflare**

In Cloudflare dashboard:
1. Go to "Add a site" → enter `lifebackmedical.com`
2. Select Free plan
3. Cloudflare will provide two nameservers (e.g., `ada.ns.cloudflare.com`, `bob.ns.cloudflare.com`)

- [ ] **Step 2: User updates nameservers at GoDaddy**

Instruct user to:
1. Log into GoDaddy → Domain Settings → `lifebackmedical.com`
2. Under Nameservers, click "Change" → "Custom"
3. Replace Wix nameservers with the two Cloudflare nameservers
4. Save

Propagation takes 15 minutes to 48 hours.

- [ ] **Step 3: Configure Cloudflare DNS records**

In Cloudflare DNS settings for `lifebackmedical.com`:
1. Add CNAME record: `@` → `lifeback-medical.pages.dev` (proxied)
2. Add CNAME record: `www` → `lifeback-medical.pages.dev` (proxied)

- [ ] **Step 4: Configure custom domain in Cloudflare Pages**

In Workers & Pages → `lifeback-medical` → Custom domains:
1. Add `lifebackmedical.com`
2. Add `www.lifebackmedical.com`

Cloudflare auto-provisions SSL certificates.

- [ ] **Step 5: Remove noindex meta**

Once live on production domain, ensure `noindex` is not set on any public pages. The `BaseLayout.astro` only adds noindex when the `noindex` prop is explicitly passed (404 page only), so this should already be correct.

- [ ] **Step 6: Verify live site**

Test the live site at `https://www.lifebackmedical.com`:
- All pages load
- SSL certificate is valid
- Redirects work (test old Wix URLs)
- Contact form submits successfully
- Booking links go to Wix booking
- Reachcode tracking script loads
- Structured data valid (test with Google Rich Results Test)

- [ ] **Step 7: Post-migration tasks**

- Verify Google Search Console
- Update Google Business Profile if needed
- Monitor Cloudflare analytics for 404s
- Notify Reachcode team that the code is installed
