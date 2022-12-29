import React, { ReactComponentElement } from "react";
import styles from "../Home.module.css";
import HourForecast from "./HourForecast";
import useWeather, { ForecastPeriod } from "./useWeather";

export const Weather: React.FC = () => {
  const url = "https://gonwsproxy-production.up.railway.app/weather/week";
  const { data, error } = useWeather(url);

  if (!data)
    return <div className="text-center">loading weather from NWS...</div>;

  const forecast = data.properties ? data.properties.periods : [];
  const focusForecast = forecast && forecast.length > 0 && forecast[0];

  return (
    <div className="flex flex-col justify-center items-center text-white">
      {focusForecast && Object.keys(focusForecast).length > 0 && (
        <div className={styles.card}>
          <WeatherBrick forecast={focusForecast} />
        </div>
      )}
      <HourForecast />
      <h1 className="p-20 text-5xl">Weather for the Week</h1>
      <div className={"flex overflow-auto w-full justify-between"}>
        {forecast &&
          forecast.slice(1).map((forecast) => {
            return (
              <div key={forecast.number} className={styles.card}>
                <WeatherBrick forecast={forecast} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export const WeatherBrick: React.FC<{ forecast: ForecastPeriod }> = ({
  forecast,
}) => {
  const icon = (url: string | undefined, alt: string | undefined) => (
    <img src={url} height={100} width={100} alt={alt} className="mx-auto" />
  );
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-center text-xl">{forecast.name}</h1>
      <p className="text-center">{forecast.temperature}</p>
      <p className="text-center">{forecast.windSpeed} mph</p>
      <p className="text-center">{forecast.shortForecast}</p>
      {forecast.precipitationProbability && (
        <p className="text-center">
          {forecast.precipitationProbability * 100}%
        </p>
      )}
      {icon(forecast.icon, forecast.shortForecast)}
    </div>
  );
};

export default Weather;
