import React from "react";
import useSWR from "swr";
import styles from "../styles/Home.module.css";
import HourForecast from "./HourForecast";
import fetcher from "./fetcher";
import Image from "next/image";


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

  const { data, error } = useSWR(url, fetcher);

  if (!data) return <div>loading weather...</div>;

  const forecast: ForecastPeriod[] = data.properties.periods;
  const focusForecast: ForecastPeriod = forecast[0];

  return (
    <div className="flex flex-col justify-center items-center">
      <HourForecast />
      <div className={styles.card}>
        <h1 className="text-3xl">{focusForecast.name}</h1>
        <p className="text-4xl">{focusForecast.temperature}</p>
        <p>{focusForecast.windSpeed}</p>
        <p>{focusForecast.shortForecast}</p>
        <Image src={focusForecast.icon} height={50} width={50} alt={focusForecast.shortForecast} />
      </div>
      <div className={"flex flex-wrap"}>
        {forecast.slice(1).map((forecast: ForecastPeriod) => {
          if (forecast.isDaytime) {
            return (
              <div key={forecast.number} className={styles.card}>
                <h1>{forecast.name}</h1>
                <p>{forecast.temperature}</p>
                <p>{forecast.windSpeed}</p>
                <p>{forecast.shortForecast}</p>
                <Image height={50} width={50} src={forecast.icon} alt={forecast.shortForecast} />
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Weather;
