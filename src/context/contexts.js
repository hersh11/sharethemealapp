import { createContext, useContext } from "react";

export const AuthContext = createContext(null);
export const NgoContext = createContext(null);
export const DonationsContext = createContext(null);
export const DonationDraftContext = createContext(null);

const useRequiredContext = (context, hookName) => {
  const value = useContext(context);

  if (value === null) {
    throw new Error(`${hookName} must be used inside <AppProviders>.`);
  }

  return value;
};

export const useAuth = () => useRequiredContext(AuthContext, "useAuth");
export const useNgos = () => useRequiredContext(NgoContext, "useNgos");
export const useDonations = () => useRequiredContext(DonationsContext, "useDonations");
export const useDonationDraft = () => useRequiredContext(DonationDraftContext, "useDonationDraft");
