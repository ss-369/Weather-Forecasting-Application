# Weather Forecasting Application Documentation

## Project Overview
This is a real-time weather forecasting application that provides current weather conditions and 5-day forecasts.

## Tech Stack
- **Frontend**: React, TypeScript, TanStack React Query, Tailwind CSS
- **Backend**: Node.js, Express, PostgreSQL, Drizzle ORM

## Installation Instructions
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd weather-forecasting-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=postgresql://weather_user:password123@localhost:5432/weather_app
   OPENWEATHER_API_KEY=your_openweather_api_key
   ```

## Database Setup
1. Create a PostgreSQL user:
   ```sql
   CREATE USER weather_user WITH PASSWORD 'password123';
   ```
2. Create the database:
   ```sql
   CREATE DATABASE weather_app OWNER weather_user;
   ```

## Running the Application
To start the development server, run:
```bash
npm run dev
```
Access the application UI at [http://localhost:5000](http://localhost:5000).

## API Endpoints
- `GET /api/weather?city={cityName}` - Get weather data for a city.
- `GET /api/recent-searches` - Get recent search history.
- `POST /api/recent-searches` - Add a city to recent searches.
- `DELETE /api/recent-searches` - Clear recent search history.

## Common Issues and Troubleshooting
- If you encounter an error related to the database connection, ensure that the `DATABASE_URL` is correctly set in the `.env` file and that the PostgreSQL server is running.

## Future Improvements
- Implement user authentication for saving favorite locations.
- Add more detailed weather data and visualizations.