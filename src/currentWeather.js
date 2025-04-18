import { rootElement } from "./main";
import { getForecastWeather } from "./api";
import { formatTemperatur } from "./untils";

export async function loadCurrentWeather() {
  //loading screen anzeigen
  const weatherData = await getForecastWeather("Kreuztal");
  renderCurrentWeather(weatherData);
  // eventlistener regestrieren
}

function renderCurrentWeather(weatherData) {
  const { location, current, forecast } = weatherData;
  const currentDay = forecast.forecastday[0];

  rootElement.innerHTML = getCurrentWeatherHtml(
    location.name,
    formatTemperatur(current.temp_c),
    current.condition.text,
    formatTemperatur(currentDay.day.maxtemp_c),
    formatTemperatur(currentDay.day.mintemp_c)
  );
}

function getCurrentWeatherHtml(
  location,
  currentTemp,
  condition,
  maxTemp,
  minTemp
) {
  return `
    <div class="current-weather">
        <h2 class="current-weather__city">${location}</h2>
        <h1 class="current-weather__current-temperature">${currentTemp}°</h1>
        <p class="current-weather__condition">${condition}</p>
        <div class="current-weather__day-temperature">
          <span class="condition__max-temperature">H:${maxTemp}°</span>
          <span class="condition__min-temperature">T:${minTemp}°</span>
        </div>
      </div>
    
    `;
}
