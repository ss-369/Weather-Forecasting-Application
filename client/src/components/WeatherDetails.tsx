import { CurrentWeather } from "@shared/schema";

interface WeatherDetailsProps {
  data: CurrentWeather;
}

export function WeatherDetails({ data }: WeatherDetailsProps) {
  return (
    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <i className="ri-eye-line text-lg text-gray-500 dark:text-gray-400 mr-2"></i>
          <span className="text-sm text-gray-500 dark:text-gray-400">Visibility</span>
        </div>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
          {data.visibility ? `${Math.round(data.visibility / 1000)} km` : 'N/A'}
        </p>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <i className="ri-compass-3-line text-lg text-gray-500 dark:text-gray-400 mr-2"></i>
          <span className="text-sm text-gray-500 dark:text-gray-400">Pressure</span>
        </div>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
          {data.pressure ? `${data.pressure} hPa` : 'N/A'}
        </p>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <i className="ri-sun-line text-lg text-yellow-500 mr-2"></i>
          <span className="text-sm text-gray-500 dark:text-gray-400">UV Index</span>
        </div>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
          {data.uvi !== undefined ? getUVIndexText(data.uvi) : 'N/A'}
        </p>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <i className="ri-rainy-line text-lg text-primary-500 mr-2"></i>
          <span className="text-sm text-gray-500 dark:text-gray-400">Clouds</span>
        </div>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
          {data.clouds !== undefined ? `${data.clouds}%` : 'N/A'}
        </p>
      </div>
    </div>
  );
}

// Helper function to get UV Index text
function getUVIndexText(uvi: number): string {
  if (uvi <= 2) return `${uvi} (Low)`;
  if (uvi <= 5) return `${uvi} (Moderate)`;
  if (uvi <= 7) return `${uvi} (High)`;
  if (uvi <= 10) return `${uvi} (Very High)`;
  return `${uvi} (Extreme)`;
}
