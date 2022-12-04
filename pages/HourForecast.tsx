import React from "react";
import fetcher from "./fetcher";
import useSWR from "swr";

interface ForecastPeriod {
  number: number;
  isDaytime: boolean;
  startTime: string;
  endTime: string;
  temperature: number;
  shortForecast: string;
  windSpeed: string;
  icon: string;
}

export const HourForecast: React.FC = () => {
  const url = 'https://api.weather.gov/gridpoints/SEW/118,69/forecast/hourly';

  const { data, error } = useSWR(url, fetcher);
  
  if (!data) return <div>loading hourly forecast...</div>;

  const forecast: ForecastPeriod[] = data.properties.periods;

  //trim to 12 hours
  const trimmedForecast = forecast.slice(0, 6);
  console.log(trimmedForecast);
  console.log(trimmedForecast[0].startTime);

  return (
    <div className='flex overflow-scroll flex-wrap gap-10px'>
      {trimmedForecast.map((forecast: ForecastPeriod) => {
        return (
          <div key={forecast.number} className='flex flex-col justify-center items-center mx-auto p-5'>
            <h1>{forecast.startTime.slice(11,16)}</h1>
            <p>{forecast.temperature}</p>
            <p>{forecast.windSpeed}</p>
            <p>{forecast.shortForecast}</p>
            <img src={forecast.icon} alt={forecast.shortForecast}></img>
          </div>
        );
      })}
    </div>
  );
};

export default HourForecast;
