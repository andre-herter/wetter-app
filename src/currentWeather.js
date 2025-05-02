import { getForecastWeather } from "./api";
import { rootElement } from "./main";
import { renderLoadingScreen } from "./loading";
import {
  formatTemperature,
  formatTime,
  get24HoursForecastFromNow,
  formatDateToWeekday,
  formatTwentyFourHourTime,
} from "./untils";
import { getConditionImagePath } from "./conditions";
import { loadMainMenu } from "./mainMenu";

export async function loadCurrentWeather(cityName) {
  renderLoadingScreen("Lade Wetter für " + cityName + "....");
  const weatherData = await getForecastWeather(cityName);
  renderCurrentWeather(weatherData);
  registerEventListeners();
}

function renderCurrentWeather(weatherData) {
  const { location, current, forecast } = weatherData;
  const currentDay = forecast.forecastday[0];

  const conditionImage = getConditionImagePath(
    current.condition.code,
    current.is_day !== 1
  );

  if (conditionImage) {
    rootElement.style = `--detail-condition-image: url(${conditionImage})`;
    rootElement.classList.add("show-background");
  }

  rootElement.innerHTML =
    getActionBarHtml() +
    getCurrentWeatherHtml(
      location.name,
      formatTemperature(current.temp_c),
      current.condition.text,
      formatTemperature(currentDay.day.maxtemp_c),
      formatTemperature(currentDay.day.mintemp_c)
    ) +
    getTodayForecastHtml(
      currentDay.day.condition.text,
      currentDay.day.maxwind_kph,
      forecast.forecastday,
      current.last_updated_epoch
    ) +
    getforecastHtml(forecast.forecastday) +
    getForecastInformationHtml(
      current.humidity,
      current.feelslike_c,
      current.precip_mm,
      current.uv,
      currentDay.astro.sunrise,
      currentDay.astro.sunset
    );
}

function getActionBarHtml() {
  const backIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
`;
  const favoriteIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
  </svg>

`;

  return `
      <div class="action-bar">
          <div class="action-bar__back">${backIcon}</div>
          <div class="action-bar__back">${favoriteIcon}</div>
      </div>
  `;
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
  lastUpdatedEpoch
) {
  const hourlyForecastEl = get24HoursForecastFromNow(
    forecastdays,
    lastUpdatedEpoch
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
          <div class="hourly-forecast__temperature">${formatTemperature(
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

function getforecastHtml(forecast) {
  const forecastEl = forecast.map(
    (forecastDay, i) => `
        <div class="forecast-day">
            <div class="forecast-day__day">${
              i === 0 ? "Heute" : formatDateToWeekday(forecastDay.date)
            }
            </div>
            <img
              src="https:${forecastDay.day.condition.icon}"
              alt=""
              class="forecast-day__icon"
            />
            <div class="forecast__day-temperature">
              <span class="forecast-day__max-temperature">H:${formatTemperature(
                forecastDay.day.maxtemp_c
              )}°</span>
              <span class="forecast-day__min-temperature">T:${formatTemperature(
                forecastDay.day.mintemp_c
              )}°</span>
            </div>
            <div class="forecast-day__wind">Wind: ${
              forecastDay.day.maxwind_kph
            }km/h</div>
        </div>
  `
  );

  const forecastHtml = forecastEl.join("");

  return `
      <div class="forecast">
          <div class="forecast__header">Vorhersage für die nächsten 3 Tage:</div>
          <div class="forecast__days">
            ${forecastHtml}
          </div>
      </div>
  
  `;
}

function getForecastInformationHtml(
  humidity,
  feelslike,
  precip,
  uvIndex,
  sunrise,
  sunset
) {
  return `
    <div class="forecastinformations">
        <div class="forecastinformation"
          <span class="forecastinformation__heading">Feuchtigkeit</span>
          <span class="forecastinformation__value">${humidity}%</span>
        </div>
        <div class="forecastinformation"
          <span class="forecastinformation__heading">Gefühlt</span>
          <span class="forecastinformation__value">${feelslike} °</span>
        </div>
        <div class="forecastinformation"
          <span class="forecastinformation__heading">Niederschlag</span>
          <span class="forecastinformation__value">${precip}mm</span>
        </div>
        <div class="forecastinformation"
          <span class="forecastinformation__heading">UV-Index</span>
          <span class="forecastinformation__value">${uvIndex}</span>
        </div>
        <div class="forecastinformation"
          <span class="forecastinformation__heading">Sonnenaufgang</span>
          <span class="forecastinformation__value">${formatTwentyFourHourTime(
            sunrise
          )} Uhr</span>
        </div>
        <div class="forecastinformation"
          <span class="forecastinformation__heading">Sonnenuntergang</span>
          <span class="forecastinformation__value">${formatTwentyFourHourTime(
            sunset
          )} Uhr</span>
        </div>
    </div>
  
  `;
}

function registerEventListeners() {
  const backButton = document.querySelector(".action-bar__back");

  backButton.addEventListener("click", () => {
    loadMainMenu();
  });
}
