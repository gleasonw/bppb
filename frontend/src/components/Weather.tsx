import React, { ReactComponentElement } from "react";
import styles from "../Home.module.css";
import useWeather from "./useWeather";
import {
  BaseWeatherData,
  DailyWeatherData,
  HourlyWeatherData,
  OpenWeatherResponse,
} from "../types";

function Card(props: { children: React.ReactNode }) {
  return <div className={styles.card}>{props.children}</div>;
}

export const Weather: React.FC = () => {
  const url = "https://bppb-production.up.railway.app/weather";
  const { data, error } = useWeather(url);

  if (error) return <div>Error fetching weather</div>;

  if (!data) return <div className="text-center">loading weather...</div>;

  const hourForecast = data.hourly;
  const dayForecast = data.daily;

  const currentForecast = data.current;

  return (
    <div className="flex flex-col justify-center gap-10 pt-10 items-center text-white">
      {currentForecast && Object.keys(currentForecast).length > 0 && (
        <CurrentWeatherBrick forecast={currentForecast} />
      )}
      <div className={"flex overflow-auto w-full gap-8 justify-between"}>
        {hourForecast &&
          hourForecast.slice(1, 10).map((forecast, i) => {
            return <HourWeatherBrick forecast={forecast} key={i} />;
          })}
      </div>
      <h1 className="p-20 text-5xl">Weather for the Week</h1>
      <div className={"flex overflow-auto w-full gap-8 justify-between"}>
        {dayForecast &&
          dayForecast.slice(1, 10).map((forecast, i) => {
            return <DayWeatherBrick forecast={forecast} key={i} />;
          })}
      </div>
    </div>
  );
};

function CurrentWeatherBrick(props: { forecast: BaseWeatherData }) {
  const weatherForHour = props.forecast.weather.at(0);

  if (!weatherForHour) return <div>no weather for hour</div>;

  const icon =
    "https://openweathermap.org/img/wn/" + weatherForHour.icon + ".png";

  return (
    <Card>
      <p className="text-center">{props.forecast.feels_like}</p>
      <p className="text-center">{props.forecast.wind_speed} mph</p>
      <img
        src={icon}
        height={100}
        width={100}
        alt={props.forecast.weather.at(0)?.description}
      />
    </Card>
  );
}

export const HourWeatherBrick: React.FC<{
  forecast: HourlyWeatherData;
}> = ({ forecast }) => {
  const weatherForHour = forecast.weather.at(0);
  const hourFromDT = new Date(forecast.dt * 1000).toLocaleTimeString();

  if (!weatherForHour) return <div>no weather for hour</div>;

  const icon =
    "https://openweathermap.org/img/wn/" + weatherForHour.icon + ".png";

  return (
    <Card>
      <p className="text-center">{hourFromDT}</p>
      <p className="text-center">{forecast.feels_like}</p>
      <p className="text-center">{forecast.wind_speed} mph</p>
      <img
        src={icon}
        height={100}
        width={100}
        alt={forecast.weather.at(0)?.description}
      />
    </Card>
  );
};

function DayWeatherBrick(props: { forecast: DailyWeatherData }) {
  const weatherForDay = props.forecast.weather.at(0);
  const dayFromDT = new Date(props.forecast.dt * 1000).toLocaleDateString();

  if (!weatherForDay) return <div>no weather for day</div>;

  const icon =
    "https://openweathermap.org/img/wn/" + weatherForDay.icon + ".png";

  return (
    <Card>
      <p className="text-center">{dayFromDT}</p>
      <p className="text-center">{props.forecast.temp.day}</p>
      <p className="text-center">{props.forecast.wind_speed} mph</p>
      <p className="text-sm italic pt-3">{props.forecast.summary}</p>
      <img
        src={icon}
        height={100}
        width={100}
        alt={weatherForDay.description}
      />
    </Card>
  );
}

export default Weather;
