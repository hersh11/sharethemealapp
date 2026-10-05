import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import App from "../App";
import { emptyDraft } from "../data/donation";
import { demoUser } from "../data/mockData";
import { STORAGE_KEYS } from "../lib/storage";

export function renderApp({ route = "/", signedIn = true, draft, donations } = {}) {
  if (signedIn) {
    window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(demoUser));
  }

  if (draft) {
    window.sessionStorage.setItem(STORAGE_KEYS.draft, JSON.stringify({ ...emptyDraft, ...draft }));
  }

  if (donations) {
    window.localStorage.setItem(STORAGE_KEYS.donations, JSON.stringify(donations));
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
