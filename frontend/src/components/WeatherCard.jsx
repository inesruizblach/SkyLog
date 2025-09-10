import React from "react";

/**
 * WeatherCard displays the current weather for a city.
 * Props:
 *  - weather: { city, temp, desc, icon }
 */
export default function WeatherCard({ weather }) {
  if (!weather) return null;

  return (
    <div className="weather-card">
      <h2>{weather.city}</h2>
      <img
        src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
        alt={weather.desc}
      />
      <p>{Math.round(weather.temp)}°C</p>
      <p className="capitalize">{weather.desc}</p>
    </div>
  );
}
