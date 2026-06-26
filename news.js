/* ==========================================
   API KEYS
========================================== */

const NEWS_API_KEY =
"6cb6a72531c4911ef09efea18df8763d";

const WEATHER_API_KEY =
"bcd9c55b438b4101bcb164652261906";

/* ==========================================
   DOM ELEMENTS
========================================== */

const newsGrid =
document.getElementById(
"newsGrid"
);

const searchBtn =
document.getElementById(
"searchBtn"
);

const searchInput =
document.getElementById(
"searchNews"
);

const categoryButtons =
document.querySelectorAll(
".category-section button"
);

/* ==========================================
   LOAD REAL NEWS
========================================== */

async function loadNews(
query = "travel"
){

try{

newsGrid.innerHTML =

`
<div style="
text-align:center;
padding:50px;
font-size:22px;">
Loading Latest News...
</div>
`;

const response =
await fetch(

`https://gnews.io/api/v4/search?q=${query}&lang=en&max=20&apikey=${NEWS_API_KEY}`

);

const data =
await response.json();

if(
!data.articles ||
data.articles.length === 0
){

newsGrid.innerHTML =

`
<h2 style="
text-align:center;">
No News Found
</h2>
`;

return;

}

displayNews(
data.articles
);

}

catch(error){

console.error(error);

newsGrid.innerHTML =

`
<h2 style="
text-align:center;
color:red;">
Unable To Load News
</h2>
`;

}

}

/* ==========================================
   DISPLAY NEWS
========================================== */

function displayNews(
articles
){

newsGrid.innerHTML = "";

articles.forEach(
article=>{

const card =
document.createElement(
"div"
);

card.className =
"news-card";

card.innerHTML =

`

<img
src="${
article.image ||
'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000'
}"
alt="news">

<div class="news-content">

<span class="category">

Travel News

</span>

<h3>

${article.title}

</h3>

<p>

${
article.description ||
"Click below to read more."
}

</p>

<div class="news-footer">

<span>

📅
${new Date(
article.publishedAt
).toLocaleDateString()}

</span>

<a
href="${article.url}"
target="_blank">

<button>

Read More

</button>

</a>

</div>

</div>

`;

newsGrid.appendChild(
card
);

});

}
/* ==========================================
   SEARCH NEWS
========================================== */

searchBtn.addEventListener(
"click",
()=>{

const query =
searchInput.value.trim();

if(query === "")
return;

loadNews(
query
);

});

searchInput.addEventListener(
"keypress",
(event)=>{

if(
event.key ===
"Enter"
){

const query =
searchInput.value.trim();

if(query !== ""){

loadNews(
query
);

}

}

});

/* ==========================================
   CATEGORY FILTERS
========================================== */

categoryButtons.forEach(
button=>{

button.addEventListener(
"click",

()=>{

categoryButtons.forEach(
btn=>btn.classList.remove(
"active"
)
);

button.classList.add(
"active"
);

const category =
button.innerText;

switch(category){

case "All":

loadNews(
"travel"
);

break;

case "Destinations":

loadNews(
"tourism"
);

break;

case "Hotels":

loadNews(
"hotels"
);

break;

case "Flights":

loadNews(
"airlines"
);

break;

case "Railways":

loadNews(
"railway"
);

break;

case "Travel Tips":

loadNews(
"travel tips"
);

break;

default:

loadNews(
"travel"
);

}

});

});

/* ==========================================
   WEATHER
========================================== */

const weatherBtn =
document.getElementById(
"weatherBtn"
);

const cityInput =
document.getElementById(
"cityInput"
);

const weatherResult =
document.getElementById(
"weatherResult"
);

