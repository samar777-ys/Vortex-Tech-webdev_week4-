import { useState } from "react";

import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";

import { getWeather, getForecast } from "../services/weatherApi";

function Home() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (city) => {
    try {
      setLoading(true);
      setError("");

      // Get current weather
      const weather = await getWeather(city);

      // Get 5-day forecast
      const forecast = await getForecast(city);

      setWeatherData(weather);
      setForecastData(forecast);
    } catch (error) {
      console.error("Search Error:", error);

      setWeatherData(null);
      setForecastData(null);

      setError(
        error.message || "Unable to find weather information."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-label">🌦️ REAL-TIME WEATHER</p>

          <h1>
            Weather made<span> simple.</span>
          </h1>

          <p className="hero-description">
            Search any city around the world and explore real-time weather
            conditions, detailed insights, and forecasts.
          </p>

          <div className="hero-search">
            <SearchBar onSearch={handleSearch} loading={loading} />
          </div>
        </div>
      </section>

      {/* LOADING */}
      {loading && (
        <section className="status-section">
          <div className="status-card">
            <div className="spinner"></div>
            <h2>Loading Weather</h2>
            <p>Getting the latest weather information...</p>
          </div>
        </section>
      )}

      {/* ERROR */}
      {error && !loading && (
        <section className="status-section">
          <div className="status-card error-card">
            <div className="status-icon">⚠️</div>
            <h2>Unable to Find City</h2>
            <p>{error}</p>
          </div>
        </section>
      )}

      {/* WELCOME SCREEN (BEFORE SEARCH) */}
      {!weatherData && !loading && !error && (
        <section className="welcome-section">
          <p className="section-label">EXPLORE WEATHER</p>
          <h2>Your weather dashboard</h2>
          <p>Search for a city to see real-time weather information.</p>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🌡️</div>
              <h3>Live Weather</h3>
              <p>Get current temperature and weather conditions.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Weather Details</h3>
              <p>View humidity, wind, pressure, and other details.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>5-Day Forecast</h3>
              <p>Plan ahead with upcoming weather conditions.</p>
            </div>
          </div>
        </section>
      )}

      {/* WEATHER DASHBOARD (VISIBLE AFTER SUCCESSFUL SEARCH) */}
      {weatherData && !loading && (
        <section className="weather-dashboard">
          {/* LIVE WEATHER & DETAILS */}
          <div className="dashboard-section">
            <div className="section-heading">
              <h2>Live Weather</h2>
              <p>Current weather conditions in {weatherData.name}</p>
            </div>

            <div className="live-weather-grid">
              <div className="current-weather-wrapper">
                <WeatherCard weather={weatherData} />
              </div>

              <div className="details-grid">
                <div className="detail-card">
                  <span>🌡️</span>
                  <p>Feels Like</p>
                  <strong>{Math.round(weatherData.main.feels_like)}°C</strong>
                </div>

                <div className="detail-card">
                  <span>💧</span>
                  <p>Humidity</p>
                  <strong>{weatherData.main.humidity}%</strong>
                </div>

                <div className="detail-card">
                  <span>💨</span>
                  <p>Wind Speed</p>
                  <strong>{weatherData.wind.speed} m/s</strong>
                </div>

                <div className="detail-card">
                  <span>🔽</span>
                  <p>Pressure</p>
                  <strong>{weatherData.main.pressure} hPa</strong>
                </div>

                <div className="detail-card">
                  <span>📍</span>
                  <p>Latitude</p>
                  <strong>{weatherData.coord.lat}</strong>
                </div>

                <div className="detail-card">
                  <span>🌍</span>
                  <p>Longitude</p>
                  <strong>{weatherData.coord.lon}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* 5-DAY FORECAST */}
          <div className="dashboard-section">
            <div className="section-heading">
              <h2>5-Day Forecast</h2>
              <p>Upcoming weather conditions</p>
            </div>

            <div className="forecast-preview">
              {forecastData && forecastData.list ? (
                forecastData.list
                  .filter((item) => item.dt_txt.includes("12:00:00"))
                  .slice(0, 5)
                  .map((item) => {
                    const date = new Date(item.dt * 1000);
                    const day = date.toLocaleDateString("en-US", {
                      weekday: "short",
                    });
                    const icon = item.weather[0].icon;

                    return (
                      <div className="forecast-card" key={item.dt}>
                        <h3>{day}</h3>
                        <img
                          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                          alt={item.weather[0].description}
                        />
                        <strong>{Math.round(item.main.temp)}°C</strong>
                        <p>{item.weather[0].description}</p>
                      </div>
                    );
                  })
              ) : (
                <p>Forecast data is not available.</p>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default Home;