const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const WEATHER_URL =
  "https://api.openweathermap.org/data/2.5/weather";

const FORECAST_URL =
  "https://api.openweathermap.org/data/2.5/forecast";

export const getWeather = async (city) => {
  const response = await fetch(
    `${WEATHER_URL}?q=${encodeURIComponent(
      city
    )}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    throw new Error(
      "City not found or weather data unavailable."
    );
  }

  return await response.json();
};


export const getForecast = async (city) => {
  const response = await fetch(
    `${FORECAST_URL}?q=${encodeURIComponent(
      city
    )}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    throw new Error(
      "Forecast data unavailable."
    );
  }

  return await response.json();
};