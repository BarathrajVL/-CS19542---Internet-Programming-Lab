import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';

// Import icons
import icon1 from "./assets/breez.png";
import icon2 from "./assets/cloud.png";
import icon3 from "./assets/dizzle.png";
import icon5 from "./assets/humiditiy.png";
import icon6 from "./assets/snow.png";
import icon7 from "./assets/sun.png";
import icon8 from "./assets/heavey_rain.png";
import icon9 from "./assets/search_icon.png";

const WeatherDetails = ({ icon, temp, city, country, lat, log, humidity, wind }) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="weather icon" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">Latitude: </span><span>{lat}</span>
        </div>
        <div>
          <span className="log">Longitude: </span><span>{log}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={icon5} alt="humidity icon" className="icon" />
          <div className="data">
            <div className="humidity-percent">{humidity} %</div>
            <div className="text">Humidity</div>
          </div>
        </div>
      </div>
      <div className="data-container1">
        <div className="element">
          <img src={icon1} alt="wind icon" className="icon" />
          <div className="data">
            <div className="wind-percent">{wind} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
     
    </>
  );
};

function App() {
  const api_key = "e1e65302a4f28638970532ace9f49d34";

  // Weather states
  const [icon, setIcon] = useState(icon7);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("Chennai");
  const [country, setCountry] = useState("India");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [text, setText] = useState("Chennai");
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auth states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const weatherIconMap = {
    "01d": icon7,
    "01n": icon7,
    "02d": icon2,
    "02n": icon2,
    "03d": icon3,
    "03n": icon3,
    "04d": icon3,
    "04n": icon3,
    "09d": icon8,
    "09n": icon8,
    "10d": icon8,
    "10n": icon8,
    "13d": icon6,
    "13n": icon6,
  };

  const search = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`;

    try {
      let res = await fetch(url);
      let data = await res.json();

      if (data.cod === "404") {
        console.error("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(data.main.temp);
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);

      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || icon2);
      setCityNotFound(false);
    } catch (error) {
      console.error("An error occurred:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

    const user = storedUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid email or password');
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

 
    const userExists = storedUsers.some(u => u.email === email);
    
    if (userExists) {
      setError('Email is already registered');
      return;
    }

    storedUsers.push({ email, password });
    localStorage.setItem('users', JSON.stringify(storedUsers));
    
    setIsAuthenticated(true);
    setError('');
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };

  useEffect(() => {
    if (isAuthenticated) {
      search();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
        <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className='b'>{isSignUp ? 'Sign Up' : 'Login'}</button>
          {error && <p className="error">{error}</p>}
        </form>
        <button onClick={toggleForm} className='a'>
          {isSignUp ? 'Already have an account? Login' : 'Create an account'}
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="input-container">
        <input
          type="text"
          className="cityinput"
          placeholder="Search City"
          onChange={(e) => setText(e.target.value)}
          value={text}
          onKeyDown={(e) => e.key === "Enter" && search()}
        />
        <div className="search-icon" onClick={search}>
          <img src={icon9} alt="search" />
        </div>
      </div>
      <WeatherDetails
        icon={icon}
        temp={temp}
        city={city}
        country={country}
        lat={lat}
        log={log}
        humidity={humidity}
        wind={wind}
      />
    </div>
  );
}

export default App;
