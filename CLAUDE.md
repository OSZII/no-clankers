# CLAUDE.md — No Clankers

## What is this?

**No Clankers** is a browser-based AI-content firewall for human consumption. It ships as a paid Chrome Extension ($19.99/mo) that lets users set a "Turing Threshold" via a slider. As users scroll Twitter/X, the extension scrapes tweet text, sends it to the SvelteKit API backend, receives an AI-probability score, and mutes content that exceeds the user's tolerance.

The SvelteKit backend is the gatekeeper: it validates the Polar.sh subscription before processing any AI-detection request, ensuring only paying users generate server costs.

---

## Tech Stack

| Layer        | Technology                                                                |
| ------------ | ------------------------------------------------------------------------- |
| Framework    | **SvelteKit** (SSR + API routes)                                          |
| Language     | **TypeScript**                                                            |
| Styling      | **Tailwind CSS v4** + **DaisyUI v5**                                      |
| Auth         | **Better Auth** (Drizzle adapter, Google OAuth, SvelteKit cookies plugin) |
| Database     | **Drizzle ORM** + **PostgreSQL** (via `postgres` driver)                  |
| Payments     | **Polar.sh**                                                              |
| i18n         | **Paraglide JS** (Inlang)                                                 |
| Browser Ext. | Chrome Extension (Manifest V3)                                            |

---

## Project Structure

```
src/
  lib/
    server/
      auth.ts          # Better Auth config (Google OAuth, Drizzle adapter)
      db/              # Drizzle schema & client
    paraglide/         # Auto-generated i18n runtime
    assets/            # Static assets (favicon, etc.)
  routes/
    +layout.svelte     # Root layout (imports layout.css)
    auth/              # Auth pages (login, callback)
    demo/              # Demo / playground routes
  hooks.server.ts      # Server hooks
  hooks.ts             # Universal hooks
```

---

## 🚨 Critical CSS Rules

### 1. NO hard-coded colors — ever

Do **NOT** use raw hex values (`#ff0000`), `rgb()`, `hsl()`, or Tailwind's default color palette directly (`text-blue-500`, `bg-red-600`, etc.).

**Always** use DaisyUI semantic color utilities instead:

```svelte
<!-- ❌ BAD -->
<button class="bg-blue-600 text-white">Click me</button>
<div style="color: #333; background: #f5f5f5;">...</div>

<!-- ✅ GOOD -->
<button class="btn btn-primary">Click me</button>
<div class="bg-base-200 text-base-content">...</div>
```

### 2. Use DaisyUI component classes

DaisyUI provides pre-styled, themeable component classes. **Use them.**

| Need         | Use                                                                 |
| ------------ | ------------------------------------------------------------------- |
| Buttons      | `btn`, `btn-primary`, `btn-secondary`, `btn-ghost`, `btn-outline` … |
| Cards        | `card`, `card-body`, `card-title`, `card-actions`                   |
| Inputs       | `input`, `textarea`, `select`, `checkbox`, `toggle`                 |
| Alerts       | `alert`, `alert-info`, `alert-error`                                |
| Badges       | `badge`, `badge-primary`, `badge-secondary`                         |
| Navigation   | `navbar`, `menu`, `tabs`, `breadcrumbs`                             |
| Modal/Drawer | `modal`, `drawer`                                                   |
| Loading      | `loading`, `skeleton`                                               |
| Typography   | `prose` (via `@tailwindcss/typography`)                             |

### 3. Semantic color tokens (reference)

When you need color outside components, always reach for DaisyUI's semantic tokens:

| Token              | Purpose                          |
| ------------------ | -------------------------------- |
| `primary`          | Brand / CTA color                |
| `secondary`        | Supporting accent                |
| `accent`           | Extra highlight                  |
| `neutral`          | Muted / chrome                   |
| `base-100/200/300` | Surface / background layers      |
| `base-content`     | Default text on base backgrounds |
| `info`             | Informational state              |
| `success`          | Positive state                   |
| `warning`          | Caution state                    |
| `error`            | Destructive / error state        |

Use them as `bg-primary`, `text-primary-content`, `border-secondary`, etc.

---

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run check        # Type-check
npm run lint         # Prettier + ESLint
npm run format       # Auto-format

# Database
npm run db:push      # Push schema to DB
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio

# Auth
npm run auth:schema  # Generate Better Auth schema
```

---

## Environment Variables

See `.env.example` for required variables:

- `DATABASE_URL` — PostgreSQL connection string
- `ORIGIN` — App origin (e.g. `http://localhost:5173`)
- `BETTER_AUTH_SECRET` — Secret for Better Auth
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth credentials
