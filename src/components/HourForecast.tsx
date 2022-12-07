import React from "react";
import fetcher from "./fetcher";
import useWeather from "./useWeather";

export const HourForecast: React.FC = () => {
  const url = "https://api.weather.gov/gridpoints/SEW/116,71/forecast/hourly";
  const { data } = useWeather(url);

  if (!data) return <div>loading hourly forecast...</div>;

  const forecast = data.properties ? data.properties.periods : [];
  const trimmedForecast = forecast ? forecast.slice(0, 6) : [];

  return (
    <div className="flex overflow-x-auto gap-10px w-full">
      {trimmedForecast.map((forecast) => {
        return (
          <div
            key={forecast.number}
            className="flex flex-col justify-center items-center mx-auto p-7 gap-2 justify-between"
          >
            <h1 className='text-2xl'>{forecast.startTime && forecast.startTime.slice(11, 16)}</h1>
            <p>{forecast.temperature}</p>
            <p>{forecast.windSpeed}</p>
            <p className='text-center'>{forecast.shortForecast}</p>
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
