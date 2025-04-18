const API_BASE_URL = "https://api.weatherapi.com/v1";
const API_KEY = "9226203f0d6c46ea9bc85200252603";

export async function getForecastWeather(location, days = 3) {
  const response = await fetch(
    `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=${location}&lang=de&days=${days}`
  );

  const weatherData = await response.json();

  console.log(weatherData);

  return weatherData;
}
