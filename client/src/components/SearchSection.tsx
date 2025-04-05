import { useState, useEffect, useRef } from "react";
import { useWeather } from "@/context/WeatherContext";
import { useRecentSearches } from "@/hooks/useWeather";

interface SearchSectionProps {
  onSearch: (city: string) => void;
}

export function SearchSection({ onSearch }: SearchSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { recentSearches } = useWeather();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Get recent searches
  useRecentSearches();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };
  
  const handleRecentSearch = (city: string) => {
    setSearchTerm(city);
    onSearch(city);
  };
  
  return (
    <div className="mb-8">
      <div className="relative max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for a city..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        
        {recentSearches.length > 0 && (
          <div className="mt-2">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Recent:</span>
              {recentSearches.map((search, index) => (
                <span
                  key={index}
                  className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => handleRecentSearch(search.city)}
                >
                  {search.city}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
