import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getWeather,
  getForecast,
} from "../services/weatherApi";

function WeatherDetails() {
  const { city } = useParams();
  const navigate = useNavigate();

  const decodedCity = city
    ? decodeURIComponent(city)
    : "";

  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!decodedCity) {
        setError("City name is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [weatherData, forecastData] =
          await Promise.all([
            getWeather(decodedCity),
            getForecast(decodedCity),
          ]);

        setWeather(weatherData);
        setForecast(forecastData);
      } catch (error) {
        console.error("Weather Details Error:", error);

        setWeather(null);
        setForecast(null);

        setError(
          error.message ||
            "Unable to load weather data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [decodedCity]);

  if (loading) {
    return (
      <main className="details-page">
        <div className="loading">
          <div className="spinner"></div>

          <h2>Loading weather data...</h2>

          <p>
            Getting the latest weather information for{" "}
            {decodedCity}.
          </p>
        </div>
      </main>
    );
  }

  if (error || !weather) {
    return (
      <main className="details-page">
        <div className="error-page">
          <h1>⚠️ Weather Data Unavailable</h1>

          <p>
            {error ||
              "Unable to load weather information."}
          </p>

          <button onClick={() => navigate("/")}>
            ← Back to Home
          </button>
        </div>
      </main>
    );
  }

  const dailyForecast =
    forecast?.list
      ?.filter((item) =>
        item.dt_txt?.includes("12:00:00")
      )
      .slice(0, 5) || [];

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case "Clear":
        return "☀️";
      case "Clouds":
        return "☁️";
      case "Rain":
        return "🌧️";
      case "Snow":
        return "❄️";
      case "Thunderstorm":
        return "⛈️";
      case "Drizzle":
        return "🌦️";
      default:
        return "🌦️";
    }
  };

  return (
    <main className="details-page">
      {/* Header */}
      <section className="details-header">
        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

        <p className="hero-label">
          LIVE WEATHER DETAILS
        </p>

        <h1>
          {weather.name}, {weather.sys.country}
        </h1>

        <div className="weather-icon">
          {getWeatherIcon(
            weather.weather[0].main
          )}
        </div>

        <p className="weather-condition">
          {weather.weather[0].description}
        </p>
      </section>

      {/* Current Weather */}
      <section className="current-weather">
        <div className="main-temperature">
          <span>
            {Math.round(weather.main.temp)}
          </span>

          <small>°C</small>
        </div>

        <p>
          Feels like{" "}
          {Math.round(weather.main.feels_like)}°C
        </p>
      </section>

      {/* Weather Statistics */}
      <section className="details-grid">
        <div className="detail-item">
          <span>🌡️</span>
          <h3>Feels Like</h3>
          <p>
            {Math.round(
              weather.main.feels_like
            )}
            °C
          </p>
        </div>

        <div className="detail-item">
          <span>💧</span>
          <h3>Humidity</h3>
          <p>{weather.main.humidity}%</p>
        </div>

        <div className="detail-item">
          <span>💨</span>
          <h3>Wind Speed</h3>
          <p>{weather.wind.speed} m/s</p>
        </div>

        <div className="detail-item">
          <span>🔽</span>
          <h3>Pressure</h3>
          <p>{weather.main.pressure} hPa</p>
        </div>

        <div className="detail-item">
          <span>🌅</span>
          <h3>Sunrise</h3>
          <p>
            {new Date(
              weather.sys.sunrise * 1000
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="detail-item">
          <span>🌇</span>
          <h3>Sunset</h3>
          <p>
            {new Date(
              weather.sys.sunset * 1000
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </section>

      {/* 5-Day Forecast */}
      <section className="forecast-section">
        <div className="section-heading">
          <p className="hero-label">FORECAST</p>

          <h2>5-Day Weather Forecast</h2>
           <button
  className="details-button"
  onClick={() =>
    navigate(
      `/forecast/${encodeURIComponent(
        weather.name
      )}`
    )
  }
>
  View Full 5-Day Forecast →
</button>

          <p>
            Extended weather outlook for{" "}
            {weather.name}.
          </p>
        </div>

        <div className="forecast-grid">
          {dailyForecast.length > 0 ? (
            dailyForecast.map((day) => (
              <div
                className="forecast-card"
                key={day.dt}
              >
                <h3>
                  {new Date(
                    day.dt * 1000
                  ).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "short",
                    }
                  )}
                </h3>

                <p className="forecast-date">
                  {new Date(
                    day.dt * 1000
                  ).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </p>

                <div className="forecast-icon">
                  {getWeatherIcon(
                    day.weather[0].main
                  )}
                </div>

                <h2>
                  {Math.round(
                    day.main.temp
                  )}
                  °C
                </h2>
               

                <p className="forecast-condition">
                  {day.weather[0].description}
                </p>

                <div className="forecast-extra">
                  <span>
                    💧 {day.main.humidity}%
                  </span>

                  <span>
                    💨 {day.wind.speed} m/s
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p>
              Forecast data is not available.
            </p>
          )}

        </div>
      </section>
    </main>
  );
}

export default WeatherDetails;