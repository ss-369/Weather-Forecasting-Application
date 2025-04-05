export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
      <p>
        WeatherNow &copy; {currentYear} • Powered by{" "}
        <a 
          href="https://openweathermap.org/" 
          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
          target="_blank"
          rel="noopener noreferrer"
        >
          OpenWeatherMap
        </a>
      </p>
      <p className="mt-1">Data updates every 30 minutes</p>
    </footer>
  );
}
