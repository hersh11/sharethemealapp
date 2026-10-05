import { useCallback, useEffect, useMemo, useState } from "react";
import { emptyDraft } from "../data/donation";
import { demoNgos } from "../data/mockData";
import { buildDonation } from "../lib/donationFlow";
import { localStore, sessionStore, STORAGE_KEYS } from "../lib/storage";
import { authService, isDemoMode, ngoService } from "../services/api";
import { AuthContext, DonationDraftContext, DonationsContext, NgoContext } from "./contexts";

function AuthProvider({ children }) {
  const [state, setState] = useState(() =>
    isDemoMode
      ? { status: "ready", user: authService.getStoredUser() }
      : { status: "loading", user: null },
  );

  useEffect(() => {
    if (isDemoMode) {
      return undefined;
    }

    let isActive = true;
    authService.getCurrentUser().then(
      (user) => isActive && setState({ status: "ready", user }),
      () => isActive && setState({ status: "ready", user: null }),
    );

    return () => {
      isActive = false;
    };
  }, []);

  const signIn = useCallback(() => {
    const user = authService.signIn();

    if (user) {
      setState({ status: "ready", user });
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authService.signOut();
    } finally {
      setState({ status: "ready", user: null });
    }
  }, []);

  const value = useMemo(() => ({ ...state, signIn, signOut }), [state, signIn, signOut]);

  return <AuthContext value={value}>{children}</AuthContext>;
}

function NgoProvider({ children }) {
  const [state, setState] = useState(() =>
    isDemoMode
      ? { status: "ready", ngos: demoNgos, error: "" }
      : { status: "loading", ngos: [], error: "" },
  );

  const fetchNgos = useCallback(
    () =>
      ngoService.getAll().then(
        (ngos) => setState({ status: "ready", ngos, error: "" }),
        () => setState({ status: "error", ngos: [], error: "We couldn't load NGOs right now." }),
      ),
    [],
  );

  useEffect(() => {
    if (!isDemoMode) {
      fetchNgos();
    }
  }, [fetchNgos]);

  const reload = useCallback(() => {
    setState((current) => ({ ...current, status: "loading", error: "" }));
    fetchNgos();
  }, [fetchNgos]);

  const value = useMemo(
    () => ({
      ...state,
      reload,
      getNgo: (id) => state.ngos.find((ngo) => ngo.id === id) ?? null,
    }),
    [state, reload],
  );

  return <NgoContext value={value}>{children}</NgoContext>;
}

const loadDonations = () => {
  const stored = localStore.get(STORAGE_KEYS.donations, []);
  return Array.isArray(stored) ? stored : [];
};

function DonationsProvider({ children }) {
  const [donations, setDonations] = useState(loadDonations);

  useEffect(() => {
    localStore.set(STORAGE_KEYS.donations, donations);
  }, [donations]);

  const addDonation = useCallback((draft) => {
    const donation = buildDonation(draft);
    setDonations((current) => [donation, ...current]);
    return donation;
  }, []);

  const cancelDonation = useCallback((id) => {
    setDonations((current) =>
      current.map((donation) => (donation.id === id ? { ...donation, status: "Cancelled" } : donation)),
    );
  }, []);

  const clearDonations = useCallback(() => setDonations([]), []);

  const value = useMemo(
    () => ({ donations, addDonation, cancelDonation, clearDonations }),
    [donations, addDonation, cancelDonation, clearDonations],
  );

  return <DonationsContext value={value}>{children}</DonationsContext>;
}

const loadDraft = () => {
  const stored = sessionStore.get(STORAGE_KEYS.draft, null);
  return stored && typeof stored === "object" ? { ...emptyDraft, ...stored } : emptyDraft;
};

function DonationDraftProvider({ children }) {
  const [draft, setDraft] = useState(loadDraft);

  useEffect(() => {
    sessionStore.set(STORAGE_KEYS.draft, draft);
  }, [draft]);

  const updateDraft = useCallback((patch) => {
    setDraft((current) => ({ ...current, ...(typeof patch === "function" ? patch(current) : patch) }));
  }, []);

  const resetDraft = useCallback(() => setDraft(emptyDraft), []);

  const value = useMemo(() => ({ draft, updateDraft, resetDraft }), [draft, updateDraft, resetDraft]);

  return <DonationDraftContext value={value}>{children}</DonationDraftContext>;
}

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <NgoProvider>
        <DonationsProvider>
          <DonationDraftProvider>{children}</DonationDraftProvider>
        </DonationsProvider>
      </NgoProvider>
    </AuthProvider>
  );
}
