/* ==========================================
   INFO ALL TRAVEL
   PREMIUM TRAVEL.JS
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeLoader();
    initializeDarkMode();
    initializeTransportTabs();
    initializeSearch();
    initializeWeather();
    initializeAIPlanner();
    initializeNewsletter();
    initializeBackToTop();
    initializePopularRoutes();
    loadRecentSearches();

});

/* ==========================================
   LOADER
========================================== */

function initializeLoader() {

    const loader =
    document.getElementById("loader");

    setTimeout(() => {

        if(loader){

            loader.style.display = "none";

        }

    }, 1500);

}

/* ==========================================
   DARK MODE
========================================== */

function initializeDarkMode() {

    const darkBtn =
    document.getElementById("darkModeBtn");

    if(!darkBtn) return;

    darkBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        localStorage.setItem(
            "theme",
            document.body.classList.contains("dark")
            ? "dark"
            : "light"
        );

    });

    if(localStorage.getItem("theme") === "dark"){

        document.body.classList.add("dark");

    }

}

/* ==========================================
   TRANSPORT TAB
========================================== */

function initializeTransportTabs() {

    const tabs =
    document.querySelectorAll(".transport-tab");

    tabs.forEach(tab => {

        tab.addEventListener("click", () => {

            tabs.forEach(t =>
                t.classList.remove("active")
            );

            tab.classList.add("active");

        });

    });

}

/* ==========================================
   SEARCH ROUTE
========================================== */

function initializeSearch() {

    const searchBtn =
    document.getElementById("searchBtn");

    if(!searchBtn) return;

    searchBtn.addEventListener(
        "click",
        searchRoute
    );

}

function searchRoute() {

    const from =
    document.getElementById("fromCity").value.trim();

    const to =
    document.getElementById("toCity").value.trim();

    const transport =
    document.getElementById("transportType").value;

    if(!from || !to){

        alert(
        "Please enter From and To city"
        );

        return;

    }

    saveRecentSearch(from,to);

    updateMap(from,to);

    generateRouteCard(
        from,
        to,
        transport
    );

}

/* ==========================================
   ROUTE CARD
========================================== */

function generateRouteCard(

    from,
    to,
    transport

){

    const resultBox =
    document.getElementById(
    "liveTransportResults"
    );

    const distance =
    Math.floor(
    Math.random()*1500
    ) + 100;

    const time =
    Math.floor(
    distance / 60
    );

    const price =
    Math.floor(
    distance * 2.5
    );

    resultBox.innerHTML =

    `
    <div class="transport-result-card">

        <h2>

        ${from} → ${to}

        </h2>

        <br>

        <p>
        🚗 Distance:
        ${distance} KM
        </p>

        <p>
        ⏱ Travel Time:
        ${time} Hours
        </p>

        <p>
        💰 Estimated Cost:
        ₹${price}
        </p>

        <p>
        🚍 Mode:
        ${transport}
        </p>

    </div>
    `;

}
/* ==========================================
   WEATHER SYSTEM
========================================== */

function initializeWeather(){

    const weatherBtn =
    document.getElementById(
    "weatherBtn"
    );

    if(!weatherBtn) return;

    weatherBtn.addEventListener(
    "click",
    getWeather
    );

}

async function getWeather(){

    const city =
    document.getElementById(
    "weatherCity"
    ).value.trim();

    if(!city){

        alert(
        "Enter city name"
        );

        return;

    }

    const result =
    document.getElementById(
    "weatherResult"
    );

    result.innerHTML =
    "Loading Weather...";

    try{

        const response =
        await fetch(

        `https://wttr.in/${city}?format=j1`

        );

        const data =
        await response.json();

        const weather =
        data.current_condition[0];

        result.innerHTML =

        `
        <h3>${city}</h3>

        <p>
        🌡 Temperature:
        ${weather.temp_C}°C
        </p>

        <p>
        ☁ Condition:
        ${weather.weatherDesc[0].value}
        </p>

        <p>
        💧 Humidity:
        ${weather.humidity}%
        </p>

        <p>
        🌬 Wind:
        ${weather.windspeedKmph}
        km/h
        </p>
        `;

    }

    catch(error){

        result.innerHTML =
        "Unable to load weather";

    }

}

/* ==========================================
   GOOGLE MAP UPDATE
========================================== */

function updateMap(

from,
to

){

    const map =
    document.getElementById(
    "routeMap"
    );

    if(!map) return;

    map.src =

    `https://www.google.com/maps?q=${from} to ${to}&output=embed`;

}

/* ==========================================
   POPULAR ROUTES
========================================== */

function initializePopularRoutes(){

    const routes =

    document.querySelectorAll(
    ".route-chip"
    );

    routes.forEach(route=>{

        route.addEventListener(
        "click",
        ()=>{

            const text =
            route.innerText;

            const cities =
            text.split("→");

            if(cities.length < 2)
            return;

            document.getElementById(
            "fromCity"
            ).value =
            cities[0].trim();

            document.getElementById(
            "toCity"
            ).value =
            cities[1].trim();

            searchRoute();

        });

    });

}

/* ==========================================
   RECENT SEARCH STORAGE
========================================== */

