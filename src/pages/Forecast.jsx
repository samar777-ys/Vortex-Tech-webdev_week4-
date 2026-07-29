import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getForecast } from "../services/weatherApi";

function Forecast() {
  const { city } = useParams();
  const navigate = useNavigate();

  const decodedCity = city
    ? decodeURIComponent(city)
    : "";

  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getForecast(decodedCity);

        setForecast(data);
      } catch (error) {
        console.error("Forecast Error:", error);
        setError(
          error.message ||
            "Unable to load forecast data."
        );
      } finally {
        setLoading(false);
      }
    };

    if (decodedCity) {
      fetchForecast();
    }
  }, [decodedCity]);

  if (loading) {
    return (
      <main className="forecast-page">
        <div className="loading">
          <div className="spinner"></div>
          <h2>Loading Forecast...</h2>
          <p>
            Getting the forecast for {decodedCity}.
          </p>
        </div>
      </main>
    );
  }

  if (error || !forecast) {
    return (
      <main className="forecast-page">
        <div className="error-page">
          <h1>⚠️ Forecast Unavailable</h1>

          <p>
            {error ||
              "Unable to load forecast data."}
          </p>

          <button onClick={() => navigate("/")}>
            ← Back to Home
          </button>
        </div>
      </main>
    );
  }

  const dailyForecast =
    forecast.list
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
    <main className="forecast-page">
      <section className="forecast-header">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <p className="hero-label">
          EXTENDED FORECAST
        </p>

        <h1>
          5-Day Forecast for {decodedCity}
        </h1>

        <p>
          Plan ahead with upcoming weather
          conditions.
        </p>
      </section>

      <section className="forecast-section">
        <div className="forecast-grid">
          {dailyForecast.map((day) => (
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
                    weekday: "long",
                  }
                )}
              </h3>

              <p className="forecast-date">
                {new Date(
                  day.dt * 1000
                ).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
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
          ))}
        </div>
      </section>
    </main>
  );
}

export default Forecast;