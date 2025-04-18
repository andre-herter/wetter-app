import { loadCurrentWeather } from "./currentWeather";
import "/styles/styles.scss";

export const rootElement = document.getElementById("app");

loadCurrentWeather();
