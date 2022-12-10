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
    const data = await res.json();
    console.log(data);
    return data;
  }, {
    onErrorRetry: (error: HttpError, key, config, revalidate, { retryCount }) => {
      // Never retry on 404.
      if (error.status === 404) return;

      // Only retry up to 10 times.
      if (retryCount >= 10) return;

      // Retry after 5 seconds.
      setTimeout(() => revalidate({ retryCount }), 5000);
    }
  }
  );

  return { data, error };
}

export default useWeather;
