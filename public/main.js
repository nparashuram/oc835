function getFormattedTime(d) {
  const pad2 = (num) => ("0" + num).slice(-2);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(
    d.getSeconds()
  )}`;
}

const getVideoPageHash = (time, cam, file) => `time=${time.getTime()}&cam=${cam}&file=${file}`

const API = {
  deleteVideos: (videos) =>
    videos && fetch("api/videos/delete", {
      method: "POST",
      body: JSON.stringify(videos),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        window.location.reload();
      })
      .catch((e) => {
        console.log("Error deleting videos ", e);
      }),

  fetchVideos: () =>
    fetch("api/videos?" + new Date().getTime(), {
      headers: { pragma: "no-cache", "cache-control": "no-cache" },
    })
      .then((response) => response.json())
      .then((videos) =>
        videos.reduce((acc, { camera: cam, time: timeStr, file, is_synced, is_deleted }, idx) => {
          if (cam && timeStr && file) {
            const time = new Date(timeStr);
            const day = new Date(timeStr).setHours(0, 0, 0, 0);
            const hr = time.getHours();

            !acc.has(day) && acc.set(day, new Map());
            !acc.get(day).has(cam) && acc.get(day).set(cam, new Map());
            !acc.get(day).get(cam).has(hr) && acc.get(day).get(cam).set(hr, []);

            acc.get(day).get(cam).get(hr).push({ cam, time, file, is_deleted, is_synced });
          }
          return acc;
        }, new Map())
      ).then(videos => new Map(
        [...videos.entries()]
          .map(
            ([day, cams]) => [day, new Map(
              [...cams.entries()]
                .map(
                  ([cam, hours]) => [cam, new Map(
                    [...hours.entries()]
                      .map(([hour, val]) =>
                        [hour, val.sort((a, b) => a.time - b.time)])
                      .sort((a, b) => parseInt(a, 10) - parseInt(b, 10)) // since hours could be single digits
                  )])
                .sort() // sort key is camera
            )])
          .sort((a, b) => a - b) // sort key is day
      ))
};