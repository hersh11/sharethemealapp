# ShareTheMeal App

A mobile-first food donation frontend built with React. The app helps donors browse NGOs, create food donation posts, choose delivery or pickup, and review donation activity.

This repository currently works in two modes:

- Demo mode: no backend required, uses local mock data and `localStorage`
- Connected mode: uses a backend URL for auth and NGO data

## Features

- Splash and sign-in flow
- NGO browsing and search
- NGO detail pages
- Donation type and food category selection
- Food details form
- Donation confirmation flow
- Delivery or pickup selection
- Activity screen for posted donations
- Profile screen with donation count

## Tech Stack

- React 17
- React Router DOM v5
- CSS Modules
- React Icons
- Create React App (`react-scripts`)

## Project Status

The frontend is runnable and builds successfully.

What works now:

- Full frontend flow for posting a donation
- Local demo login
- Local mock NGO data
- Donation activity saved in browser storage
- Production build with `npm run build`

What is still not fully production-ready:

- No real backend included in this repository
- No real database persistence
- No real donation submission API yet
- Google auth requires a backend implementation

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the app

```bash
npm start
```

The app will run at:

```bash
http://localhost:3000
```

### 3. Create a production build

```bash
npm run build
```

## Running Modes

### Demo Mode

If you do not configure a backend, the app still works locally.

In demo mode:

- sign-in is simulated
- NGOs are loaded from mock data
- donations are stored in `localStorage`
- no API keys are required

This is the easiest way to preview the app.

### Connected Backend Mode

To connect the frontend to a backend, create a `.env.local` file in the project root:

```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

The frontend will then use that backend for supported requests.

## Backend Contract

If `REACT_APP_BACKEND_URL` is set, the frontend expects these endpoints:

- `GET /ngos`
- `GET /user`
- `GET /logout`
- `GET /auth/google`

Notes:

- Requests are sent with `credentials: "include"`
- The backend should support cookies/sessions and proper CORS configuration
- Donation posting is currently handled locally in the frontend, not through a backend endpoint

## API Keys and Services

### Required for demo mode

- None

### Required for connected mode

- A backend API server
- Google OAuth credentials if you want real Google sign-in
- A database if you want persistent NGO/user/donation data

Recommended backend env vars would look something like:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
CLIENT_URL=http://localhost:3000
```

Important:

- Do not put secret keys in the React app
- Only `REACT_APP_BACKEND_URL` belongs in the frontend env file
- All OAuth secrets should live on the backend

## Scripts

From [package.json](/C:/Users/kitka/Desktop/Projects/sharethemealapp/package.json):

- `npm start` - run the development server
- `npm run build` - create a production build
- `npm test` - run tests

## Folder Overview

```text
src/
  components/     Reusable UI pieces
  constants/      Static assets, mock data, form defaults
  hooks/          App data hooks
  pages/          Route-level screens
  services/       API and storage access
public/
  images/         Static image assets
```

## Current Architecture

- `src/App.js` manages routing and top-level flow state
- `src/services/api.js` handles backend and local fallback behavior
- `src/hooks/useAuth.js` handles auth state
- `src/hooks/useNgoData.js` loads NGO data
- `src/hooks/useDonations.js` manages donation history

## Suggested Next Steps

- Add a real backend for donations, users, and NGOs
- Replace local donation storage with API persistence
- Add form validation for phone/date/time
- Add tests for core donation flow
- Add volunteer and pickup management workflows
- Upgrade React and routing stack over time

## Contributing

If you want to extend the project, a good order is:

1. Keep the current demo mode working
2. Add backend support without breaking the local fallback
3. Implement real donation APIs
4. Add tests around the main donation flow

## License

This project is licensed under the terms in [LICENSE](/C:/Users/kitka/Desktop/Projects/sharethemealapp/LICENSE).
