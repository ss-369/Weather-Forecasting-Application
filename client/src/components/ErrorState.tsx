import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const isApiKeyError = error.includes("OpenWeather API key is required");
  
  return (
    <div className="bg-red-50 dark:bg-gray-800 border-l-4 border-red-500 p-4 mb-8 rounded-md">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
            {isApiKeyError ? "API Key Required" : "Error fetching weather data"}
          </h3>
          <div className="mt-2 text-sm text-red-700 dark:text-red-300">
            <p>{error || "Unable to connect to weather service. Please check your internet connection and try again."}</p>
            
            {isApiKeyError && (
              <div className="mt-2">
                <p className="font-semibold">To fix this issue:</p>
                <ol className="list-decimal list-inside mt-1">
                  <li>Register for a free API key at <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="underline">OpenWeatherMap</a></li>
                  <li>Add your API key to the application's environment variables</li>
                  <li>Restart the application</li>
                </ol>
              </div>
            )}
          </div>
          <div className="mt-4">
            <button 
              type="button" 
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800"
              onClick={onRetry}
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
