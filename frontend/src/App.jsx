import React, { useState } from "react";
import WeatherCard from "./components/WeatherCard";
import "./index.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);

  // Determine background class from weather description
  const getBackgroundClass = (desc) => {
    if (!desc) return "bg-default";
    const d = desc.toLowerCase();
    if (d.includes("rain")) return "bg-rain";
    if (d.includes("cloud")) return "bg-cloud";
    if (d.includes("sun") || d.includes("clear")) return "bg-sun";
    return "bg-default";
  };

  // Fetch weather for a city (typed or clicked from history)
  const fetchWeather = async (selectedCity) => {
    const targetCity = selectedCity || city;
    if (!targetCity) return;

    try {
      // Fetch current weather
      const res = await fetch(`http://127.0.0.1:8000/weather/${targetCity}`);
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();

      // Immediately update background BEFORE setting weather state
      document.body.className = getBackgroundClass(data.desc);

      // Update weather state
      setWeather(data);

      // Fetch history
      const histRes = await fetch("http://127.0.0.1:8000/history");
      const histData = await histRes.json();

      // Build unique cities excluding current, max 5
      const uniqueCities = histData
        .map(h => h.city)
        .filter((c, idx, arr) => arr.indexOf(c) === idx && c.toLowerCase() !== data.city.toLowerCase())
        .slice(-5)
        .reverse();

      setHistory(uniqueCities);

      // Clear input
      setCity("");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">🌦 SkyLog</h1>

      <div className="search-container">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
          placeholder="Enter a city..."
          className="city-input"
        />
        <button onClick={() => fetchWeather()} className="search-button">
          Search
        </button>
      </div>

      {weather ? (
        <WeatherCard weather={weather} />
      ) : (
        <p className="prompt-message">Enter a city above to see the weather</p>
      )}

      {history.length > 0 && (
        <div className="history-container">
          <h3 className="history-title">📜 Search History</h3>
          <ul className="history-list">
            {history.map((cityName, i) => (
              <li
                key={i}
                className="history-item"
                onClick={() => fetchWeather(cityName)}
              >
                {cityName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
