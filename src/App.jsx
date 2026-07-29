import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Forecast from "./pages/Forecast";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import WeatherDetails from "./pages/WeatherDetails";

import "./App.css";

function App() {
  const [weather, setWeather] = useState(null);

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Home setWeather={setWeather} />}
        />

        <Route
          path="/weather-details/:city"
          element={<WeatherDetails weather={weather} />}
        />
        <Route
  path="/forecast/:city"
  element={<Forecast />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;