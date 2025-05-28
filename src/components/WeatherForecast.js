import React, { useState } from "react";
import {
  FaSearch,
  FaCloudSun,
  FaTemperatureHigh,
  FaWind,
  FaCloud,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import styles from './WeatherForecast.module.css';

const WeatherForecast = () => {
  const [location, setLocation] = useState("New York");
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    setLoading(true);
    setError("");
    setWeatherData([]);

    try {
      const response = await fetch(
        `http://localhost:8000/api/weather/?location=${location}`
      );
      const data = await response.json();

      if (response.ok) {
        setWeatherData(data.weather_data);
      } else {
        setError(data.error || "Error fetching weather data");
      }
    } catch (err) {
      setError("Failed to fetch weather data");
    }

    setLoading(false);
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Select the first entry for each day in proper order
  const uniqueDailyData = weekdays.map(day =>
    weatherData.find(entry => getDayName(entry.time) === day)
  ).filter(Boolean); // Remove undefined days (if any missing in API)

  return (
    <div className={styles.weatherCard}>
      <div className={styles.weatherInputContainer}>
        <div className={styles.inputWrapper}>
          <FaMapMarkerAlt className={styles.locationIcon} />
          <input
            type="text"
            placeholder="Enter location (e.g., New York)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={styles.weatherInput}
          />
          <button onClick={fetchWeather} className={styles.searchButton}>
            <FaSearch className={styles.searchIcon} />
          </button>
        </div>
      </div>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className={styles.loadingSpinner}></div>
          <p style={{ color: '#1976d2', fontWeight: 500 }}>
            Fetching weather data for {location}...
          </p>
        </div>
      )}

      {error && <p className={styles.errorMessage}>{error}</p>}

      {weatherData.length > 0 && (
        <div className={styles.weatherTableContainer}>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: '#1976d2', fontWeight: 600 }}>
              7-Day Weather Forecast for {location}
            </h3>
          </div>
          <table className={styles.weatherTable}>
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="px-4 py-2"><FaCalendarAlt /> Day</th>
                <th className="px-4 py-2"><FaTemperatureHigh /> Temp (°C)</th>
                <th className="px-4 py-2"><FaTemperatureHigh /> Feels Like</th>
                <th className="px-4 py-2"><FaCloud /> Humidity (%)</th>
                <th className="px-4 py-2"><FaCloudSun /> Condition</th>
                <th className="px-4 py-2"><FaWind /> Wind (km/h)</th>
                <th className="px-4 py-2"><FaCloud /> Clouds (%)</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {uniqueDailyData.map((entry, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{getDayName(entry.time)}</td>
                  <td className="px-4 py-2">{entry.temperature}</td>
                  <td className="px-4 py-2">{entry.feels_like}</td>
                  <td className="px-4 py-2">{entry.humidity}</td>
                  <td className="px-4 py-2">{entry.weather_description}</td>
                  <td className="px-4 py-2">{entry.wind_speed}</td>
                  <td className="px-4 py-2">{entry.cloud_coverage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WeatherForecast;