import { useState } from "react";
import { Header } from "@/components/Header";
import { SearchSection } from "@/components/SearchSection";
import { CurrentWeather } from "@/components/CurrentWeather";
import { HourlyForecast } from "@/components/HourlyForecast";
import { DailyForecast } from "@/components/DailyForecast";
import { HistoricalWeather } from "@/components/HistoricalWeather";
import { Footer } from "@/components/Footer";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useWeather } from "@/context/WeatherContext";
import { useWeatherData, useHistoricalWeatherData, useRecentSearches } from "@/hooks/useWeather";

export default function Home() {
  const [searchCity, setSearchCity] = useState<string | null>(null);
  const { loading, error } = useWeather();
  
  // Fetch recent searches on mount
  useRecentSearches();
  
  // Fetch weather data when a city is searched
  const { data: weatherData, refetch: refetchWeather } = useWeatherData(searchCity);
  
  // Fetch historical weather data (5 days by default)
  const { 
    data: historicalData, 
    isLoading: historicalLoading 
  } = useHistoricalWeatherData(searchCity);
  
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
            
            {/* Historical Weather Data Section */}
            {historicalLoading ? (
              <div className="mt-8">
                <Skeleton className="h-10 w-1/3 mb-4" />
                <Skeleton className="h-[400px] w-full mb-4" />
                <Skeleton className="h-8 w-1/4 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </div>
            ) : historicalData ? (
              <HistoricalWeather data={historicalData} />
            ) : null}
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
