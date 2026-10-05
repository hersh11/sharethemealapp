import { useDonationDraft } from "../context/contexts";
import { getBlockingStepPath } from "../lib/donationFlow";

// Returns where to send the user when an earlier donation step is unfinished,
// or null when `stepKey` can be shown.
export const useBlockingStep = (stepKey) => {
  const { draft } = useDonationDraft();
  return getBlockingStepPath(draft, stepKey);
};
