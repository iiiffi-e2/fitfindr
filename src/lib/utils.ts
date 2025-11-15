import { format } from "date-fns";

export function cn(...classes: Array<string | boolean | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatDateRange(start: Date, end?: Date | null) {
  const startFormatted = format(start, "MMM d, h:mmaaa");
  if (!end) {
    return startFormatted;
  }

  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  const endFormat = sameDay ? "h:mmaaa" : "MMM d, h:mmaaa";
  return `${startFormatted} — ${format(end, endFormat)}`;
}
