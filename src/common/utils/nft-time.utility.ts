// Parse RFC3339 directly so numeric timezone offsets retain their meaning.
// Account cards and inventory details share minute/hour/day boundaries.
export const formatNftRelativeTime = (value: string | null | undefined, now = Date.now()): string => {
  if (!value) return "-";
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return "-";

  const seconds = Math.max(0, Math.floor((now - timestamp) / 1000));
  if (seconds < 60) return "<1m ago";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};
