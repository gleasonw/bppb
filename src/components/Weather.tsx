import React, { ReactComponentElement } from "react";
import styles from "../Home.module.css";
import HourForecast from "./HourForecast";
import useWeather from "./useWeather";

export const Weather: React.FC = () => {
  const url = "https://api.weather.gov/gridpoints/SEW/116,71/forecast";

  const { data } = useWeather(url);

  if (!data) return <div>loading weather...</div>;

  const forecast = data.properties ? data.properties.periods : [];
  const focusForecast = forecast && forecast.length > 0 && forecast[0];

  const icon = (url: string | undefined, alt: string | undefined) => (
    <img src={url} height={100} width={100} alt={alt} className="mx-auto" />
  );

  return (
    <div className="flex flex-col justify-center items-center text-slate-50">
      {focusForecast && Object.keys(focusForecast).length > 0 && (
        <div className={styles.card}>
          <h1 className="text-3xl">{focusForecast && focusForecast.name}</h1>
          <p className="text-4xl">{focusForecast.temperature}</p>
          <p>{focusForecast.windSpeed}</p>
          <p>{focusForecast.shortForecast}</p>
          {icon(focusForecast.icon, focusForecast.shortForecast)}
        </div>
      )}
      <HourForecast />
      <h1 className="p-20 text-5xl">Weather for the Week</h1>
      <div className={"flex overflow-auto w-full justify-between"}>
        {forecast &&
          forecast.slice(1).map((forecast) => {
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
