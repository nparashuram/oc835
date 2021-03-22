function getTimeFromFilename(file) {
  if (file == null) {
    return {};
  }
  const [camera, year, month, date, _, hour, min, sec] = file.split(/[-_\.]/);
  const time = new Date();
  time.setFullYear(year);
  time.setMonth(parseInt(month) - 1);
  time.setDate(date);
  time.setHours(hour);
  time.setMinutes(min);
  time.setSeconds(sec);

  return { camera, time: time.getTime(), file };
}

function getFormattedTime(d) {
  const pad2 = (num) => ("0" + num).slice(-2);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(
    d.getSeconds()
  )}`;
}
