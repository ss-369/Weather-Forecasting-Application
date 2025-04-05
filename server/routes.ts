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
  const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "";
  
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
      
      if (!OPENWEATHER_API_KEY) {
        return res.status(401).json({ 
          message: "OpenWeather API key is required",
          error: "api_key_missing"
        });
      }
      
      // Check cache first
      const cacheKey = `weather_${city.toLowerCase().trim()}`;
      const cachedData = weatherCache.get(cacheKey);
      
      if (cachedData) {
        return res.json(cachedData);
      }
      
      // Get current weather data (free tier API)
      const currentResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      
      if (!currentResponse.data) {
        return res.status(404).json({ message: "City not found" });
      }
      
      const { name: cityName, coord, sys, main, wind, weather, visibility, dt, clouds, timezone } = currentResponse.data;
      
      // Get forecast data separately (free tier API)
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      
      // Format the current weather data
      const current = {
        city: cityName,
        country: sys.country,
        dt: dt,
        temp: main.temp,
        feels_like: main.feels_like,
        temp_min: main.temp_min,
        temp_max: main.temp_max,
        humidity: main.humidity,
        wind_speed: wind.speed,
        weather: weather,
        visibility: visibility,
        pressure: main.pressure,
        clouds: clouds.all,
        timezone: timezone
      };
      
      // Process hourly forecast - 5 day forecast in 3-hour steps (we'll take the first 24 hours)
      const hourly = forecastResponse.data.list.slice(0, 8).map((item: any) => ({
        dt: item.dt,
        temp: item.main.temp,
        weather: item.weather,
        pop: item.pop
      }));
      
      // Process daily forecast - we'll group by day and take max/min temps
      const dailyMap = new Map();
      
      forecastResponse.data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        
        if (!dailyMap.has(dayKey)) {
          dailyMap.set(dayKey, {
            dt: item.dt,
            temp: {
              day: item.main.temp,
              min: item.main.temp_min,
              max: item.main.temp_max,
              night: item.main.temp,
              eve: item.main.temp,
              morn: item.main.temp
            },
            weather: item.weather,
            pop: item.pop
          });
        } else {
          const existing = dailyMap.get(dayKey);
          // Update min/max
          existing.temp.min = Math.min(existing.temp.min, item.main.temp_min);
          existing.temp.max = Math.max(existing.temp.max, item.main.temp_max);
          
          // Set different times of day based on hour
          const hour = date.getHours();
          if (hour >= 6 && hour < 12) {
            existing.temp.morn = item.main.temp;
          } else if (hour >= 12 && hour < 18) {
            existing.temp.day = item.main.temp;
          } else if (hour >= 18 && hour < 22) {
            existing.temp.eve = item.main.temp;
          } else {
            existing.temp.night = item.main.temp;
          }
          
          // Update pop to the highest probability
          if (item.pop > existing.pop) {
            existing.pop = item.pop;
            existing.weather = item.weather; // Use weather from the time with highest precipitation chance
          }
        }
      });
      
      const daily = Array.from(dailyMap.values()).slice(0, 5);
      
      // Combine the data
      const formattedData = {
        current,
        hourly,
        daily,
        lastUpdated: Date.now()
      };
      
      // Save to cache
      weatherCache.set(cacheKey, formattedData);
      
      res.json(formattedData);
      
      // Add to recent searches (don't await to not delay response)
      storage.addRecentSearch({ city: cityName, country: sys.country }).catch(err => {
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
