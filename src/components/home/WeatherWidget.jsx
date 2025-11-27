import React, { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Droplets, Thermometer, MapPin } from "lucide-react";

const CACHE_KEY = "fnb_weather_cache";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Weather icon mapping
const getWeatherIcon = (condition) => {
  const iconMap = {
    Clear: Sun,
    Clouds: Cloud,
    Rain: CloudRain,
    Drizzle: CloudRain,
    Thunderstorm: CloudLightning,
    Snow: CloudSnow,
  };
  return iconMap[condition] || Cloud;
};

// Weather background gradient based on condition
const getWeatherGradient = (condition) => {
  const gradients = {
    Clear: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    Clouds: "linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)",
    Rain: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    Thunderstorm: "linear-gradient(135deg, #373B44 0%, #4286f4 100%)",
    Snow: "linear-gradient(135deg, #E6DADA 0%, #274046 100%)",
  };
  return gradients[condition] || gradients.Clear;
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWeather();
  }, []);

  const loadWeather = async () => {
    // Check cache first
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        setWeather(data);
        setLoading(false);
        return;
      }
    }

    // Try geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => fetchWeather(position.coords.latitude, position.coords.longitude),
        () => fetchWeatherByCity("Cuiaba"), // Fallback city
        { timeout: 5000 }
      );
    } else {
      fetchWeatherByCity("Cuiaba");
    }
  };

  const fetchWeather = async (lat, lon) => {
    // Using mock data since we don't have API key
    // In production, replace with actual OpenWeatherMap API call
    const mockData = {
      city: "Cuiabá",
      temp: 32,
      tempMin: 24,
      tempMax: 35,
      condition: "Clear",
      humidity: 45,
      rainChance: 15,
      description: "Céu limpo",
    };

    setWeather(mockData);
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data: mockData, timestamp: Date.now() }));
    setLoading(false);
  };

  const fetchWeatherByCity = async (city) => {
    // Mock data fallback
    const mockData = {
      city: city === "Cuiaba" ? "Cuiabá" : city,
      temp: 32,
      tempMin: 24,
      tempMax: 35,
      condition: "Clear",
      humidity: 45,
      rainChance: 15,
      description: "Céu limpo",
    };

    setWeather(mockData);
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data: mockData, timestamp: Date.now() }));
    setLoading(false);
  };

  if (loading) {
    return (
      <div 
        className="bg-white rounded-xl p-5 mb-6 animate-pulse"
        style={{ 
          borderTop: "3px solid #D71E1F",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
        }}
      >
        <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
        <div className="h-16 bg-gray-200 rounded mb-3" />
        <div className="h-8 bg-gray-200 rounded" />
      </div>
    );
  }

  if (error || !weather) {
    return null;
  }

  const WeatherIcon = getWeatherIcon(weather.condition);

  return (
    <div 
      className="bg-white rounded-xl overflow-hidden mb-6"
      style={{ 
        borderTop: "3px solid #D71E1F",
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
      }}
    >
      {/* Header */}
      <div className="px-5 pt-4 pb-2">
        <h3 
          className="text-sm font-bold text-gray-500 uppercase tracking-wide"
          style={{ fontFamily: "'Overpass', sans-serif" }}
        >
          Previsão do Tempo
        </h3>
      </div>

      {/* Main Content */}
      <div className="px-5 pb-4">
        {/* City */}
        <div className="flex items-center gap-1.5 mb-3">
          <MapPin className="w-4 h-4 text-[#D71E1F]" />
          <span 
            className="text-lg font-bold text-[#1A1A1A]"
            style={{ fontFamily: "'Overpass', sans-serif" }}
          >
            {weather.city}
          </span>
        </div>

        {/* Temperature & Icon */}
        <div className="flex items-center justify-center gap-4 py-3">
          <WeatherIcon 
            className="w-14 h-14" 
            style={{ color: weather.condition === "Clear" ? "#f59e0b" : "#64748b" }}
            strokeWidth={1.5}
          />
          <div className="text-center">
            <span 
              className="text-5xl font-extrabold"
              style={{ 
                fontFamily: "'Overpass', sans-serif",
                color: "#D71E1F"
              }}
            >
              {weather.temp}°
            </span>
            <p className="text-sm text-gray-500 capitalize">{weather.description}</p>
          </div>
        </div>

        {/* Details Row */}
        <div 
          className="flex justify-around pt-3 mt-2 text-sm"
          style={{ borderTop: "1px solid #eee" }}
        >
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center text-blue-500">
              <Thermometer className="w-4 h-4" />
              <span className="font-semibold">Mín</span>
            </div>
            <span className="font-bold text-gray-700">{weather.tempMin}°</span>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center text-orange-500">
              <Thermometer className="w-4 h-4" />
              <span className="font-semibold">Máx</span>
            </div>
            <span className="font-bold text-gray-700">{weather.tempMax}°</span>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center text-blue-400">
              <Droplets className="w-4 h-4" />
              <span className="font-semibold">Chuva</span>
            </div>
            <span className="font-bold text-gray-700">{weather.rainChance}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}