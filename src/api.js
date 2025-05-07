const API_BASE_URL = "https://api.weatherapi.com/v1";
const API_KEY = "9226203f0d6c46ea9bc85200252603";
const FAVORITE_CITIES_KEY = "favorite-cities";

export async function getForecastWeather(location, days = 3) {
  const response = await fetch(
    `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=id:${location}&lang=de&days=${days}`
  );

  const weatherData = await response.json();

  return weatherData;
}

export async function searchLocation(q) {
  const response = await fetch(
    `${API_BASE_URL}/search.json?key=${API_KEY}&q=${q}&lang=de`
  );

  const searchResults = await response.json();

  console.log(searchResults);

  return searchResults;
}

export function getFavoriteCities() {
  return JSON.parse(localStorage.getItem(FAVORITE_CITIES_KEY)) || [];
}

export function saveCityAsFavorite(city) {
  const favorites = getFavoriteCities();

  if (favorites.find((favorite) => favorite === city)) {
    alert(city + " wurde bereits den Favoriten hinzugefügt!");
    return;
  }

  favorites.push(city);

  localStorage.setItem(FAVORITE_CITIES_KEY, JSON.stringify(favorites));
}

export function removeCytyFromFavorite(city) {
  const favorites = getFavoriteCities();

  const filteredFavorites = favorites.filter((favorite) => favorite !== city);

  localStorage.setItem(FAVORITE_CITIES_KEY, JSON.stringify(filteredFavorites));
}
