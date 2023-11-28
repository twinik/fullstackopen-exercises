import { useState, useEffect } from "react";
import axios from "axios";

function Country({ countrie }) {
  const api_key = import.meta.env.VITE_WEATHER_API_KEY;
  const [weather, setWeather] = useState([]);

  useEffect(() => {
    axios
      .get(
        `http://api.weatherstack.com/current?access_key=${api_key}&query=${countrie.capital[0]}`
      )
      .then((response) => {
        setWeather(response.data);
      });
  }, [api_key, countrie]);

  return (
    <div>
      <h1>{countrie.name.common}</h1>
      <p>capital {countrie.capital[0]}</p>
      <p>population {countrie.population}</p>
      <h2>languages</h2>
      <ul>
        {Object.values(countrie.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img
        src={countrie.flags.png}
        alt={`Flag of ${countrie.name.common}`}
        width="200"
      />
      {weather.current && (
        <div>
          <h2>Weather in {countrie.capital[0]}</h2>
          <p>
            <b>temperature:</b> {weather.current.temperature} Celsius
          </p>
          <img
            src={weather.current.weather_icons}
            alt={`Weather in ${countrie.capital[0]}`}
          />
          <p>
            <b>wind:</b> {weather.current.wind_speed} mph direction{" "}
            {weather.current.wind_dir}
          </p>
        </div>
      )}
    </div>
  );
}

export default Country;
