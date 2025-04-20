export function formatTemperatur(temperature) {
  return Math.round(temperature);
}

export function formatTime(time) {
  const date = new Date(time);
  const hourOnly = date.getHours();

  return hourOnly;
}
