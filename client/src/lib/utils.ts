import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, fromUnixTime } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUnixTimestamp(timestamp: number, formatStr: string = "EEEE, dd MMM • HH:mm"): string {
  return format(fromUnixTime(timestamp), formatStr);
}

export function formatHourFromTimestamp(timestamp: number, timezone: number = 0): string {
  const date = fromUnixTime(timestamp + timezone);
  const now = new Date();
  
  // If the timestamp is for the current hour, return "Now"
  if (
    date.getDate() === now.getDate() &&
    date.getHours() === now.getHours()
  ) {
    return "Now";
  }
  
  return format(date, "HH:mm");
}

export function formatDay(timestamp: number, timezone: number = 0): {
  day: string;
  date: string;
} {
  const date = fromUnixTime(timestamp + timezone);
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);
  
  let day = format(date, "EEEE");
  
  // If the timestamp is for today, return "Today"
  if (date.getDate() === now.getDate() && 
      date.getMonth() === now.getMonth() && 
      date.getFullYear() === now.getFullYear()) {
    day = "Today";
  } 
  // If the timestamp is for tomorrow, return "Tomorrow"
  else if (date.getDate() === tomorrow.getDate() && 
           date.getMonth() === tomorrow.getMonth() && 
           date.getFullYear() === tomorrow.getFullYear()) {
    day = "Tomorrow";
  }
  
  return {
    day,
    date: format(date, "EEE, dd MMM")
  };
}

export function getTimeSince(timestamp: number): string {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);
  
  if (diffInSeconds < 60) {
    return "just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
}

export function formatTemperature(temp: number, unit: string): string {
  return `${Math.round(temp)}°${unit === "celsius" ? "C" : "F"}`;
}
