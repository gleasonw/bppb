import React from "react";
import useWeather from "./useWeather";
import { WeatherBrick } from "./Weather";

export const HourForecast: React.FC = () => {
  const url = "https://gonwsproxy-production.up.railway.app/weather/hour";
  const { data } = useWeather(url);

  if (!data) return <div>loading hourly forecast...</div>;

  const forecast = data.properties ? data.properties.periods : [];
  const trimmedForecast = forecast ? forecast.slice(0, 6) : [];

  return (
    <div className="flex overflow-x-auto gap-10px w-full">
      {trimmedForecast.map((forecast) => {
        return (
          <div
            key={forecast.startTime}
            className="flex flex-col justify-center items-center mx-auto p-7 gap-2 justify-between"
          >
            <h1 className="text-2xl">
              {forecast.startTime && forecast.startTime.slice(11, 16)}
            </h1>
            <p>{forecast.temperature}</p>
            <p>{forecast.windSpeed} mph</p>
            <p className="text-center">{forecast.shortForecast}</p>
            {forecast.precipitationProbability && (
              <p className="text-center">
                {Math.round(forecast.precipitationProbability * 100)}%
              </p>
            )}
            <img
              src={forecast.icon}
              alt={forecast.shortForecast}
              width={50}
              height={50}
            />
          </div>
        );
      })}
    </div>
  );
};

export default HourForecast;
