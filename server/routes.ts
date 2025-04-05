import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRecentSearchSchema } from "@shared/schema";
import axios from "axios";
import NodeCache from "node-cache";

// Cache for weather data (30 minutes TTL)
const weatherCache = new NodeCache({ stdTTL: 1800 });

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "your_openweathermap_api_key";
  
  // Get recent searches
  app.get("/api/recent-searches", async (req, res) => {
    try {
      const recentSearches = await storage.getRecentSearches();
      res.json(recentSearches);
    } catch (error) {
      console.error("Error fetching recent searches:", error);
      res.status(500).json({ message: "Failed to fetch recent searches" });
    }
  });

  // Add a recent search
  app.post("/api/recent-searches", async (req, res) => {
    try {
      const parseResult = insertRecentSearchSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid search data" });
      }
      
      const newSearch = await storage.addRecentSearch(parseResult.data);
      res.status(201).json(newSearch);
    } catch (error) {
      console.error("Error adding recent search:", error);
      res.status(500).json({ message: "Failed to add recent search" });
    }
  });

  // Clear recent searches
  app.delete("/api/recent-searches", async (req, res) => {
    try {
      await storage.clearRecentSearches();
      res.status(204).send();
    } catch (error) {
      console.error("Error clearing recent searches:", error);
      res.status(500).json({ message: "Failed to clear recent searches" });
    }
  });

  // Get weather by city name
  app.get("/api/weather", async (req, res) => {
    try {
      const city = req.query.city;
      
      if (!city || typeof city !== "string") {
        return res.status(400).json({ message: "City name is required" });
      }
      
      // Check cache first
      const cacheKey = `weather_${city.toLowerCase().trim()}`;
      const cachedData = weatherCache.get(cacheKey);
      
      if (cachedData) {
        return res.json(cachedData);
      }
      
      // Get coordinates for the city
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${OPENWEATHER_API_KEY}`
      );
      
      if (!geoResponse.data || geoResponse.data.length === 0) {
        return res.status(404).json({ message: "City not found" });
      }
      
      const { lat, lon, name: cityName, country } = geoResponse.data[0];
      
      // Get weather data using One Call API
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      
      const { current, hourly, daily, timezone, timezone_offset } = weatherResponse.data;
      
      // Format the data
      const formattedData = {
        current: {
          city: cityName,
          country,
          dt: current.dt,
          temp: current.temp,
          feels_like: current.feels_like,
          temp_min: daily[0].temp.min,
          temp_max: daily[0].temp.max,
          humidity: current.humidity,
          wind_speed: current.wind_speed,
          weather: current.weather,
          visibility: current.visibility,
          pressure: current.pressure,
          uvi: current.uvi,
          clouds: current.clouds,
          timezone: timezone_offset
        },
        hourly: hourly.slice(0, 24).map((hour: any) => ({
          dt: hour.dt,
          temp: hour.temp,
          weather: hour.weather,
          pop: hour.pop
        })),
        daily: daily.slice(0, 5).map((day: any) => ({
          dt: day.dt,
          temp: day.temp,
          weather: day.weather,
          pop: day.pop
        })),
        lastUpdated: Date.now()
      };
      
      // Save to cache
      weatherCache.set(cacheKey, formattedData);
      
      res.json(formattedData);
      
      // Add to recent searches (don't await to not delay response)
      storage.addRecentSearch({ city: cityName, country }).catch(err => {
        console.error("Failed to save recent search:", err);
      });
      
    } catch (error) {
      console.error("Error fetching weather data:", error);
      
      // Determine if it's an API error with status code
      if (axios.isAxiosError(error) && error.response) {
        return res.status(error.response.status).json({ 
          message: "Weather API error",
          details: error.response.data
        });
      }
      
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });

  return httpServer;
}
