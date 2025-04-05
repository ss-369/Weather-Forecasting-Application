import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const recentSearches = pgTable("recent_searches", {
  id: serial("id").primaryKey(),
  city: text("city").notNull(),
  country: text("country"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertRecentSearchSchema = createInsertSchema(recentSearches).pick({
  city: true,
  country: true,
});

export type RecentSearch = typeof recentSearches.$inferSelect;
export type InsertRecentSearch = z.infer<typeof insertRecentSearchSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Weather API schemas
export const currentWeatherSchema = z.object({
  city: z.string(),
  country: z.string().optional(),
  dt: z.number(),
  temp: z.number(),
  feels_like: z.number(),
  temp_min: z.number(),
  temp_max: z.number(),
  humidity: z.number(),
  wind_speed: z.number(),
  weather: z.array(z.object({
    id: z.number(),
    main: z.string(),
    description: z.string(),
    icon: z.string()
  })),
  visibility: z.number().optional(),
  pressure: z.number().optional(),
  uvi: z.number().optional(),
  pop: z.number().optional(), // Probability of precipitation
  clouds: z.number().optional(),
  timezone: z.number().optional()
});

export const hourlyForecastSchema = z.object({
  dt: z.number(),
  temp: z.number(),
  weather: z.array(z.object({
    id: z.number(),
    main: z.string(),
    description: z.string(),
    icon: z.string()
  })),
  pop: z.number().optional()
});

export const dailyForecastSchema = z.object({
  dt: z.number(),
  temp: z.object({
    day: z.number(),
    min: z.number(),
    max: z.number(),
    night: z.number(),
    eve: z.number(),
    morn: z.number()
  }),
  weather: z.array(z.object({
    id: z.number(),
    main: z.string(),
    description: z.string(),
    icon: z.string()
  })),
  pop: z.number().optional()
});

export const forecastSchema = z.object({
  current: currentWeatherSchema,
  hourly: z.array(hourlyForecastSchema),
  daily: z.array(dailyForecastSchema),
  lastUpdated: z.number()
});

export type CurrentWeather = z.infer<typeof currentWeatherSchema>;
export type HourlyForecast = z.infer<typeof hourlyForecastSchema>;
export type DailyForecast = z.infer<typeof dailyForecastSchema>;
export type Forecast = z.infer<typeof forecastSchema>;
