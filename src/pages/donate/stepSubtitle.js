export const TOTAL_STEPS = 4;

export const stepSubtitle = (stepNumber, draft) =>
  `Step ${stepNumber} of ${TOTAL_STEPS} · For ${draft.recipient.name}`;
