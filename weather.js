/* ==========================================
   WEATHER API KEY
========================================== */


const API_KEY = "bcd9c55b438b4101bcb164652261906";

/* ==========================================
   ELEMENTS
========================================== */

const searchBtn =
document.getElementById("searchBtn");

const cityInput =
document.getElementById("cityInput");

const cityName =
document.getElementById("cityName");

const weatherIcon =
document.getElementById("weatherIcon");

const temperature =
document.getElementById("temperature");

const condition =
document.getElementById("condition");

const humidity =
document.getElementById("humidity");

const wind =
document.getElementById("wind");

const pressure =
document.getElementById("pressure");

const visibility =
document.getElementById("visibility");

const forecastContainer =
document.getElementById("forecastContainer");

const sunrise =
document.getElementById("sunrise");

const sunset =
document.getElementById("sunset");

const aqiValue =
document.getElementById("aqiValue");

const pm25 =
document.getElementById("pm25");

const pm10 =
document.getElementById("pm10");

/* ==========================================
   LOAD WEATHER
========================================== */

async function getWeather(city = "Chennai") {

try {

const response = await fetch(

`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=yes&alerts=yes`

);

const data = await response.json();

console.log(data);

if(data.error){

alert(data.error.message);
return;

}

updateCurrentWeather(data);

updateForecast(data);

updateAirQuality(data);

}
catch(error){

console.error(error);

alert("Unable To Load Weather");

}

}

/* ==========================================
   CURRENT WEATHER
========================================== */

function updateCurrentWeather(data){

cityName.innerText =
data.location.name + ", " +
data.location.country;

weatherIcon.src =
"https:" +
data.current.condition.icon;

temperature.innerText =
data.current.temp_c + "°C";

condition.innerText =
data.current.condition.text;

humidity.innerText =
data.current.humidity + "%";

wind.innerText =
data.current.wind_kph + " km/h";

pressure.innerText =
data.current.pressure_mb + " mb";

visibility.innerText =
data.current.vis_km + " km";

sunrise.innerText =
data.forecast.forecastday[0].astro.sunrise;

sunset.innerText =
data.forecast.forecastday[0].astro.sunset;

}

/* ==========================================
   FORECAST
========================================== */

function updateForecast(data){

forecastContainer.innerHTML = "";

data.forecast.forecastday.forEach(day=>{

const card =
document.createElement("div");

card.className =
"forecast-card";

card.innerHTML =

`
<h3>
${day.date}
</h3>

<img
src="https:${day.day.condition.icon}">

<p>
${day.day.condition.text}
</p>

<h4>
${day.day.avgtemp_c}°C
</h4>
`;

forecastContainer.appendChild(card);

});

}

/* ==========================================
   AIR QUALITY
========================================== */

function updateAirQuality(data){

if(!data.current.air_quality)
return;

aqiValue.innerText =
Math.round(
data.current.air_quality["us-epa-index"]
);

pm25.innerText =
Math.round(
data.current.air_quality.pm2_5
);

pm10.innerText =
Math.round(
data.current.air_quality.pm10
);

}

/* ==========================================
   SEARCH
========================================== */

searchBtn.addEventListener(
"click",
()=>{

const city =
cityInput.value.trim();

if(city !== ""){

getWeather(city);

}

});

cityInput.addEventListener(
"keypress",
(event)=>{

if(event.key === "Enter"){

const city =
cityInput.value.trim();

if(city !== ""){

getWeather(city);

}

}

});

/* ==========================================
   BACK TO TOP
========================================== */

const backToTop =
document.getElementById(
"backToTop"
);

window.addEventListener(
"scroll",
()=>{

if(window.scrollY > 400){

backToTop.style.display =
"block";

}else{

backToTop.style.display =
"none";

}

});

backToTop.addEventListener(
"click",
()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

});

/* ==========================================
   AUTO LOAD
========================================== */

getWeather("Chennai");

/* ==========================================
   AUTO REFRESH
========================================== */

setInterval(()=>{

const currentCity =
cityInput.value.trim() ||
"Chennai";

getWeather(currentCity);

},300000);