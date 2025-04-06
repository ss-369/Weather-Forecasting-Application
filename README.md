# Weather Forecasting Application

A real-time weather forecasting application with current conditions and 5-day forecasts.

## Features

- Current weather conditions display
- Hourly forecast (8 hours)
- 5-day weather forecast
- Unit toggle (Celsius/Fahrenheit)
- Recent searches history with PostgreSQL persistence
- Dark/Light mode theme toggle
- Responsive design for mobile, tablet, and desktop

## Tech Stack

### Frontend
- React
- TypeScript
- TanStack React Query
- Tailwind CSS
- Shadcn UI
- Context API for state management

### Backend
- Node.js & Express
- PostgreSQL database
- Drizzle ORM
- Zod validation

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18 or higher)
- npm (comes with Node.js)
- PostgreSQL database

## Installation and Setup

Follow these steps to run the application locally:

### 1. Clone the repository
```bash
git clone <repository-url>
cd weather-forecasting-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory with the following variables:

```
# Database connection (replace with your PostgreSQL details)
DATABASE_URL=postgresql://username:password@localhost:5432/weather_app

# OpenWeather API Key (required)
OPENWEATHER_API_KEY=your_openweather_api_key
```

> **Important**: You need to obtain an OpenWeather API key from [OpenWeatherMap](https://openweathermap.org/api). Sign up for a free account and get your API key from the dashboard.

### 4. Set up the database
Ensure PostgreSQL is running on your machine, then create the database:

```bash
# Create a new PostgreSQL database
createdb weather_app

# Run database migrations
npm run db:push
```

### 5. Start the application
```bash
npm run dev
```

The application will be available at [http://localhost:5000](http://localhost:5000)

## Screenshots
![Enter City](screenshots/enter_city.png)
![Today's Forecast](screenshots/Todays_Forecast.png)

![Historical Weather](screenshots/Historical_weather.png)
![5 Day Forecast](screenshots/5_day_forecast.png)
![Daily Summaries](screenshots/Daily_summaries.png)


## Project Structure

- `/client` - Frontend React application
  - `/src/components` - UI components
  - `/src/context` - React context providers
  - `/src/hooks` - Custom React hooks
  - `/src/pages` - Page components
- `/server` - Backend Express server
  - `routes.ts` - API endpoints
  - `storage.ts` - Database access layer
- `/shared` - Shared code between frontend and backend
  - `schema.ts` - Database schema and TypeScript types

## API Endpoints

- `GET /api/weather?city={cityName}` - Get weather data for a city
- `GET /api/recent-searches` - Get recent search history
- `POST /api/recent-searches` - Add a city to recent searches
- `DELETE /api/recent-searches` - Clear recent search history

## License

[MIT License](LICENSE)
