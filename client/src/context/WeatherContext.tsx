import { createContext, useContext, useState } from "react";
import { type Forecast, type RecentSearch } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface WeatherContextProps {
  unit: "celsius" | "fahrenheit";
  setUnit: (unit: "celsius" | "fahrenheit") => void;
  convertTemp: (temp: number) => number;
  recentSearches: RecentSearch[];
  setRecentSearches: (searches: RecentSearch[]) => void;
  addRecentSearch: (city: string, country?: string) => Promise<void>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const WeatherContext = createContext<WeatherContextProps>({
  unit: "celsius",
  setUnit: () => {},
  convertTemp: (temp) => temp,
  recentSearches: [],
  setRecentSearches: () => {},
  addRecentSearch: async () => {},
  loading: false,
  setLoading: () => {},
  error: null,
  setError: () => {},
});

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [unit, setUnit] = useState<"celsius" | "fahrenheit">("celsius");
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert temperature based on selected unit
  const convertTemp = (temp: number): number => {
    if (unit === "fahrenheit") {
      return (temp * 9) / 5 + 32;
    }
    return temp;
  };

  // Add a city to recent searches
  const addRecentSearch = async (city: string, country?: string): Promise<void> => {
    try {
      const response = await apiRequest("POST", "/api/recent-searches", { 
        city, 
        country 
      });
      
      const newSearch = await response.json();
      
      // Update recent searches state by adding new and keeping only the latest 5
      setRecentSearches(prev => {
        // Remove if already exists
        const filtered = prev.filter(s => 
          s.city.toLowerCase() !== city.toLowerCase()
        );
        
        // Add to beginning and limit to 5
        return [newSearch, ...filtered].slice(0, 5);
      });
    } catch (err) {
      console.error("Failed to add recent search:", err);
    }
  };

  return (
    <WeatherContext.Provider
      value={{
        unit,
        setUnit,
        convertTemp,
        recentSearches,
        setRecentSearches,
        addRecentSearch,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export const useWeather = () => useContext(WeatherContext);
