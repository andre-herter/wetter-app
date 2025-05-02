import { getForecastWeather } from "./api";
import { loadCurrentWeather } from "./currentWeather";
import { renderLoadingScreen } from "./loading";
import { rootElement } from "./main";
import { getConditionImagePath } from "./conditions";
import { formatTemperature } from "./untils";

export async function loadMainMenu() {
  rootElement.classList.remove("show-background");
  renderLoadingScreen("Lade Übersicht...");
  await renderMainMenu();
}

async function renderMainMenu() {
  rootElement.innerHTML = `
            <div class="main-menu">
                ${getMenuHeaderHtml()}
                ${await getCitiesHtml()}
            </div>
    `;

  registerEventListeners();
}

function getMenuHeaderHtml() {
  return `
        <div class="main-menu__heading">
            Wetter <button class="main-menu__edit">Bearbeiten</button>
        </div>
        <div class="main-menu__search-bar">
            <input
                type="text"
                class="main-menu__search-input"
                placeholder="Nach Stadt suchen"
            />
            </div>
    
    `;
}

async function getCitiesHtml() {
  const favoriteCities = ["Kreuztal", "London", "Peking"];

  const favoriteCityEl = [];

  for (let city of favoriteCities) {
    const weatherData = await getForecastWeather(city, 1);

    const { location, current, forecast } = weatherData;
    const currentDay = forecast.forecastday[0];

    const conditionImage = getConditionImagePath(
      current.condition.code,
      current.is_day !== 1
    );

    const cityHtml = `
        <div class="wrapper">
            <div
                class="city"
                data-city-name=${location.name}
                ${
                  conditionImage
                    ? `style="
                    --condition-image: url(${conditionImage});
                    "`
                    : ""
                }
                
            >
                <div class="city__left-column">
                    <h2 class="city__name">${city}</h2>
                    <div class="city__country">${location.country}</div>
                    <div class="city__condition">${current.condition.text}</div>
                </div>
                <div class="city__right-column">
                    <div class="city__temperature">${formatTemperature(
                      current.temp_c
                    )}°</div>
                    <div class="city__min-max-temperature">H:${formatTemperature(
                      currentDay.day.maxtemp_c
                    )}° T:${formatTemperature(currentDay.day.mintemp_c)}°</div>
                </div>
            </div>
        </div>
    
     `;
    favoriteCityEl.push(cityHtml);
  }

  const favoriteCitiesHtml = favoriteCityEl.join("");

  return `
      <div class="main-menu__cities">
            ${favoriteCitiesHtml}
      </div>
    
    
    `;
}

function registerEventListeners() {
  const cities = document.querySelectorAll(".city");

  cities.forEach((city) => {
    city.addEventListener("click", () => {
      const cityName = city.getAttribute("data-city-name");

      loadCurrentWeather(cityName);
    });
  });
}
