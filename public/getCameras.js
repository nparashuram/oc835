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
