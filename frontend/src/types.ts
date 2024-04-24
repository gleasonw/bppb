export type Weather = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

export type BaseWeatherData = {
  dt: number;
  sunrise: number;
  sunset: number;
  pressure: number;
  humidity: number;
  dewPoint: number;
  uvi: number;
  feels_like: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  weather: Weather[];
};

export type HourlyWeatherData = BaseWeatherData & {
  temp: number;
  feels_like: number;
};

type DayTemperature = {
  day: number;
  min: number;
  max: number;
  night: number;
  eve: number;
  morn: number;
};

type DayFeelsLike = {
  day: number;
  night: number;
  eve: number;
  morn: number;
};

export type DailyWeatherData = BaseWeatherData & {
  temp: DayTemperature;
  feels_like: DayFeelsLike;
  summary: string;
};

export type OpenWeatherResponse = {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: BaseWeatherData;
  hourly: HourlyWeatherData[];
  daily: DailyWeatherData[];
};
