import useSWR from "swr";
import { OpenWeatherResponse } from "../types";

function useWeather(url: string): {
  data: OpenWeatherResponse | undefined;
  error: Error | undefined;
} {
  type HttpError = Error & { status?: number };

  const { data, error } = useSWR<OpenWeatherResponse, Error>(
    url,
    async (url) => {
      const res = await fetch(url);
      if (!res.ok) {
        const error: HttpError = new Error(
          "An error occurred while fetching the data."
        );
        error.status = res.status;
        throw error;
      }
      const data = await res.json();
      return data;
    }
  );

  return { data, error };
}

export default useWeather;
