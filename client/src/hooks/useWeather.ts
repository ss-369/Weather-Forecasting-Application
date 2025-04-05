import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useWeather } from "@/context/WeatherContext";
import { type Forecast, type RecentSearch } from "@shared/schema";

export function useWeatherData(city: string | null) {
  const { setLoading, setError } = useWeather();

  return useQuery({
    queryKey: ['/api/weather', city],
    queryFn: async () => {
      if (!city) return null;
      
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`, {
        credentials: 'include'
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Error ${res.status}: Failed to fetch weather data`);
      }
      
      return res.json() as Promise<Forecast>;
    },
    enabled: !!city,
    onSuccess: () => {
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
    onSettled: () => {
      setLoading(false);
    }
  });
}

export function useRecentSearches() {
  const { setRecentSearches } = useWeather();

  return useQuery({
    queryKey: ['/api/recent-searches'],
    queryFn: async () => {
      const res = await fetch('/api/recent-searches', {
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch recent searches');
      }
      
      return res.json() as Promise<RecentSearch[]>;
    },
    onSuccess: (data) => {
      setRecentSearches(data);
    }
  });
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
