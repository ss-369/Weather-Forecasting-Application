import { useState } from "react";
import { WeatherDetails } from "./WeatherDetails";
import { WeatherIcon } from "./WeatherIcon";
import { useWeather } from "@/context/WeatherContext";
import { formatTemperature, formatUnixTimestamp, getTimeSince } from "@/lib/utils";
import { CurrentWeather as CurrentWeatherType } from "@shared/schema";

interface CurrentWeatherProps {
  data: CurrentWeatherType;
  lastUpdated: number;
}

export function CurrentWeather({ data, lastUpdated }: CurrentWeatherProps) {
  const { unit, setUnit, convertTemp } = useWeather();
  
  // Format temperature values
  const temp = Math.round(convertTemp(data.temp));
  const feelsLike = Math.round(convertTemp(data.feels_like));
  
  return (
    <div className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center mb-2">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {data.city}{data.country ? `, ${data.country}` : ''}
              </h2>
              <span className="ml-2 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs rounded-full">
                Now
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatUnixTimestamp(data.dt)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Last updated: {getTimeSince(lastUpdated)}
            </p>
            
            <div className="mt-8 flex items-center">
              <span className="text-6xl font-semibold text-gray-800 dark:text-white">
                {formatTemperature(temp, unit)}
              </span>
              <div className="ml-6">
                <div className="flex items-center space-x-1 mb-1">
                  <i className="ri-temp-hot-line text-orange-500"></i>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Feels like: {formatTemperature(feelsLike, unit)}
                  </span>
                </div>
                <div className="flex items-center space-x-1 mb-1">
                  <i className="ri-drop-line text-primary-500"></i>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Humidity: {data.humidity}%
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <i className="ri-windy-line text-primary-400"></i>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Wind: {Math.round(data.wind_speed * 3.6)} km/h
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <div className="w-32 h-32 flex items-center justify-center">
              <WeatherIcon 
                iconCode={data.weather[0].icon} 
                description={data.weather[0].description} 
                size="7xl" 
              />
            </div>
            <p className="text-xl font-medium text-gray-700 dark:text-gray-200 mt-2">
              {data.weather[0].main}
            </p>
          </div>
        </div>
        
        <WeatherDetails data={data} />
        
        <div className="mt-8 flex justify-end">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-lg focus:z-10 focus:ring-2 focus:ring-primary-500 border border-primary-600 ${
                unit === 'celsius'
                  ? 'text-white bg-primary-500'
                  : 'text-gray-700 bg-white hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
              }`}
              onClick={() => setUnit('celsius')}
            >
              °C
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-lg focus:z-10 focus:ring-2 focus:ring-primary-500 border border-primary-600 ${
                unit === 'fahrenheit'
                  ? 'text-white bg-primary-500'
                  : 'text-gray-700 bg-white hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
              }`}
              onClick={() => setUnit('fahrenheit')}
            >
              °F
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
