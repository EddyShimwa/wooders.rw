# Wooders.rw Upgrade Guide (Decluttered)

A Rwanda-first product and design guide focused on brand trust, mobile usability, and WhatsApp conversion.

## 1) Rwanda-First Product Principles

- Design for mobile-first browsing on variable network quality.
- Keep WhatsApp as the primary conversion channel.
- Make delivery confidence visible at decision points.
- Keep local authenticity explicit: crafted in Rwanda, by named artisans where possible.
- Serve both local buyers and diaspora buyers with clear pricing and communication.

## 2) Brand Direction

### Positioning
Wooders is premium Rwandan craftsmanship with modern purchase confidence.

### Brand Promise
- Handcrafted quality
- Transparent process
- Reliable delivery communication

### Voice
- Warm, clear, confident
- Specific over vague luxury language
- Consistent across site, WhatsApp, and order updates

### Core Message Stack
- Crafted in Rwanda
- Built for legacy
- Guided purchase support on WhatsApp

## 3) UI System Priorities

### Visual System
- Keep a wood-forward premium look, but reduce visual clutter and heavy effects.
- Use semantic design tokens (`--color-bg`, `--color-text-primary`, `--color-action-primary`, etc.).
- Keep contrast at WCAG AA minimum.

### Typography and Layout
- Maximum two font families.
- Clear heading/body scale with consistent spacing rhythm.
- Scannable sections with shorter paragraph blocks.

### Components to Improve First
1. Product cards
- Faster image loading
- Clearer price and lead-time hints
- Stable hover/focus behavior on touch and desktop

2. Header and navigation
- Clear active states
- Lightweight mobile drawer interactions

3. Product detail and lightbox
- Better visibility of dimensions, material, and lead time
- Stronger WhatsApp CTA with structured context payload

4. Trust modules
- Reusable "Made in Rwanda", "Delivery updates", and "Payment confidence" badges

## 4) UX Architecture

### Information Structure
- Home: brand story, featured collection, trust proof, testimonials, CTA.
- Collection: fast browse, search, filter.
- Product details: decision support + conversion CTA.
- Order tracking: clear status and next action.

### Funnel
1. Discovery
2. Evaluation
3. WhatsApp handoff
4. Post-purchase trust and retention

### Performance Guardrails
- Keep gallery style but cap visible tiles and eager image loads.
- Lazy-load below-the-fold media and non-critical modules.
- Use measurable budgets for LCP, CLS, and blocking time.

### Accessibility Baseline
- Focus-visible states on all interactive elements.
- Minimum 44px touch targets on mobile.
- Respect reduced-motion preferences.

### Localization and Currency
- English primary with Kinyarwanda support on high-intent conversion copy.
- RWF default with optional USD for diaspora context.

## 5) UX Research Program

### Questions to Validate
- What information must users see before they contact via WhatsApp?
- What causes drop-off between product view and WhatsApp handoff?
- Which trust signals most improve purchase confidence?
- How do local and diaspora buyers differ in decision criteria?

### Methods
1. Moderated usability testing with local and diaspora participants
2. WhatsApp handoff quality analysis
3. Product-page intercept survey on exit intent
4. Accessibility scenario testing (keyboard, screen reader, reduced motion)

### Key Metrics
- Handover Conversion Rate (north star)
- Product page to WhatsApp CTR
- Inquiry completeness score
- Order tracking self-service rate
- Usability task completion rate

## 6) Priority Backlog

### Priority A (Highest)
1. Structured WhatsApp handoff payload (product, specs, location, contact preference)
2. Delivery transparency module (lead time + status stages)
3. Trust stack near CTA (Made in Rwanda, delivery updates, support coverage)
4. Mobile performance cleanup in hero/gallery and media loading

### Priority B
1. Persistent wishlist
2. Compare module (size, material, price)
3. Sold-out waitlist capture
4. EN/RW high-intent microcopy coverage

### Priority C
1. Bespoke builder before WhatsApp handoff
2. B2B inquiry path for offices, hospitality, and commercial spaces
3. Room-scale confidence aid for furniture placement

## 7) Governance

- Maintain one source of truth for tokens, copy tone, and component variants.
- Define clear owners for brand consistency, UX quality, performance, and research.
- Keep a lightweight brand and UX audit checklist for recurring quality control.

## 8) Success Scorecard

Track continuously:
- Handover Conversion Rate
- Product engagement depth
- WhatsApp inquiry quality
- Delivery trust score
- Core performance vitals
- Accessibility compliance pass rate

Wooders should feel unmistakably premium and unmistakably Rwandan while converting better on the channels customers already trust.
