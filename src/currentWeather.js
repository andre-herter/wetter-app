import { getForecastWeather } from "./api";
import { rootElement } from "./main";
import { renderLoadingScreen } from "./loading";
import {
  formatTemperatur,
  formatTime,
  get24HoursForecastFromNow,
} from "./untils";

export async function loadCurrentWeather(cityName) {
  renderLoadingScreen("Lade Wetter für " + cityName + "....");
  const weatherData = await getForecastWeather(cityName);
  renderCurrentWeather(weatherData);
  // eventlistener regestrieren
}

function renderCurrentWeather(weatherData) {
  const { location, current, forecast } = weatherData;
  const currentDay = forecast.forecastday[0];

  rootElement.innerHTML =
    getCurrentWeatherHtml(
      location.name,
      formatTemperatur(current.temp_c),
      current.condition.text,
      formatTemperatur(currentDay.day.maxtemp_c),
      formatTemperatur(currentDay.day.mintemp_c)
    ) +
    getTodayForecastHtml(
      currentDay.day.condition.text,
      currentDay.day.maxwind_kph,
      forecast.forecastday,
      current.last_updated_epoch
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

function getTodayForecastHtml(
  condition,
  maxWind,
  forecastdays,
  last_updated_epoch
) {
  const hourlyForecastEl = get24HoursForecastFromNow(
    forecastdays,
    last_updated_epoch
  )
    .filter((el) => el !== undefined)
    .map(
      (hour, i) => `
      <div class="hourly-forecast">
          <div class="hourly-forecast__time">${
            i === 0 ? "Jetzt" : formatTime(hour.time) + " Uhr"
          }</div>
          <img
              src="https:${hour.condition.icon}"
              alt=""
              class="hourly-forecast__icon"
            />
          <div class="hourly-forecast__temperature">${formatTemperatur(
            hour.temp_c
          )}°</div>
      </div>`
    );

  const hourlyForecastHtml = hourlyForecastEl.join("");

  return `
    <div class="today-forecast">
        <div class="today-forecast__conditions">
          Heute ${condition}. Wind bis zu ${maxWind} km/h
        </div>
        <div class="today-forecast__hours">
          ${hourlyForecastHtml}
        </div>
      </div>
  
  `;
}
