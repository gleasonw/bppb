import React, { ReactComponentElement } from "react";
import useSWR from "swr";
import styles from "../Home.module.css";
import HourForecast from "./HourForecast";
import fetcher from "./fetcher";

interface ForecastBatch {
  properties?: {
    periods: ForecastPeriod[];
  };
}

interface ForecastPeriod {
  number: number;
  name: string;
  startTime: string;
  endTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: string;
  temperatureTrend: string;
  windSpeed: string;
  windDirection: string;
  icon: string;
  shortForecast: string;
  detailedForecast: string;
}

export const Weather: React.FC = () => {
  const url = "https://api.weather.gov/gridpoints/SEW/116,71/forecast";

  const { data, error } = useSWR(url, fetcher);

  if (!data) return <div>loading weather...</div>;
  const batch = data as ForecastBatch;

  const forecast: ForecastPeriod[] = batch.properties
    ? batch.properties.periods
    : [];
  const focusForecast: ForecastPeriod = forecast[0];

  const icon = (url: string, alt: string) => (
    <img src={url} height={100} width={100} alt={alt} className="mx-auto" />
  );

  return (
    <div className="flex flex-col justify-center items-center text-slate-50">
      <div className={styles.card}>
        <h1 className="text-3xl">{focusForecast.name}</h1>
        <p className="text-4xl">{focusForecast.temperature}</p>
        <p>{focusForecast.windSpeed}</p>
        <p>{focusForecast.shortForecast}</p>
        {icon(focusForecast.icon, focusForecast.shortForecast)}
      </div>
      <HourForecast />
      <h1 className="p-20 text-5xl">Weather for the Week</h1>
      <div className={"flex overflow-auto w-full justify-between"}>
        {forecast.slice(1).map((forecast: ForecastPeriod) => {
          if (forecast.isDaytime) {
            return (
              <div key={forecast.number} className={styles.card}>
                <h1>{forecast.name}</h1>
                <p>{forecast.temperature}</p>
                <p>{forecast.windSpeed}</p>
                <p>{forecast.shortForecast}</p>
                {icon(forecast.icon, forecast.shortForecast)}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Weather;
