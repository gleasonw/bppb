import useSWR from "swr";

interface ForecastBatch {
  properties?: {
    periods?: ForecastPeriod[];
  };
}

interface ForecastPeriod {
  number?: number;
  name?: string;
  startTime?: string;
  endTime?: string;
  isDaytime?: boolean;
  temperature?: number;
  temperatureUnit?: string;
  temperatureTrend?: string;
  windSpeed?: string;
  windDirection?: string;
  icon?: string;
  shortForecast?: string;
  detailedForecast?: string;
}

interface Props {
  url: string;
}

function useWeather(url: string): {
  data: ForecastBatch | undefined;
  error: Error | undefined;
} {
  const { data, error } = useSWR<ForecastBatch, Error>(url, async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  });

  return { data, error };
}

export default useWeather;