function saveRecentSearch(

from,
to

){

    let searches =

    JSON.parse(

    localStorage.getItem(
    "travelSearches"
    )

    ) || [];

    searches.unshift({

        from,
        to

    });

    searches = searches.slice(
    0,
    10
    );

    localStorage.setItem(

    "travelSearches",

    JSON.stringify(searches)

    );

    loadRecentSearches();

}

function loadRecentSearches(){

    const container =

    document.getElementById(
    "recentSearches"
    );

    if(!container) return;

    const searches =

    JSON.parse(

    localStorage.getItem(
    "travelSearches"
    )

    ) || [];

    container.innerHTML = "";

    searches.forEach(item=>{

        container.innerHTML +=

        `
        <div class="search-history-card">

        ${item.from}
        →
        ${item.to}

        </div>
        `;

    });

}

/* ==========================================
   CLICK RECENT SEARCH
========================================== */

document.addEventListener(

"click",

(event)=>{

if(

event.target.classList.contains(
"search-history-card"
)

){

const route =
event.target.innerText;

const cities =
route.split("→");

if(cities.length < 2)
return;

document.getElementById(
"fromCity"
).value =
cities[0].trim();

document.getElementById(
"toCity"
).value =
cities[1].trim();

searchRoute();

}

}

);
/* ==========================================
   AI TRAVEL ASSISTANT
========================================== */

function initializeAIPlanner(){

    const aiBtn =
    document.getElementById(
    "aiTravelBtn"
    );

    if(!aiBtn) return;

    aiBtn.addEventListener(
    "click",
    generateAITravelPlan
    );

}

function generateAITravelPlan(){

    const prompt =
    document.getElementById(
    "travelPrompt"
    ).value.trim();

    const result =
    document.getElementById(
    "aiResult"
    );

    if(!prompt){

        result.innerHTML =
        "Please enter your travel request.";

        return;

    }

    result.innerHTML =

    `
    <h3>
    🤖 AI Travel Recommendation
    </h3>

    <br>

    <p>

    Based on your request:

    <b>${prompt}</b>

    </p>

    <br>

    <ul>

    <li>
    Compare Flight, Train and Bus prices.
    </li>

    <li>
    Travel during early morning for less traffic.
    </li>

    <li>
    Check weather before departure.
    </li>

    <li>
    Keep digital copies of tickets.
    </li>

    <li>
    Book accommodation near stations or airports.
    </li>

    </ul>

    `;

}

/* ==========================================
   NEWSLETTER SYSTEM
========================================== */

function initializeNewsletter(){

    const btn =
    document.getElementById(
    "newsletterBtn"
    );

    if(!btn) return;

    btn.addEventListener(
    "click",
    subscribeNewsletter
    );

}

function subscribeNewsletter(){

    const email =
    document.getElementById(
    "newsletterEmail"
    ).value.trim();

    if(!email){

        showNotification(
        "Please enter email address"
        );

        return;

    }

    showNotification(
    "Successfully Subscribed!"
    );

    document.getElementById(
    "newsletterEmail"
    ).value = "";

}

/* ==========================================
   BACK TO TOP BUTTON
========================================== */

function initializeBackToTop(){

    const button =
    document.getElementById(
    "backToTop"
    );

    if(!button) return;

    window.addEventListener(
    "scroll",
    ()=>{

        if(window.scrollY > 400){

            button.style.display =
            "block";

        }

        else{

            button.style.display =
            "none";

        }

    });

    button.addEventListener(
    "click",
    ()=>{

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    });

}

/* ==========================================
   NOTIFICATION SYSTEM
========================================== */

function showNotification(text){

    const notification =

    document.createElement(
    "div"
    );

    notification.innerText =
    text;

    notification.style.position =
    "fixed";

    notification.style.top =
    "20px";

    notification.style.right =
    "20px";

    notification.style.padding =
    "15px 25px";

    notification.style.background =
    "#2563eb";

    notification.style.color =
    "white";

    notification.style.borderRadius =
    "12px";

    notification.style.zIndex =
    "99999";

    document.body.appendChild(
    notification
    );

    setTimeout(()=>{

        notification.remove();

    },3000);

}

/* ==========================================
   LIVE TRANSPORT COUNTERS
========================================== */

function animateCounter(

id,
target

){

    const element =
    document.getElementById(id);

    if(!element) return;

    let count = 0;

    const speed =

    target / 100;

    const interval =

    setInterval(()=>{

        count += speed;

        if(count >= target){

            count = target;

            clearInterval(
            interval
            );

        }

        element.innerText =

        Math.floor(count)
        .toLocaleString()
        + "+";

    },20);

}

animateCounter(
"trainRoutes",
15000
);

animateCounter(
"flightRoutes",
2500
);

animateCounter(
"busRoutes",
50000
);

animateCounter(
"citiesCovered",
500
);

/* ==========================================
   USER PROFILE SYSTEM
========================================== */

const userName =
localStorage.getItem(
"userName"
);

if(userName){

const profile =
document.getElementById(
"userName"
);

if(profile){

profile.innerText =
userName;

}

}

/* ==========================================
   PAGE VISITS ANALYTICS
========================================== */

let visits =

localStorage.getItem(
"travelVisits"
);

if(!visits){

visits = 0;

}

visits++;

localStorage.setItem(
"travelVisits",
visits
);

console.log(
"Travel Page Visits:",
visits
);

/* ==========================================
   PREMIUM PAGE READY
========================================== */

console.log(
"✈ Premium Travel Portal Ready"
);