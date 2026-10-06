import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import App from "../App";
import { emptyDraft } from "../data/donation";
import { STORAGE_KEYS } from "../lib/storage";

export function renderApp({ route = "/", draft, donations, welcomeDismissed = false } = {}) {
  if (draft) {
    window.sessionStorage.setItem(STORAGE_KEYS.draft, JSON.stringify({ ...emptyDraft, ...draft }));
  }

  if (donations) {
    window.localStorage.setItem(STORAGE_KEYS.donations, JSON.stringify(donations));
  }

  if (welcomeDismissed) {
    window.localStorage.setItem(STORAGE_KEYS.welcomeDismissed, "true");
  }

  return {
    user: userEvent.setup(),
    ...render(
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>,
    ),
  };
}

// Replaces navigator.geolocation for a test. Pass coordinates to succeed or an
// error code (1 = permission denied) to fail.
export function mockGeolocation(result) {
  const getCurrentPosition = (onSuccess, onError) => {
    if (result.code) {
      onError({ code: result.code });
    } else {
      onSuccess({ coords: { latitude: result.lat, longitude: result.lng } });
    }
  };
  Object.defineProperty(window.navigator, "geolocation", {
    configurable: true,
    value: { getCurrentPosition },
  });
}
