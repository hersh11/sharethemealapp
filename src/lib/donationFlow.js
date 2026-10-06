import { SAFE_PREPARED_HOURS, deliveryModes } from "../data/donation";
import { addDays, formatDay, formatTime, toDateInputValue, toTimeInputValue } from "./dates";

export const MAX_DAYS_AHEAD = 14;
// Even food that's already near its limit gets a short window to be collected.
export const MIN_COOKED_PICKUP_HOURS = 1;

// Cooked food has to be collected before it has been out for
// SAFE_PREPARED_HOURS. Returns the latest allowed pickup time, or null when the
// food keeps for days (raw and packed food).
export const latestPickupTime = (draft, now = new Date()) => {
  if (draft.category !== "Cooked Food") {
    return null;
  }

  const hoursLeft = Math.max(SAFE_PREPARED_HOURS - draft.preparedHoursAgo, MIN_COOKED_PICKUP_HOURS);
  return new Date(now.getTime() + hoursLeft * 60 * 60 * 1000);
};

export const describeDeadline = (deadline, now = new Date()) => {
  const time = formatTime(toTimeInputValue(deadline));
  const day = toDateInputValue(deadline);
  return day === toDateInputValue(now) ? `${time} today` : `${time} on ${formatDay(day)}`;
};

export const validateContactDetails = (draft, now = new Date()) => {
  const errors = {};
  const today = toDateInputValue(now);
  const phone = draft.phone.trim();
  const phoneDigits = phone.replace(/\D/g, "");
  const deadline = latestPickupTime(draft, now);
  const cookedMessage = deadline ? `Cooked food has to be picked up by ${describeDeadline(deadline, now)}.` : "";

  if (draft.address.trim().length < 8) {
    errors.address = "Enter the full pickup address.";
  }

  if (!/^\+?[\d\s()-]+$/.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
    errors.phone = "Enter a valid phone number (7 to 15 digits).";
  }

  if (!draft.date) {
    errors.date = "Choose a date.";
  } else if (draft.date < today) {
    errors.date = "The date can't be in the past.";
  } else if (deadline && draft.date > toDateInputValue(deadline)) {
    errors.date = cookedMessage;
  } else if (draft.date > toDateInputValue(addDays(now, MAX_DAYS_AHEAD))) {
    errors.date = `Choose a date within the next ${MAX_DAYS_AHEAD} days.`;
  }

  if (!draft.time) {
    errors.time = "Choose a time.";
  } else if (draft.date === today && draft.time < toTimeInputValue(now)) {
    errors.time = "That time has already passed.";
  } else if (deadline && !errors.date && new Date(`${draft.date}T${draft.time}`) > deadline) {
    errors.time = cookedMessage;
  }

  if (!draft.acceptedGuidelines) {
    errors.acceptedGuidelines = "Please confirm the food follows the guidelines.";
  }

  return errors;
};

// The steps of the donation flow, in order. A step can only be opened once
// every step before it is complete.
export const donationSteps = [
  { key: "recipient", path: "/donate", isComplete: (draft) => Boolean(draft.recipient) },
  { key: "category", path: "/donate/category", isComplete: (draft) => Boolean(draft.category) },
  {
    key: "food",
    path: "/donate/food",
    isComplete: (draft) => draft.meals.length > 0 && draft.servings > 0,
  },
  {
    key: "review",
    path: "/donate/review",
    isComplete: (draft) => Object.keys(validateContactDetails(draft)).length === 0,
  },
  { key: "delivery", path: "/donate/delivery", isComplete: () => true },
];

// Returns the path of the first unfinished step before `stepKey`, or null when
// the user is allowed to be on `stepKey`.
export const getBlockingStepPath = (draft, stepKey) => {
  for (const step of donationSteps) {
    if (step.key === stepKey) {
      return null;
    }

    if (!step.isComplete(draft)) {
      return step.path;
    }
  }

  return null;
};

const createId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const buildDonation = (draft, now = new Date()) => {
  const mode = deliveryModes.find((option) => option.value === draft.deliveryMode) ?? deliveryModes[0];

  return {
    id: createId(),
    createdAt: now.toISOString(),
    status: mode.status,
    recipient: draft.recipient,
    category: draft.category,
    foodType: draft.foodType,
    meals: draft.meals,
    servings: draft.servings,
    preparedHoursAgo: draft.category === "Cooked Food" ? draft.preparedHoursAgo : null,
    address: draft.address.trim(),
    phone: draft.phone.trim(),
    date: draft.date,
    time: draft.time,
    deliveryMode: mode.value,
  };
};
