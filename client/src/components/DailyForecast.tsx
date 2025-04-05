import { WeatherIcon } from "./WeatherIcon";
import { useWeather } from "@/context/WeatherContext";
import { formatDay, formatTemperature } from "@/lib/utils";
import { DailyForecast as DailyForecastType } from "@shared/schema";

interface DailyForecastProps {
  data: DailyForecastType[];
}

export function DailyForecast({ data }: DailyForecastProps) {
  const { unit, convertTemp } = useWeather();
  
  return (
    <div className="mb-10">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">5-Day Forecast</h3>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((day, index) => {
            const { day: dayText, date } = formatDay(day.dt);
            const maxTemp = convertTemp(day.temp.max);
            const minTemp = convertTemp(day.temp.min);
            
            return (
              <div 
                key={index} 
                className="p-4 md:p-6 flex items-center justify-between forecast-item hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                <div className="w-24 md:w-36">
                  <p className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">
                    {dayText}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {date}
                  </p>
                </div>
                <div className="flex items-center">
                  <WeatherIcon 
                    iconCode={day.weather[0].icon} 
                    description={day.weather[0].description} 
                    size="2xl md:text-3xl" 
                  />
                  <div className="ml-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {day.weather[0].main}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <i className="ri-drop-line text-primary-500 mr-1"></i>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {day.pop !== undefined ? `${Math.round(day.pop * 100)}%` : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm md:text-base font-semibold text-gray-800 dark:text-white">
                    {formatTemperature(maxTemp, unit)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatTemperature(minTemp, unit)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
