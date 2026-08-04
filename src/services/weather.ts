export interface WeatherSnapshot {
  tempC: number;
  condition: string;
}

const CONDITION_MAP: Record<number, string> = {
  0: 'Sunny',
  1: 'Sunny',
  2: 'Partly cloudy',
  3: 'Cloudy',
  45: 'Foggy',
  48: 'Foggy',
  51: 'Drizzly',
  53: 'Drizzly',
  55: 'Drizzly',
  56: 'Freezing drizzle',
  57: 'Freezing drizzle',
  61: 'Rainy',
  63: 'Rainy',
  65: 'Rainy',
  66: 'Freezing rain',
  67: 'Freezing rain',
  71: 'Snowy',
  73: 'Snowy',
  75: 'Snowy',
  77: 'Snowy',
  80: 'Rainy',
  81: 'Rainy',
  82: 'Rainy',
  85: 'Snowy',
  86: 'Snowy',
  95: 'Stormy',
  96: 'Stormy',
  99: 'Stormy',
};

function mapWeatherCode(code: number) {
  return CONDITION_MAP[code] ?? 'Unknown';
}

export async function getWeather(lat: number, lng: number): Promise<WeatherSnapshot> {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lng)}&current_weather=true`
  );

  if (!response.ok) {
    throw new Error(`Weather request failed with status ${response.status}`);
  }

  const data = await response.json();
  const current = data.current_weather;

  if (!current || typeof current.temperature !== 'number' || typeof current.weathercode !== 'number') {
    throw new Error('Invalid weather response');
  }

  return {
    tempC: current.temperature,
    condition: mapWeatherCode(current.weathercode),
  };
}
