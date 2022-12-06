import React from "react";
import fetcher from "./fetcher";
import useWeather from "./useWeather";

export const HourForecast: React.FC = () => {
  const url = "https://api.weather.gov/gridpoints/SEW/116,71/forecast/hourly";

  const { data, error } = useWeather(url);

  if (!data) return <div>loading hourly forecast...</div>;

  const forecast = data.properties ? data.properties.periods : [];

  //trim to 12 hours
  const trimmedForecast = forecast ? forecast.slice(0, 12) : [];

  return (
    <div className="flex overflow-x-auto gap-10px w-full">
      {trimmedForecast.map((forecast) => {
        return (
          <div
            key={forecast.number}
            className="flex flex-col justify-center items-center mx-auto p-5"
          >
            <h1>{forecast.startTime && forecast.startTime.slice(11, 16)}</h1>
            <p>{forecast.temperature}</p>
            <p>{forecast.windSpeed}</p>
            <p>{forecast.shortForecast}</p>
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
