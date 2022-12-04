import React from "react";
import useSWR from "swr";
import styles from "../styles/Home.module.css";
import HourForecast from "./HourForecast";

interface ForecastProperties {
  elevation?: number;
  periods: ForecastPeriod;
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
  const url = "https://api.weather.gov/gridpoints/SEW/118,69/forecast";

  const { data, error } = useSWR(url, async (url) => {
    const res = await fetch(url);
    const json = await res.json();
    const forecastData: ForecastPeriod[] = json.properties.periods;
    return forecastData;
  });

  if (!data) return <div>loading weather...</div>;

  const focusForecast = data[0];

  return (
    <div className="flex flex-col justify-center items-center">
      <div className={styles.card}>
        <h1 className="text-3xl">{focusForecast.name}</h1>
        <p className="text-4xl">{focusForecast.temperature}</p>
        <p>{focusForecast.windSpeed}</p>
        <p>{focusForecast.shortForecast}</p>
        <img src={focusForecast.icon} alt={focusForecast.shortForecast}></img>
        <HourForecast/>
      </div>
      <div className={"flex flex-wrap"}>
        {data.slice(1).map((forecast: ForecastPeriod) => {
          if (forecast.isDaytime) {
            return (
              <div key={forecast.number} className={styles.card}>
                <h1>{forecast.name}</h1>
                <p>{forecast.temperature}</p>
                <p>{forecast.windSpeed}</p>
                <p>{forecast.shortForecast}</p>
                <img src={forecast.icon} alt={forecast.shortForecast}></img>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};
