export interface CurrentWeather {
  temperature?: number;
  windspeed?: number;
  winddirection?: number;
  weathercode?: number;
  is_day?: number;
}

export interface DailyWeather {
  date: string;
  temp_max?: number;
  temp_min?: number;
  precipitation?: number;
  weathercode?: number;
}

export interface HourlyWeather {
  time: string;
  temp?: number;
  precipitation?: number;
  weathercode?: number;
}

export interface WeatherResponse {
  current: CurrentWeather;
  daily: DailyWeather[];
  hourly: HourlyWeather[];
  ai_summary: any;
}
