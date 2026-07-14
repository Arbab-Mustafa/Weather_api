export interface CurrentWeather {
  time: string;
  interval: number;
  temperature: number;
  windspeed: number;
  winddirection: number;
  is_day: number;
  weathercode: number;
}

export interface DailyWeather {
  date: string;
  temp_max: number;
  temp_min: number;
  precipitation: number;
  weathercode: number;
}

export interface HourlyWeather {
  time: string;
  temp: number;
  precipitation: number;
  weathercode: number;
}

export interface AISummary {
  summary: string;
  highlights: string[];
  updated_at: string;
}

/* ---------------------------------------------
 * Derived Types (Computed from API response)
 * --------------------------------------------*/

export interface WeatherOverview {
  currentTemp: number;
  todayHigh: number;
  todayLow: number;
  todayRain: number;
  weatherCode: number;
  updatedAt: string;
  isDay: boolean;
}

export interface WeatherStatistics {
  averageTemp: number;
  highestTemp: number;
  lowestTemp: number;

  warmestHour: string;
  coolestHour: string;

  rainyHours: number;
  dryHours: number;

  totalRainfall: number;
}

export interface WeatherInsight {
  summary: string;
  highlights: string[];
}

export interface WeatherResponse {
  current: CurrentWeather;

  daily: DailyWeather[];

  hourly: HourlyWeather[];

  ai_summary: AISummary | null;

  /* Derived */

  overview: WeatherOverview;

  statistics: WeatherStatistics;

  insight: WeatherInsight;
}
