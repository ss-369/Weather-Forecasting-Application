import { useState, useMemo } from "react";
import { HistoricalWeather as HistoricalWeatherType } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatTemperature, formatUnixTimestamp } from "@/lib/utils";
import { useWeather } from "@/context/WeatherContext";
import { WeatherIcon } from "./WeatherIcon";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";

interface HistoricalWeatherProps {
  data: HistoricalWeatherType;
}

export function HistoricalWeather({ data }: HistoricalWeatherProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>("temperature");
  const { unit } = useWeather();
  
  // Group data by day
  const groupedByDay = useMemo(() => {
    const days: { [key: string]: typeof data.data } = {};
    
    data.data.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      
      if (!days[dayKey]) {
        days[dayKey] = [];
      }
      
      days[dayKey].push(item);
    });
    
    return Object.entries(days).sort((a, b) => {
      // Sort by date (newest first)
      return new Date(b[0]).getTime() - new Date(a[0]).getTime();
    });
  }, [data.data]);
  
  // Format data for chart
  const chartData = useMemo(() => {
    return data.data.map(item => {
      let tempValue = unit === "celsius" ? item.temp : (item.temp * 9/5) + 32;
      let feelsLikeValue = unit === "celsius" ? item.feels_like : (item.feels_like * 9/5) + 32;
      
      return {
        time: formatUnixTimestamp(item.dt, "MMM dd, HH:mm"),
        date: new Date(item.dt * 1000),
        temperature: Number(tempValue.toFixed(1)),
        feelsLike: Number(feelsLikeValue.toFixed(1)),
        humidity: item.humidity,
        windSpeed: item.wind_speed,
        pressure: item.pressure,
        weatherMain: item.weather[0].main,
        weatherDescription: item.weather[0].description,
        weatherIcon: item.weather[0].icon
      };
    }).sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort by date (oldest first)
  }, [data.data, unit]);
  
  const renderMetricChart = () => {
    let areaColor = "#3b82f6"; // Default blue
    let yAxisLabel = "";
    
    switch (selectedMetric) {
      case "temperature":
        areaColor = "#ef4444"; // Red
        yAxisLabel = `Temperature (°${unit === "celsius" ? "C" : "F"})`;
        break;
      case "feelsLike":
        areaColor = "#f97316"; // Orange
        yAxisLabel = `Feels Like (°${unit === "celsius" ? "C" : "F"})`;
        break;
      case "humidity":
        areaColor = "#3b82f6"; // Blue
        yAxisLabel = "Humidity (%)";
        break;
      case "windSpeed":
        areaColor = "#22c55e"; // Green
        yAxisLabel = "Wind Speed (m/s)";
        break;
      case "pressure":
        areaColor = "#8b5cf6"; // Purple
        yAxisLabel = "Pressure (hPa)";
        break;
    }
    
    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis 
            label={{ 
              value: yAxisLabel, 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }} 
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-3 shadow-lg rounded-lg">
                    <p className="font-semibold">{label}</p>
                    <div className="flex items-center mt-2 gap-2">
                      <WeatherIcon 
                        iconCode={data.weatherIcon} 
                        description={data.weatherDescription} 
                        size="xs"
                      />
                      <span>{data.weatherDescription}</span>
                    </div>
                    <p className="mt-1">
                      {selectedMetric === "temperature" && 
                        `Temperature: ${formatTemperature(data.temperature, unit)}`}
                      {selectedMetric === "feelsLike" && 
                        `Feels like: ${formatTemperature(data.feelsLike, unit)}`}
                      {selectedMetric === "humidity" && 
                        `Humidity: ${data.humidity}%`}
                      {selectedMetric === "windSpeed" && 
                        `Wind speed: ${data.windSpeed} m/s`}
                      {selectedMetric === "pressure" && 
                        `Pressure: ${data.pressure} hPa`}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey={selectedMetric} 
            stroke={areaColor} 
            fill={areaColor} 
            fillOpacity={0.3} 
            activeDot={{ r: 8 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };
  
  return (
    <Card className="mb-8 bg-white dark:bg-gray-800 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Historical Weather</CardTitle>
        <CardDescription>
          Weather data for {data.city}, {data.country} over the past few days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="temperature" onValueChange={setSelectedMetric}>
          <TabsList className="mb-4">
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="feelsLike">Feels Like</TabsTrigger>
            <TabsTrigger value="humidity">Humidity</TabsTrigger>
            <TabsTrigger value="windSpeed">Wind Speed</TabsTrigger>
            <TabsTrigger value="pressure">Pressure</TabsTrigger>
          </TabsList>
          
          {renderMetricChart()}
        </Tabs>
        
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-3">Daily Summaries</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedByDay.map(([day, items]) => {
              const date = new Date(day);
              const formattedDate = new Intl.DateTimeFormat('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric'
              }).format(date);
              
              // Calculate the average temperature for this day
              const avgTemp = items.reduce((sum, item) => sum + item.temp, 0) / items.length;
              const formattedTemp = formatTemperature(
                unit === "celsius" ? avgTemp : (avgTemp * 9/5) + 32, 
                unit
              );
              
              // Get the most common weather condition
              const weatherCounts: Record<string, number> = {};
              items.forEach(item => {
                const weatherType = item.weather[0].main;
                weatherCounts[weatherType] = (weatherCounts[weatherType] || 0) + 1;
              });
              
              let mostCommonWeather = items[0].weather[0];
              let maxCount = 0;
              
              Object.entries(weatherCounts).forEach(([weather, count]) => {
                if (count > maxCount) {
                  maxCount = count;
                  // Find an item with this weather to get the full weather object
                  const weatherItem = items.find(item => item.weather[0].main === weather);
                  if (weatherItem) {
                    mostCommonWeather = weatherItem.weather[0];
                  }
                }
              });
              
              return (
                <Card key={day} className="overflow-hidden bg-gray-50 dark:bg-gray-700">
                  <CardHeader className="p-4">
                    <CardTitle className="text-md">{formattedDate}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <WeatherIcon 
                          iconCode={mostCommonWeather.icon} 
                          description={mostCommonWeather.description} 
                        />
                        <div className="ml-3">
                          <div className="font-semibold">{formattedTemp}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                            {mostCommonWeather.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}