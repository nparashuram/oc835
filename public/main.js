const getCameras = async () => {
  const cameras = JSON.parse(window.localStorage.getItem("cameras"));
  if (cameras === null) {
    const response = await fetch("/api/cameras");
    const data = await response.json();
    window.localStorage.setItem("camera", JSON.stringify(data));
    return data;
  } else {
    return cameras;
  }
};

(function (window) {
  getCameras().then((cameras) => {
    document.getElementsByClassName("root")[0].innerHTML = cameras
      .map(
        (x) => `
      <div class="card">
        <a href="http://${x.ip}/img/video.mjpeg">
            <img src="http://${x.ip}/img/video.mjpeg" />
        </a>
      </div>`
      )
      .join("\n");
  });
})(window);
