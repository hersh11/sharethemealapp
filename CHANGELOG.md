# Changelog

## 2.2.0 (2026-10-06)

- Cooked food can only be picked up within 6 hours of cooking (always at least an hour); the pickup step shows the deadline and limits the date picker. Raw and packed food keep the 14-day window.
- "Sort by distance" orders NGOs by the visitor's location and shows how far each one is. When the visitor is far from the demo NGOs, it says so.
- Visitors land on Home as a guest instead of a sign-in screen, with a dismissible welcome banner. Demo mode has no sign-out.
- New logo matching the purple theme, illustrated NGO avatars, and a laptop layout with a sidebar and card grids. NGO pages list their upcoming campaigns.

## 2.1.0 (2026-10-05)

- Canonical link, `og:url`, `sitemap.xml` and `robots.txt` generated at build time from the site URL (`SITE_URL`, or Vercel's and Netlify's production URL).
- `WebApplication` structured data (JSON-LD) and `llms.txt`.
- Poppins is self-hosted, so the site makes no third-party requests.
- The NGO page's heading is now the NGO's name; the landing page has a descriptive title; the 404 page is `noindex`.

## 2.0.0 (2026-10-05)

Rebuilt so the app can be deployed as a static site.

### Tooling

- Moved from Create React App (deprecated) to Vite 8.
- Upgraded React 17 to 19 and React Router 5 to 8.
- Added Vitest and Testing Library tests for the full donation flow, validation, step guards, activity and profile.
- Added ESLint 10, a GitHub Actions workflow (lint, test, build), `.nvmrc` and an `engines` field.
- Added `vercel.json` and `netlify.toml` with single-page-app fallbacks, so refreshing a nested route no longer 404s.
- `npm audit` reports 0 vulnerabilities, down from the CRA dependency tree's warnings.

### App

- Donation flow moved under `/donate/*` with a step indicator, a draft that survives a refresh, and redirects to the first unfinished step.
- Choosing "Donate to an NGO" now leads to the NGO list instead of skipping the NGO choice.
- Proper validation and error messages for meals, address, phone, date and time.
- Delivery choice is a confirm step instead of posting the moment a button is pressed.
- Activity shows a confirmation after posting and lets you cancel donations.
- Profile shows donation stats, working shortcuts and a "clear demo data" option.
- Added a 404 page, an error boundary, per-page titles and scroll reset on navigation.
- Removed controls that did nothing (Facebook login, Chat and Volunteer buttons, Events and Reviews tabs, the disabled Hunger Spot tab and the unreachable role page).
- Replaced fixed pixel widths that overflowed on phones narrower than 414px.
- Replaced the NGO photos, which were banners with "NGO" printed on them, with initials avatars.
- Replaced the dead placeholder avatar service and the hotlinked Unsplash image.
- Compressed the category images from about 3.5 MB of PNG to about 140 KB of WebP.
- Demo NGOs are now fictional organisations instead of real charities with made-up statistics.
- Added a favicon, web manifest and description and Open Graph tags.

## 1.x (2024–2026)

- Original Create React App version, then a refactor in April 2026: shared API service and hooks, NGO lookup by id, multi-select meals, fixed range sliders, CSS modules everywhere, and a Windows-friendly build script.
