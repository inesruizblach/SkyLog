import React, { useState } from "react";
import WeatherCard from "./components/WeatherCard.jsx";

function App() {
    // State to track the city input by the user
    const [city, setCity] = useState("");

    // State to store the current weather data fetched from the backend
    const [weather, setWeather] = useState(null);

    // State to store the search history of previous weather queries
    const [history, setHistory] = useState([]);

    /**
     * Fetch weather for the specified city and update states
     * - Calls backend /weather/:city endpoint
     * - Updates weather and history states
     */
    const fetchWeather = async () => {
    if (!city) return; // Ignore empty input

    try {
        // Call FastAPI endpoint
        const res = await fetch(`http://127.0.0.1:8000/weather/${city}`);
        if (!res.ok) throw new Error("City not found");

        const data = await res.json();
        setWeather({
        city: data.city,
        temp: data.temp,
        desc: data.description,
        icon: data.icon,
        });

        // Fetch updated history
        const hist = await fetch("http://127.0.0.1:8000/history");
        setHistory(await hist.json());

        // Clear input
        setCity("");
    } catch (err) {
        console.error("Fetch failed:", err);
        setWeather(null);
        alert("⚠️ Could not fetch weather. Check city spelling or backend.");
    }
    };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-6">
      {/* App Title */}
      <h1 className="text-4xl font-bold text-center mb-6">🌦 SkyLog</h1>

      {/* City input and search button */}
      <div className="flex justify-center gap-2 mb-6">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') fetchWeather(); }}
          placeholder="Enter a city..."
          className="border rounded-xl px-4 py-2 w-64"
        />
        <button
          onClick={fetchWeather}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {/* Display the current weather in a styled card */}
      {weather ? (
        <WeatherCard weather={weather} />
      ) : (
        <p className="text-center text-gray-600 mt-6">
          Enter a city above to see the weather
        </p>
      )}

      {/* Display search history */}
      <div className="mt-10 max-w-lg mx-auto bg-white shadow-md rounded-2xl p-4">
        <h3 className="text-xl font-semibold mb-3">📜 History</h3>
        <ul className="space-y-2">
          {history.map((item, i) => (
            <li
              key={i}
              className="flex justify-between items-center border-b py-2 text-gray-700"
            >
              <span>{item.city}</span>
              <span>{Math.round(item.temp)}°C - {item.desc}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
