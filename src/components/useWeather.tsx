import useSWR from "swr";

export interface ForecastBatch {
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

function useWeather(url: string): {
  data: ForecastBatch | undefined;
  error: Error | undefined;
} {

  type HttpError = Error & { status?: number };

  const { data, error } = useSWR<ForecastBatch, Error>(url, async (url) => {
    const res = await fetch(url);
    console.log(res)
    if (!res.ok) {
      const error: HttpError = new Error("An error occurred while fetching the data.");
      error.status = res.status;
      throw error;
    }
    const data = await res.json();
    return data;
  });

  return { data, error };
}

export default useWeather;
