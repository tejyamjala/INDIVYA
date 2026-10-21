export type CurrentWeather = {
  temperature: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  label: string;
};

const weatherLabels: Record<number, string> = {
  0: "Clear sky",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Cloudy",
  45: "Misty",
  48: "Misty",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Steady drizzle",
  61: "Light rain",
  63: "Rain showers",
  65: "Rain",
  71: "Light snow",
  73: "Snow showers",
  75: "Snow",
  80: "Rain showers",
  81: "Rain showers",
  82: "Heavy showers",
  95: "Thunderstorms",
};

export async function fetchCurrentWeather(lat: number, lon: number, signal?: AbortSignal): Promise<CurrentWeather> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
    timezone: "auto",
  }).toString();
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error("Weather unavailable");
  const result = await response.json();
  const current = result.current;
  if (!current) throw new Error("Weather unavailable");
  return {
    temperature: current.temperature_2m,
    feelsLike: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    wind: current.wind_speed_10m,
    label: weatherLabels[current.weather_code] ?? "Current conditions",
  };
}

export async function fetchDelhiWeather(signal?: AbortSignal): Promise<number> {
  const weather = await fetchCurrentWeather(28.6139, 77.209, signal);
  return Math.round(weather.temperature);
}
