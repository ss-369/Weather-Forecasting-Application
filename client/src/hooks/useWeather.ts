import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useWeather } from "@/context/WeatherContext";
import { type Forecast, type RecentSearch } from "@shared/schema";
import { useEffect } from "react";

export function useWeatherData(city: string | null) {
  const { setLoading, setError } = useWeather();

  const result = useQuery<Forecast | null, Error>({
    queryKey: ['/api/weather', city],
    queryFn: async ({ queryKey }) => {
      const [_, cityParam] = queryKey;
      if (!cityParam) return null;
      
      const res = await fetch(`/api/weather?city=${encodeURIComponent(cityParam as string)}`, {
        credentials: 'include'
      });
      
      if (!res.ok) {
        let errorMessage = `Error ${res.status}: Failed to fetch weather data`;
        
        try {
          const errorData = await res.json();
          
          if (errorData.error === "api_key_missing") {
            errorMessage = "OpenWeather API key is required. Please set up an API key to fetch real weather data.";
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // If we can't parse JSON, use the default error message
        }
        
        throw new Error(errorMessage);
      }
      
      return res.json() as Promise<Forecast>;
    },
    enabled: !!city,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });

  // Use effects to handle the callbacks
  useEffect(() => {
    if (result.isSuccess) {
      setError(null);
    }
  }, [result.isSuccess, setError]);

  useEffect(() => {
    if (result.isError && result.error instanceof Error) {
      setError(result.error.message);
    }
  }, [result.isError, result.error, setError]);
  
  useEffect(() => {
    if (result.isSuccess || result.isError) {
      setLoading(false);
    }
  }, [result.isSuccess, result.isError, setLoading]);
  
  return result;
}

export function useRecentSearches() {
  const { setRecentSearches } = useWeather();

  const result = useQuery<RecentSearch[], Error>({
    queryKey: ['/api/recent-searches'],
    queryFn: async () => {
      const res = await fetch('/api/recent-searches', {
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch recent searches');
      }
      
      return res.json() as Promise<RecentSearch[]>;
    }
  });
  
  // Set recent searches when data changes
  useEffect(() => {
    if (result.data) {
      setRecentSearches(result.data);
    }
  }, [result.data, setRecentSearches]);
  
  return result;
}

export function useClearRecentSearches() {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/recent-searches', {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error('Failed to clear recent searches');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recent-searches'] });
    }
  });
}
