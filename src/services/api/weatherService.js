// Mock weather data - realistic weather information for farming application
const weatherData = {
  current: {
    id: 1,
    location: "Farm Location",
    temperature: 22,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    windDirection: "SW",
    precipitation: 0,
    uvIndex: 6,
    visibility: 10,
    pressure: 1013,
    feelsLike: 24,
    timestamp: new Date().toISOString()
  },
  forecast: [
    {
      date: new Date().toISOString().split('T')[0],
      high: 25,
      low: 18,
      condition: "Partly Cloudy",
      precipitationChance: 20,
      humidity: 65,
      windSpeed: 12
    },
    {
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      high: 28,
      low: 20,
      condition: "Sunny",
      precipitationChance: 5,
      humidity: 55,
      windSpeed: 8
    },
    {
      date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      high: 26,
      low: 19,
      condition: "Light Rain",
      precipitationChance: 80,
      humidity: 75,
      windSpeed: 15
    },
    {
      date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      high: 23,
      low: 16,
      condition: "Cloudy",
      precipitationChance: 40,
      humidity: 70,
      windSpeed: 10
    },
    {
      date: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
      high: 27,
      low: 21,
      condition: "Sunny",
      precipitationChance: 10,
      humidity: 60,
      windSpeed: 7
    }
  ],
  farmingRecommendations: [
    "Good conditions for outdoor farming activities",
    "Soil moisture levels are adequate for planting",
    "Light winds favorable for pesticide application",
    "UV levels moderate - ensure worker protection"
  ]
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const weatherService = {
  async getForecast() {
    await new Promise(resolve => setTimeout(resolve, 400));
await delay(400); // Realistic API delay
    return { ...weatherData };
  },

  async getCurrentWeather() {
    await new Promise(resolve => setTimeout(resolve, 200));
await delay(400); // Realistic API delay
    return { ...weatherData };
  }
};

export default weatherService;