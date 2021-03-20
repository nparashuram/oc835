module.exports = {
  getFilenameFromTime(text = "cam0", date = new Date()) {
    const ts = new Intl.DateTimeFormat("en-us", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
      .formatToParts(date)
      .reduce((acc, i) => ({ ...acc, [i.type]: i.value }), {});
    return `${text}-${ts.year}-${ts.month}-${ts.day}__${ts.hour}-${ts.minute}-${ts.second}.mp4`;
  },

  getTimeFromFilename(file) {
    const [camera, year, month, date, _, hour, min, sec] = file.split(/[-_\.]/);
    const time = new Date();
    time.setFullYear(year);
    time.setMonth(parseInt(month) - 1);
    time.setDate(date);
    time.setHours(hour);
    time.setMinutes(min);
    time.setSeconds(sec);

    return { camera, time: time.getTime(), file };
  },
};
