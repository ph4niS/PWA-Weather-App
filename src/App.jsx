import React, { useState, useEffect } from "react";
import { fetchWeather } from "./api/fetchWeather";

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem("recentSearches");
    return saved ? JSON.parse(saved) : [];
  });
  const [isCelsius, setIsCelsius] = useState(() => {
    const saved = localStorage.getItem("temperatureUnit");
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    localStorage.setItem("temperatureUnit", JSON.stringify(isCelsius));
  }, [isCelsius]);

  const addToRecentSearches = (city) => {
    const updatedSearches = [
      city,
      ...recentSearches.filter((s) => s !== city),
    ].slice(0, 5);
    setRecentSearches(updatedSearches);
  };

  const fetchData = async (cityToFetch) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchWeather(cityToFetch);
      setWeatherData(data);
      setCityName("");
      addToRecentSearches(data.location.name);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && cityName.trim()) {
      fetchData(cityName);
    }
  };

  const handleRecentSearchClick = (city) => {
    setCityName(city);
    fetchData(city);
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter city name..."
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full p-2 border rounded"
          disabled={isLoading}
        />

        {/* loading indicator */}
        {isLoading && (
          <div className="mt-4 p-4 flex items-center justify-center gap-3 bg-blue-50 rounded-lg">
            <div className="inline-block animate-spin rounded-full h-5 w-5 border-4 border-blue-500 border-t-transparent"></div>
            <span className="text-blue-600 font-medium">Loading...</span>
          </div>
        )}

        {/* error message for invalid city */}
        {error && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>

      {/* displaying recent searches */}
      {recentSearches.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Recent Searches</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((city, index) => (
              <button
                key={index}
                onClick={() => handleRecentSearchClick(city)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* toggle temperature Unit */}
      <div className="mb-4">
        <button
          onClick={toggleTemperatureUnit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Switch to {isCelsius ? "°F" : "°C"}
        </button>
      </div>

      {/* diplaying weather data */}
      {weatherData && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">
            {weatherData.location.name}, {weatherData.location.region},{" "}
            {weatherData.location.country}
          </h2>
          <div className="grid gap-4">
            <p className="text-xl">
              Temperature:{" "}
              {isCelsius
                ? `${weatherData.current.temp_c} °C`
                : `${weatherData.current.temp_f} °F`}
            </p>
            <div className="flex items-center gap-2">
              <p>Condition: {weatherData.current.condition.text}</p>
              <img
                src={weatherData.current.condition.icon}
                alt={weatherData.current.condition.text}
                className="w-12 h-12"
              />
            </div>
            <p>Humidity: {weatherData.current.humidity}%</p>
            <p>Pressure: {weatherData.current.pressure_mb} mb</p>
            <p>Visibility: {weatherData.current.vis_km} km</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
