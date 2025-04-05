import { cn } from "@/lib/utils";

interface WeatherIconProps {
  iconCode: string;
  description: string;
  size?: string;
  className?: string;
}

export function WeatherIcon({ 
  iconCode, 
  description, 
  size = "3xl", 
  className 
}: WeatherIconProps) {
  // Map OpenWeatherMap icon codes to Remix icons
  const iconMap: Record<string, string> = {
    // Clear sky
    '01d': 'ri-sun-line text-yellow-500',
    '01n': 'ri-moon-clear-line text-blue-400',
    
    // Few clouds
    '02d': 'ri-sun-cloudy-line text-yellow-500',
    '02n': 'ri-cloudy-line text-blue-400',
    
    // Scattered clouds
    '03d': 'ri-cloudy-line text-gray-400',
    '03n': 'ri-cloudy-line text-gray-400',
    
    // Broken clouds
    '04d': 'ri-cloudy-line text-gray-400',
    '04n': 'ri-cloudy-line text-gray-400',
    
    // Shower rain
    '09d': 'ri-showers-line text-primary-500',
    '09n': 'ri-showers-line text-primary-500',
    
    // Rain
    '10d': 'ri-rainy-line text-primary-500',
    '10n': 'ri-rainy-line text-primary-500',
    
    // Thunderstorm
    '11d': 'ri-thunderstorms-line text-yellow-600',
    '11n': 'ri-thunderstorms-line text-yellow-600',
    
    // Snow
    '13d': 'ri-snowy-line text-blue-200',
    '13n': 'ri-snowy-line text-blue-200',
    
    // Mist
    '50d': 'ri-mist-line text-gray-400',
    '50n': 'ri-mist-line text-gray-400',
  };
  
  const iconClass = iconMap[iconCode] || 'ri-question-line text-gray-400';
  
  return (
    <i className={cn(`text-${size}`, iconClass, className)} aria-label={description}></i>
  );
}
