// Currency (GBP by default since you're in the UK)
export const formatCurrency = (value, currency = "GBP") => {
  if (value === null || value === undefined || isNaN(value)) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(value);
};

// Convert UNIX seconds -> readable date
export const formatDate = (unixSeconds) => {
  if (!unixSeconds) return "—";
  const date = new Date(unixSeconds * 1000);
  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Convert UNIX seconds -> date + time
export const formatDateTime = (unixSeconds) => {
  if (!unixSeconds) return "—";
  const date = new Date(unixSeconds * 1000);
  return date.toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Countdown until a timestamp (for auctions)
export const formatCountdown = (timestamp) => {
  if (!timestamp) return "—";

  let end = Number(timestamp);

  // 🛠 Fix: detect milliseconds and convert to seconds
  if (end > 1e12) {
    end = Math.floor(end / 1000);
  }

  const now = Math.floor(Date.now() / 1000);
  let diff = end - now;

  if (diff <= 0) return "Ended";

  const days = Math.floor(diff / 86400);
  diff %= 86400;

  const hours = Math.floor(diff / 3600);
  diff %= 3600;

  const minutes = Math.floor(diff / 60);

  // UX-friendly output
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

// Capitalise labels (e.g. "open" -> "Open")
export const capitalise = (text = "") => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
