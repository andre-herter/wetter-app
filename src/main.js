import "/styles/styles.scss";
import { loadCurrentWeather } from "./currentWeather";

export const rootElement = document.getElementById("app");

loadCurrentWeather("Siegen");
