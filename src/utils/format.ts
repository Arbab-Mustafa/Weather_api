import { format, parseISO } from "date-fns";

export function formatTemp(temp: number, units = "°C"): string {
  return `${temp.toFixed(1)}${units}`;
}

export function formatDateString(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "EEE, MMM d");
  } catch {
    return dateStr;
  }
}

export function formatTimeString(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "h:mm a");
  } catch {
    return dateStr;
  }
}

export function formatPrecipitation(value: number): string {
  return `${value.toFixed(1)} mm`;
}

export function formatWindSpeed(speed: number): string {
  return `${speed.toFixed(1)} m/s`;
}

export function formatHour(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "HH:mm");
  } catch {
    return dateStr;
  }
}
