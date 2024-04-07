let lat = null;
let long = null;

function todaydate() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let today = new Date();
  const day = days[today.getDay()];
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = months[today.getMonth()];
  const yyyy = today.getFullYear();

  return `${day} | ${dd} ${mm}, ${yyyy}`;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(updatePosition);
  }
}

async function updatePosition(pos) {
  if (pos) {
    lat = pos.coords.latitude;
    long = pos.coords.longitude;
  }
  setWeatherFromMyLocation();
}

async function setWeatherFromMyLocation() {
  let currentLocation = `lat=${lat}&lon=${long}`;
  let val = await fetch(`https://backend-wthr.vercel.app/${currentLocation}`);
  let data = await val.json();
  updateweather(data);
}

async function setWeatherFromCity() {
  let city = `q=${document.querySelector("#search-bar").value.toLowerCase()}`;
  let val = await fetch(`https://backend-wthr.vercel.app/${city}`);
  let data = await val.json();
  updateweather(data);
}

function time(timedata) {
  const utcTimestamp = timedata;
  const utcDate = new Date(utcTimestamp * 1000);
  const indianDate = utcDate.toLocaleString("en-IN");
  const time = indianDate.split(",")[1].trim();

  return time;
}

function setHeadline(city) {
  const headlines = [
    `Weather predicted in ${city}:Says Report`,
    `${city} prepares for Predicted Weather Shifts`,
    `${city}'s Forecast: Daily Weather Update`,
    `Experts anticipate varied weather for ${city}`,
    `${city}'s Weather Trends: Experts weigh in`,
  ];
  let hline = headlines[Math.floor(Math.random() * 5)];
  return hline;
}

function updateweather(data) {
  if (data?.cod == "404") {
    document.querySelector("#data").style.visibility = "visible";
    document.querySelector("#headline").innerHTML = "No City Found";
  } else {
    document.querySelector("#data").style.visibility = "visible";
    document.querySelector("#headline").innerHTML = setHeadline(data?.name);
    document.querySelector("#cityname2").innerHTML = `${data?.name}`; //city name
    document.querySelector("#main").innerHTML = `${data?.weather?.[0]?.main}`;
    document.querySelector(
      "#main-img"
    ).src = `https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    document.querySelector("#main-temp").innerHTML = `${(
      data?.main?.temp - 273
    ).toFixed(1)}&deg;`;
    document.querySelector(
      "#windspeed"
    ).innerHTML = `${data?.wind?.speed}&nbsp;m&#47;s`;
    document.querySelector(
      "#windspeed2"
    ).innerHTML = `${data?.wind?.speed}&nbsp;m&#47;s`;
    document.querySelector(
      "#humidity"
    ).innerHTML = `${data?.main?.humidity}&nbsp;&percnt;`;
    document.querySelector(
      "#clouds"
    ).innerHTML = `${data?.clouds?.all}&nbsp;&percnt;`;
    document.querySelector("#mintemp").innerHTML = `${(
      data?.main.temp_min - 273
    ).toFixed(0)}`;
    document.querySelector("#maxtemp").innerHTML = `${(
      data?.main.temp_max - 273
    ).toFixed(0)}`;
    document.querySelector(
      "#description"
    ).innerHTML = `${data?.weather?.[0]?.description}`;
    document.querySelector(
      "#description2"
    ).innerHTML = `${data?.weather?.[0]?.description}`;
    document.querySelector("#feelslike").innerHTML = `${(
      data?.main?.feels_like - 273
    ).toFixed(0)}&deg;C`;
    document.querySelector("#pressure").innerHTML = `${data?.main?.pressure}`;
    document.querySelector("#ground").innerHTML = `${data?.main?.grnd_level}`;
    document.querySelector("#winddegree").innerHTML = `${data?.wind?.deg}`;
    document.querySelector("#sunrise").innerHTML = `${time(
      data?.sys["sunrise"]
    )}`;
    document.querySelector("#sunset").innerHTML = `${time(
      data?.sys["sunset"]
    )}`;
  }
}

document.querySelector("#today").innerHTML = `${todaydate()}`;
document
  .querySelector("#currentlocation")
  .addEventListener("click", getLocation);
document
  .querySelector("#search-icon")
  .addEventListener("click", setWeatherFromCity);
document
  .querySelector("#search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      setWeatherFromCity();
    }
  });
