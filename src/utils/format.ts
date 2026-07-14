import { format, parseISO } from "date-fns";

/* -------------------------------------------------------------------------- */
/*                                Temperature                                 */
/* -------------------------------------------------------------------------- */

export function formatTemp(temp: number, units = "°C"): string {
  return `${temp.toFixed(1)}${units}`;
}

/* -------------------------------------------------------------------------- */
/*                                   Dates                                    */
/* -------------------------------------------------------------------------- */

export function formatDateString(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "EEE, MMM d");
  } catch {
    return dateStr;
  }
}

export function formatFullDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "EEEE, MMMM d");
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

export function formatHour(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "HH:mm");
  } catch {
    return dateStr;
  }
}

/* -------------------------------------------------------------------------- */
/*                                  Numbers                                   */
/* -------------------------------------------------------------------------- */

export function formatPrecipitation(value: number): string {
  return `${value.toFixed(1)} mm`;
}

export function formatWindSpeed(speed: number): string {
  return `${speed.toFixed(1)} m/s`;
}

export function formatNumber(value: number): string {
  return value.toFixed(1);
}

/* -------------------------------------------------------------------------- */
/*                              Wind Direction                                */
/* -------------------------------------------------------------------------- */

const directions = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW",
];

export function getCompassDirection(degree: number): string {
  const index = Math.round(degree / 22.5) % 16;
  return directions[index];
}

/* -------------------------------------------------------------------------- */
/*                            Temperature Trend                               */
/* -------------------------------------------------------------------------- */

export function getTemperatureTrend(
  current: number,
  average: number
): "Rising" | "Falling" | "Stable" {
  const diff = current - average;

  if (diff > 1) return "Rising";

  if (diff < -1) return "Falling";

  return "Stable";
}

/* -------------------------------------------------------------------------- */
/*                           Rain Utility Helpers                             */
/* -------------------------------------------------------------------------- */

export function isRainExpected(value: number): boolean {
  return value > 0;
}

export function formatRainHours(hours: number): string {
  return `${hours} hr${hours === 1 ? "" : "s"}`;
}

/* -------------------------------------------------------------------------- */
/*                              Updated Time                                  */
/* -------------------------------------------------------------------------- */

export function formatUpdated(dateStr: string): string {
  try {
    return `Updated ${format(parseISO(dateStr), "h:mm a")}`;
  } catch {
    return dateStr;
  }
}