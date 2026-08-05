# ShareTheMeal app

ShareTheMeal is a mobile-first React frontend for food donation coordination. Donors can browse NGOs, create food donation posts, choose delivery or pickup, and review their donation activity.

The app works in demo mode without a backend. It can also connect to a backend API for auth and NGO data when `REACT_APP_BACKEND_URL` is configured.

## Features

- Splash and sign-in flow
- Local demo login
- NGO listing and search
- NGO detail pages
- Donation type selection
- Food category and food details forms
- Donation confirmation flow
- Delivery or pickup selection
- Activity history stored in the browser
- Profile screen with donation count

## Tech stack

- React 17
- React Router DOM v5
- CSS Modules
- React Icons
- Create React App

## Run locally

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm start
```

Open `http://localhost:3000`.

## Demo mode

No environment variables are needed for local demo mode.

In demo mode:

- Sign-in is simulated
- NGO data comes from local mock data
- Donations are stored in `localStorage`
- No API keys are required

## Connected backend mode

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Set the backend URL:

```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

The frontend expects these backend endpoints when connected mode is enabled:

- `GET /ngos`
- `GET /user`
- `GET /logout`
- `GET /auth/google`

Requests use cookies with `credentials: "include"`, so the backend must handle sessions and CORS correctly.

## Build

```bash
npm run build
```

The production build is written to `build/`.

## Deployment

Deploy this on Vercel or Netlify.

Vercel settings:

- Framework preset: Create React App
- Build command: `npm run build`
- Output directory: `build`
- Environment variable: add `REACT_APP_BACKEND_URL` only if you have a deployed backend

Netlify settings:

- Build command: `npm run build`
- Publish directory: `build`

If browser refreshes fail on nested routes, configure a single page app fallback.

## Recruiter note

This is one of the better recruiter-facing projects in this folder. It has a complete frontend flow, multiple screens, routing, reusable components, custom hooks, local persistence, and a backend-ready API layer. Deploy the demo mode and add screenshots before linking it on your resume.

## Limitations

- Demo mode stores data in the browser
- Real Google auth needs a backend
- Donation submission is not persisted to a real database yet
- No automated tests are included for the main donation flow
