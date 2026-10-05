# ShareTheMeal

A mobile-first web app for donating surplus food. Donors pick a nearby NGO or hunger spot, describe the food, choose a pickup slot, and track every donation they have posted.

It runs entirely in the browser in demo mode, so it can be deployed as a static site with no backend.

## Features

- Demo sign-in, or Google sign-in when a backend is connected
- NGO directory with search by name or area, and a detail page for each NGO
- Four-step donation flow: category, food details, pickup details, delivery
- Validation on every step (meal choice, address, phone, date in the next 14 days, time not in the past)
- Food safety prompts, such as a warning when cooked food is more than 6 hours old
- The in-progress donation survives a page refresh, and the flow sends you back to the first unfinished step if you jump ahead
- Activity feed with status, cancellation, and a confirmation after posting
- Profile with donation stats and a "clear demo data" option
- Works from 320px phones up to desktop, keyboard accessible, with labelled form fields and error messages

## Tech stack

- React 19 and React Router 8
- Vite 8
- CSS Modules
- Vitest and Testing Library
- ESLint 10 (flat config)
- GitHub Actions CI (lint, test, build)

## Getting started

You need Node.js 22.22 or newer (the repo pins Node 24 in `.nvmrc`). With [fnm](https://github.com/Schniz/fnm) or nvm:

```bash
fnm use --install-if-missing
```

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open http://localhost:5173 and click **Try the demo**.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run check` | Lint, test and build, the same as CI |

## Demo mode and backend mode

With no environment variables set, the app runs in **demo mode**:

- Sign-in creates a local guest user
- NGOs come from `src/data/mockData.js` (the organisations are fictional)
- Donations are saved in `localStorage`, and the donation in progress is saved in `sessionStorage`

To connect a backend, copy `.env.example` to `.env.local` and set:

```env
VITE_BACKEND_URL=https://api.example.com
```

The app then expects these endpoints, called with cookies (`credentials: "include"`), so the backend must allow CORS with credentials from the site's origin:

| Endpoint | Purpose |
| --- | --- |
| `GET /auth/google` | Starts Google sign-in, then redirects back to the app |
| `GET /user` | Returns `{ "user": { "name", "email", "profilePic" } }` or `{ "user": null }` |
| `GET /logout` | Ends the session |
| `GET /ngos` | Returns an array of NGOs |

NGO objects can use the current field names (`id`, `name`, `area`, `mealsNeeded`, …) or the original backend's (`_id`, `NGOName`, `mealsRequired`, `time`, `reviews`, `totalFeeds`, …). See `normalizeNgo` in `src/services/api.js`.

Donations are always stored in the browser for now, even in backend mode.

## Deploying

The production build is a static site in `dist/`. Every route has to fall back to `index.html` so that refreshing a page like `/ngos/roti-relay` works, and config for that is included for both hosts below.

**Vercel** (`vercel.json`): import the repository at vercel.com/new. The Vite preset and build settings are detected automatically. Name the project `sharethemealapp` to keep the URL in the repo description.

**Netlify** (`netlify.toml`): import the repository. The build command and publish directory are read from the config file.

Set `VITE_BACKEND_URL` in the host's environment settings only if you have a deployed backend.

## Search engines and metadata

- Each page sets its own `<title>`. The landing page has a meta description, Open Graph tags and `WebApplication` structured data (JSON-LD).
- `robots.txt`, `sitemap.xml`, the canonical link and `og:url` are generated at build time by `tools/siteMeta.js`. The site URL comes from `SITE_URL`, or automatically from Vercel (`VERCEL_PROJECT_PRODUCTION_URL`, which switches to your custom domain once you add one) or Netlify (`URL`).
- `public/llms.txt` describes the site for AI assistants.
- The 404 page is marked `noindex`. Production builds ship without source maps.
- Fonts are self-hosted (`@fontsource/poppins`), so the site makes no third-party requests and sets no cookies. It only uses `localStorage` and `sessionStorage` for the visitor's own data, so it doesn't need a cookie banner.

## Project structure

```
src/
  components/   Shared UI (layout, nav, buttons, cards, error boundary)
  context/      Auth, NGO, donation and donation-draft state
  data/         Demo data, donation options and images
  hooks/        Custom hooks
  lib/          Storage, dates, and donation-flow rules and validation
  pages/        Route components; the donation flow lives in pages/donate
  services/     Backend API client
  styles/       Global styles and shared CSS module
  test/         Test setup and helpers
```

## License

MIT, see [LICENSE](LICENSE).
