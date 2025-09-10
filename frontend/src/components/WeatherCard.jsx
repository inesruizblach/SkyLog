import React from "react";

// Displays weather information in a styled card component
export default function WeatherCard({ weather }) {
  if (!weather) return null;

  return (
    <div className="mt-6 max-w-sm mx-auto bg-white shadow-lg rounded-2xl p-6 text-center">
      <h2 className="text-2xl font-bold mb-2">{weather.city}</h2>
      <img
        className="mx-auto w-20 h-20"
        src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
        alt={weather.desc}
      />
      <p className="text-3xl font-semibold">{Math.round(weather.temp)}°C</p>
      <p className="text-gray-600 capitalize">{weather.desc}</p>
    </div>
  );
}
