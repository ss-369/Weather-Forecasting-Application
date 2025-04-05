import { useTheme } from "../context/ThemeContext";

export function Header() {
  const { toggleTheme, theme } = useTheme();
  
  return (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <i className="ri-cloud-line text-4xl text-primary-500 mr-2"></i>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">WeatherNow</h1>
        </div>
        
        <div className="flex items-center">
          <button 
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <i className={`ri-sun-line ${theme === 'dark' ? 'hidden' : ''} text-lg`}></i>
            <i className={`ri-moon-line ${theme === 'light' ? 'hidden' : ''} text-lg text-white`}></i>
          </button>
        </div>
      </div>
    </header>
  );
}
