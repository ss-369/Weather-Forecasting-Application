import { useState } from "react";
import { Header } from "@/components/Header";
import { SearchSection } from "@/components/SearchSection";
import { CurrentWeather } from "@/components/CurrentWeather";
import { HourlyForecast } from "@/components/HourlyForecast";
import { DailyForecast } from "@/components/DailyForecast";
import { Footer } from "@/components/Footer";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { useWeather } from "@/context/WeatherContext";
import { useWeatherData, useRecentSearches } from "@/hooks/useWeather";

export default function Home() {
  const [searchCity, setSearchCity] = useState<string | null>(null);
  const { loading, error } = useWeather();
  
  // Fetch recent searches on mount
  useRecentSearches();
  
  // Fetch weather data when a city is searched
  const { data: weatherData, refetch: refetchWeather } = useWeatherData(searchCity);
  
  // Handle search
  const handleSearch = (city: string) => {
    setSearchCity(city);
  };
  
  // Retry fetching weather data
  const handleRetry = () => {
    refetchWeather();
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header />
        
        <SearchSection onSearch={handleSearch} />
        
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} onRetry={handleRetry} />
        ) : weatherData ? (
          <>
            <CurrentWeather data={weatherData.current} lastUpdated={weatherData.lastUpdated} />
            <HourlyForecast data={weatherData.hourly} timezone={weatherData.current.timezone} />
            <DailyForecast data={weatherData.daily} />
          </>
        ) : (
          <div className="flex justify-center items-center p-10">
            <p className="text-gray-500 dark:text-gray-400">Search for a city to see weather information</p>
          </div>
        )}
        
        <Footer />
      </div>
    </div>
  );
}
