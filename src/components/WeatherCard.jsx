import { Link } from "react-router-dom";

function WeatherCard({ weather }) {
  if (!weather) {
    return null;
  }

  const city = encodeURIComponent(weather.name);

  return (
    <div className="weather-card">
      <div className="weather-card-top">
        <div>
          <p className="card-label">CURRENT WEATHER</p>

          <h2>
            {weather.name}, {weather.sys.country}
          </h2>

          <p className="weather-condition">
            {weather.weather[0].description}
          </p>
        </div>

        <div className="weather-icon">
          {weather.weather[0].main === "Clear"
            ? "☀️"
            : weather.weather[0].main === "Clouds"
            ? "☁️"
            : weather.weather[0].main === "Rain"
            ? "🌧️"
            : weather.weather[0].main === "Snow"
            ? "❄️"
            : "🌦️"}
        </div>
      </div>

      <div className="temperature-section">
        <h3>{Math.round(weather.main.temp)}°</h3>
        <span>C</span>
      </div>

      <div className="weather-stats">
        <div className="stat-item">
          <span className="stat-icon">🌡️</span>
          <div>
            <p>Feels Like</p>
            <strong>
              {Math.round(weather.main.feels_like)}°C
            </strong>
          </div>
        </div>

        <div className="stat-item">
          <span className="stat-icon">💧</span>
          <div>
            <p>Humidity</p>
            <strong>{weather.main.humidity}%</strong>
          </div>
        </div>

        <div className="stat-item">
          <span className="stat-icon">💨</span>
          <div>
            <p>Wind Speed</p>
            <strong>{weather.wind.speed} m/s</strong>
          </div>
        </div>

        <div className="stat-item">
          <span className="stat-icon">🔽</span>
          <div>
            <p>Pressure</p>
            <strong>{weather.main.pressure} hPa</strong>
          </div>
        </div>
      </div>

      <Link
        to={`/weather-details/${city}`}
        className="details-button"
      >
        View Full Weather Details
        <span>→</span>
      </Link>
    </div>
  );
}

export default WeatherCard;