async function getWeather() {

    const city = cityInput.value.trim();

    if (city === "") return;

    try {

        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}&aqi=no`
        );

        const data = await response.json();

        console.log(data);

        if (data.error) {
            weatherResult.innerHTML =
            `<p>${data.error.message}</p>`;
            return;
        }

        weatherResult.innerHTML = `

        <h3>📍 ${data.location.name}</h3>

        <p>🌡️ Temperature: ${data.current.temp_c}°C</p>

        <p>☁️ Condition: ${data.current.condition.text}</p>

        <p>💧 Humidity: ${data.current.humidity}%</p>

        <p>🌬️ Wind: ${data.current.wind_kph} km/h</p>

        <img src="https:${data.current.condition.icon}">

        `;

    } catch (error) {

        console.error(error);

        weatherResult.innerHTML =
        "<p>Unable to load weather</p>";
    }
}

if(weatherBtn){

weatherBtn.addEventListener(
"click",
getWeather
);

}

/* ==========================================
   NEWSLETTER
========================================== */

const subscribeBtn =
document.getElementById(
"subscribeBtn"
);

if(subscribeBtn){

subscribeBtn.addEventListener(
"click",

()=>{

const email =
document.getElementById(
"newsletterEmail"
).value;

if(email === ""){

alert(
"Please enter your email"
);

return;
}

alert(
"✅ Successfully subscribed!"
);

document.getElementById(
"newsletterEmail"
).value = "";

});

}
/* ==========================================
   BACK TO TOP BUTTON
========================================== */

const backToTop =
document.getElementById(
"backToTop"
);

window.addEventListener(
"scroll",
()=>{

if(
window.scrollY > 500
){

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
   LIVE CLOCK
========================================== */

const liveClock =
document.createElement(
"div"
);

liveClock.id =
"liveClock";

liveClock.style.position =
"fixed";

liveClock.style.top =
"100px";

liveClock.style.right =
"20px";

liveClock.style.background =
"#2563eb";

liveClock.style.color =
"white";

liveClock.style.padding =
"12px 20px";

liveClock.style.borderRadius =
"30px";

liveClock.style.zIndex =
"999";

liveClock.style.fontWeight =
"600";

liveClock.style.boxShadow =
"0 10px 25px rgba(0,0,0,.15)";

document.body.appendChild(
liveClock
);

function updateClock(){

const now =
new Date();

liveClock.innerHTML =

`🕒 ${now.toLocaleTimeString()}`;

}

setInterval(
updateClock,
1000
);

updateClock();

/* ==========================================
   AUTO REFRESH NEWS
========================================== */

setInterval(()=>{

console.log(
"Refreshing News..."
);

loadNews();

},300000);

/* ==========================================
   BREAKING TRAVEL ALERT
========================================== */

setTimeout(()=>{

const popup =
document.createElement(
"div"
);

popup.className =
"travel-popup";

popup.innerHTML =

`

<div class="popup-box">

<h3>

✈️ Travel Alert

</h3>

<p>

Check destination weather
and local travel advisories
before your trip.

</p>

<button id="closePopup">

Close

</button>

</div>

`;

document.body.appendChild(
popup
);

document
.getElementById(
"closePopup"
)
.addEventListener(
"click",
()=>{

popup.remove();

});

},5000);

/* ==========================================
   PAGE FADE-IN EFFECT
========================================== */

window.addEventListener(
"load",
()=>{

document.body.style.opacity =
"0";

document.body.style.transition =
"opacity .8s";

setTimeout(()=>{

document.body.style.opacity =
"1";

},100);

});

/* ==========================================
   CARD ANIMATION
========================================== */

const observer =
new IntersectionObserver(

(entries)=>{

entries.forEach(
entry=>{

if(
entry.isIntersecting
){

entry.target.style.opacity =
"1";

entry.target.style.transform =
"translateY(0)";

}

});

},

{
threshold:0.1
}

);

function animateCards(){

document
.querySelectorAll(
".news-card"
)
.forEach(card=>{

card.style.opacity =
"0";

card.style.transform =
"translateY(30px)";

card.style.transition =
".6s";

observer.observe(card);

});

}

setTimeout(
animateCards,
2000
);

/* ==========================================
   WELCOME MESSAGE
========================================== */

console.log(
"✅ Premium Travel News Portal Loaded"
);

/* ==========================================
   INITIAL LOAD
========================================== */

loadNews();