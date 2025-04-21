export function formatTemperatur(temperature) {
  return Math.round(temperature);
}

export function formatTime(time) {
  const date = new Date(time);
  const hourOnly = date.getHours();

  return hourOnly;
}

export function get24HoursForecastFromNow(forecast, last_updated_epoch) {
  console.log(forecast, last_updated_epoch);

  const todaysForecast = forecast[0].hour;
  const tomorrowsForecast = forecast[1].hour;

  const newForecast = [];

  const firstFutureTimeIndex = todaysForecast.findIndex(
    (hour) => hour.time_epoch > last_updated_epoch
  );

  console.log(firstFutureTimeIndex);

  for (let i = firstFutureTimeIndex - 1; i < todaysForecast.length; i++) {
    newForecast.push(todaysForecast[i]);
  }

  let tomorrowIndex = 0;

  while (newForecast.length < 24) {
    newForecast.push(tomorrowsForecast[tomorrowIndex]);
    tomorrowIndex++;
  }

  return newForecast;
}
