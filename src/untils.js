export function formatTemperature(temperature) {
  return Math.floor(temperature);
}

export function formatTime(time) {
  const date = new Date(time);
  const hourOnly = date.getHours();

  return hourOnly;
}

export function formatDateToWeekday(date) {
  const currentDate = new Date(date);
  const weekday = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  const dayIndex = currentDate.getDay();

  return weekday[dayIndex];
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
