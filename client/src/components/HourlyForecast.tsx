import { WeatherIcon } from "./WeatherIcon";
import { useWeather } from "@/context/WeatherContext";
import { formatHourFromTimestamp, formatTemperature } from "@/lib/utils";
import { HourlyForecast as HourlyForecastType } from "@shared/schema";

interface HourlyForecastProps {
  data: HourlyForecastType[];
  timezone?: number;
}

export function HourlyForecast({ data, timezone = 0 }: HourlyForecastProps) {
  const { unit, convertTemp } = useWeather();
  
  // Take only the first 24 hours
  const hours = data.slice(0, 8);
  
  return (
    <div className="mb-10">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Today's Forecast</h3>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-4 overflow-x-auto">
          <div className="flex space-x-6 min-w-max">
            {hours.map((hour, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center p-4 forecast-item rounded-lg min-w-[80px] hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {formatHourFromTimestamp(hour.dt, timezone)}
                </span>
                <div className="my-3">
                  <WeatherIcon 
                    iconCode={hour.weather[0].icon} 
                    description={hour.weather[0].description} 
                    size="3xl" 
                  />
                </div>
                <span className="text-lg font-semibold text-gray-800 dark:text-white">
                  {formatTemperature(convertTemp(hour.temp), unit)}
                </span>
                {hour.pop !== undefined && hour.pop > 0 && (
                  <span className="text-xs text-primary-500 mt-1 flex items-center">
                    <i className="ri-drop-line mr-1"></i>
                    {Math.round(hour.pop * 100)}%
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
