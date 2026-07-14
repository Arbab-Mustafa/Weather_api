export interface CurrentWeather {
  time: string; // ISO date string
  interval: number; // seconds
  temperature: number;
  windspeed: number;
  winddirection: number; // degrees
  is_day: number; // 1 = day, 0 = night
  weathercode: number; // WMO code
}

export interface DailyWeather {
  date: string; // YYYY-MM-DD
  temp_max: number;
  temp_min: number;
  precipitation: number; // mm (cumulative)
  weathercode: number;
}

export interface HourlyWeather {
  time: string; // ISO date string
  temp: number;
  precipitation: number; // mm
  weathercode: number;
}

export interface AISummary {
  summary: string;
  highlights: string[];
  updated_at: string;
}

export interface WeatherResponse {
  current: CurrentWeather;
  daily: DailyWeather[];
  hourly: HourlyWeather[];
  ai_summary: AISummary | null;
}
