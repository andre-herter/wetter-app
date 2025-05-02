import {
  getFavoriteCities,
  getForecastWeather,
  removeCytyFromFavorite,
  searchLocation,
} from "./api";
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
              <div class="main-menu__search-results"></div>
            </div>
    
    `;
}

const deleteIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
`;

async function getCitiesHtml() {
  const favoriteCities = getFavoriteCities();

  if (!favoriteCities || favoriteCities.length < 1) {
    return "Noch keine Favoriten grspeichert";
  }

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
            <div class="wrapper__delete" data-city-name="${city}">${deleteIcon}</div>
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

function renderSearchResults(searchResults) {
  const searchResultsEl = searchResults.map(
    (result) => `
        <div class="search-result" data-city-name="${result.name}">
          <h3 class="search-result__name">${result.name}</h3>
          <p class="search-result__country">${result.country}</p>
        </div>
    `
  );

  const searchResultsHtml = searchResultsEl.join("");

  const searchResultsDiv = document.querySelector(".main-menu__search-results");
  searchResultsDiv.innerHTML = searchResultsHtml;
}

function registerSearchResultsEventListeners() {
  const searchResults = document.querySelectorAll(".search-result");

  searchResults.forEach((searchResult) => {
    searchResult.addEventListener("click", () => {
      const cityName = searchResult.getAttribute("data-city-name");
      loadCurrentWeather(cityName);
    });
  });
}

function registerEventListeners() {
  const editButton = document.querySelector(".main-menu__edit");
  const deleteButton = document.querySelectorAll(".wrapper__delete");

  deleteButton.forEach((btn) => {
    btn.addEventListener("click", () => {
      removeCytyFromFavorite(btn.getAttribute("data-city-name"));
      btn.parentElement.remove();
    });
  });

  editButton.addEventListener("click", () => {
    const EDIT_ATTRIBUTE = "data-edit-mode";

    if (!editButton.getAttribute(EDIT_ATTRIBUTE)) {
      editButton.setAttribute(EDIT_ATTRIBUTE, "true");
      editButton.textContent = "Fertig";

      deleteButton.forEach((btn) => {
        btn.classList.add("wrapper__delete--show");
      });
    } else {
      editButton.removeAttribute(EDIT_ATTRIBUTE);
      editButton.textContent = "Bearbeiten";

      deleteButton.forEach((btn) => {
        btn.classList.remove("wrapper__delete--show");
      });
    }
  });

  const searchBar = document.querySelector(".main-menu__search-input");

  searchBar.addEventListener("input", async (e) => {
    const q = e.target.value;

    let searchResults = [];

    if (q.length > 1) {
      searchResults = await searchLocation(q);
      console.log(searchResults);
    }

    renderSearchResults(searchResults);
    registerSearchResultsEventListeners();
  });

  const cities = document.querySelectorAll(".city");

  cities.forEach((city) => {
    city.addEventListener("click", () => {
      const cityName = city.getAttribute("data-city-name");

      loadCurrentWeather(cityName);
    });
  });
}
