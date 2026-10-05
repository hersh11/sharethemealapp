const LOCALE = "en-IN";

const pad = (value) => String(value).padStart(2, "0");

// Formats a Date as YYYY-MM-DD in local time, the format <input type="date"> uses.
export const toDateInputValue = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

// Formats a Date as HH:MM in local time, the format <input type="time"> uses.
export const toTimeInputValue = (date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;

export const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const formatDay = (dateValue) =>
  new Date(`${dateValue}T00:00`).toLocaleDateString(LOCALE, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

export const formatTime = (timeValue) => {
  const [hours, minutes] = timeValue.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString(LOCALE, { hour: "numeric", minute: "2-digit" });
};

export const formatHours = (hours) => `${hours} ${hours === 1 ? "hour" : "hours"}`;

export const formatHoursAgo = (hours) => (hours === 0 ? "Just now" : `${formatHours(hours)} ago`);

export const formatDateTime = (isoString) =>
  new Date(isoString).toLocaleString(LOCALE, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
