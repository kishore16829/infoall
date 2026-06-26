/* ==========================================
   PLACE DETAILS PREMIUM JS
========================================== */

/* ==========================================
   GET PLACE NAME FROM URL
========================================== */

const params = new URLSearchParams(
window.location.search
);

const placeName =
params.get("name");

/* ==========================================
   WEATHER API KEY
========================================== */

const WEATHER_API_KEY =
"YOUR_WEATHER_API_KEY";

/* ==========================================
   LOAD PLACE DATA
========================================== */

async function loadPlaceDetails(){

try{

const response =
await fetch("place.json");

const places =
await response.json();

const place =
places.find(item =>
item.name.toLowerCase() ===
placeName.toLowerCase()
);

if(!place){

document.body.innerHTML =
"<h1>Place Not Found</h1>";

return;
}

/* ==========================================
   HERO SECTION
========================================== */

document.getElementById(
"placeName"
).textContent =
place.name;

document.getElementById(
"placeImage"
).src =
place.image;

document.getElementById(
"placeState"
).textContent =
place.state;

document.getElementById(
"placeCategory"
).textContent =
place.category;

document.getElementById(
"placeRating"
).textContent =
place.rating;

/* ==========================================
   ABOUT SECTION
========================================== */

document.getElementById(
"placeDescription"
).textContent =
place.description;

document.getElementById(
"infoState"
).textContent =
place.state;

document.getElementById(
"infoBestTime"
).textContent =
place.bestTime;

document.getElementById(
"infoRating"
).textContent =
place.rating;

document.getElementById(
"infoCategory"
).textContent =
place.category;

/* ==========================================
   QUICK STATS
========================================== */

document.getElementById(
"sideState"
).textContent =
place.state;

document.getElementById(
"sideCategory"
).textContent =
place.category;

document.getElementById(
"sideRating"
).textContent =
"⭐ " + place.rating;

document.getElementById(
"sideBestTime"
).textContent =
place.bestTime;

/* ==========================================
   HIGHLIGHTS
========================================== */

const highlights =
document.getElementById(
"placeHighlights"
);

highlights.innerHTML =

`
<li>Beautiful sightseeing locations</li>
<li>Perfect for family trips</li>
<li>Popular tourist destination</li>
<li>Excellent photography spots</li>
<li>Local food and culture</li>
`;

/* ==========================================
   GALLERY
========================================== */

document.getElementById(
"gallery1"
).src = place.image;

document.getElementById(
"gallery2"
).src = place.image;

document.getElementById(
"gallery3"
).src = place.image;

document.getElementById(
"gallery4"
).src = place.image;

/* ==========================================
   GOOGLE MAP
========================================== */

document.getElementById(
"googleMap"
).src =

`https://maps.google.com/maps?q=
${encodeURIComponent(place.name)}
&t=&z=13&ie=UTF8&iwloc=&output=embed`;

/* ==========================================
   LOAD WEATHER
========================================== */

loadWeather(place.name);

/* ==========================================
   LOAD HOTELS
========================================== */

loadHotels(place);

}
catch(error){

console.error(error);

}

}
/* ==========================================
   WEATHER API
========================================== */

async function loadWeather(city){

try{

const response =
await fetch(

`https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}&aqi=yes`

);

const data =
await response.json();

if(data.error){

console.log(data.error.message);

return;
}

document.getElementById(
"weatherTemp"
).textContent =

data.current.temp_c + "°C";

document.getElementById(
"weatherCondition"
).textContent =

data.current.condition.text;

document.getElementById(
"weatherIcon"
).src =

"https:" +
data.current.condition.icon;

}
catch(error){

console.error(
"Weather Error",
error
);

}

}

/* ==========================================
   HOTEL CARDS
========================================== */

function loadHotels(place){

const hotelGrid =
document.getElementById(
"hotelGrid"
);

hotelGrid.innerHTML =

`
<div class="hotel-card">

<img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200">

<div class="hotel-content">

<h3>Luxury Grand Hotel</h3>

<p>
Near ${place.name}
</p>

<div class="hotel-price">

₹6,500 / night

</div>

</div>

</div>

<div class="hotel-card">

<img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200">

<div class="hotel-content">

<h3>Comfort Stay</h3>

<p>
Best family hotel
</p>

<div class="hotel-price">

₹3,200 / night

</div>

</div>

</div>

<div class="hotel-card">

<img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200">

<div class="hotel-content">

<h3>Budget Inn</h3>

<p>
Affordable stay
</p>

<div class="hotel-price">

₹1,800 / night

</div>

</div>

</div>
`;

}

/* ==========================================
   SHARE BUTTON
========================================== */

const shareBtn =
document.getElementById(
"shareBtn"
);

if(shareBtn){

shareBtn.addEventListener(
"click",

async()=>{

try{

await navigator.share({

title:
document.title,

text:
"Check out this destination!",

url:
window.location.href

});

}
catch(error){

navigator.clipboard.writeText(
window.location.href
);

alert(
"Link copied!"
);

}

});

}

/* ==========================================
   OPEN MAP BUTTON
========================================== */

const openMapBtn =
document.getElementById(
"openMapBtn"
);

if(openMapBtn){

openMapBtn.addEventListener(
"click",

()=>{

const destination =
document.getElementById(
"placeName"
).textContent;

window.open(

`https://www.google.com/maps/search/${destination}`,

"_blank"

);

});

}

/* ==========================================
   SIMILAR DESTINATIONS
========================================== */

async function loadSimilarPlaces(){

try{

const response =
await fetch(
"place.json"
);

const places =
await response.json();

const similarGrid =
document.getElementById(
"similarPlaces"
);

similarGrid.innerHTML = "";

places
.slice(0,6)
.forEach(place=>{

const card =
document.createElement(
"div"
);

card.className =
"similar-card";

card.innerHTML =

`
<img src="${place.image}">

<div class="similar-content">

<h3>

${place.name}

</h3>

<p>

${place.state}

</p>

<a href=
"place-details.html?name=${encodeURIComponent(place.name)}">

View Details

</a>

</div>
`;

similarGrid.appendChild(
card
);

});

}
catch(error){

console.error(error);

}

}
/* ==========================================
   AUTO IMAGE SLIDER
========================================== */

let currentImage = 0;

function startSlider(){

const images = [

document.getElementById("gallery1")?.src,

document.getElementById("gallery2")?.src,

document.getElementById("gallery3")?.src,

document.getElementById("gallery4")?.src

];

setInterval(()=>{

const heroImage =
document.getElementById(
"placeImage"
);

if(!heroImage) return;

currentImage++;

if(currentImage >= images.length){

currentImage = 0;

}

heroImage.src =
images[currentImage];

},4000);

}

/* ==========================================
   SCROLL ANIMATIONS
========================================== */

const observer =
new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.style.opacity =
"1";

entry.target.style.transform =
"translateY(0)";

}

});

},

{
threshold:0.15
}

);

function animateElements(){

document
.querySelectorAll(

".stat-card,.hotel-card,.restaurant-card,.budget-card,.similar-card,.attraction-card"

)

.forEach(item=>{

item.style.opacity = "0";

item.style.transform =
"translateY(40px)";

item.style.transition =
".7s ease";

observer.observe(item);

});

}

/* ==========================================
   FAVORITES
========================================== */

function saveFavorite(){

const destination =

document.getElementById(
"placeName"
).textContent;

let favorites =

JSON.parse(
localStorage.getItem(
"favorites"
)
) || [];

if(!favorites.includes(destination)){

favorites.push(
destination
);

localStorage.setItem(

"favorites",

JSON.stringify(
favorites
)

);

alert(
"❤️ Added to Favorites"
);

}else{

alert(
"Already in Favorites"
);

}

}

/* ==========================================
   FLOATING BUTTONS
========================================== */

function createFloatingButtons(){

const container =
document.createElement(
"div"
);

container.className =
"floating-buttons";

container.innerHTML =

`

<button
class="float-btn"
id="favoriteBtn">

❤️

</button>

<button
class="float-btn"
id="scrollTopBtn">

⬆️

</button>

`;

document.body.appendChild(
container
);

document
.getElementById(
"favoriteBtn"
)
.addEventListener(
"click",
saveFavorite
);

document
.getElementById(
"scrollTopBtn"
)
.addEventListener(
"click",

()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

});

}

/* ==========================================
   TRAVEL BUDGET CALCULATOR
========================================== */

function calculateBudget(){

const budgetCards =

document.querySelectorAll(
".budget-card"
);

budgetCards.forEach(card=>{

card.addEventListener(
"click",

()=>{

alert(

"Estimated trip cost depends on travel dates, hotel type and transport."

);

});

});

}

/* ==========================================
   DARK MODE
========================================== */

function createThemeToggle(){

const button =
document.createElement(
"button"
);

button.innerHTML = "🌙";

button.style.position =
"fixed";

button.style.left =
"20px";

button.style.bottom =
"20px";

button.style.width =
"60px";

button.style.height =
"60px";

button.style.border =
"none";

button.style.borderRadius =
"50%";

button.style.cursor =
"pointer";

button.style.zIndex =
"999";

document.body.appendChild(
button
);

button.addEventListener(
"click",

()=>{

document.body.classList.toggle(
"dark-mode"
);

});

}

/* ==========================================
   LOADING SCREEN
========================================== */

window.addEventListener(
"load",

()=>{

const loader =
document.createElement(
"div"
);

loader.id =
"loader";

loader.innerHTML =

`

<div
style="
font-size:28px;
font-weight:700;
">

Loading Destination...

</div>

`;

loader.style.position =
"fixed";

loader.style.inset =
"0";

loader.style.background =
"white";

loader.style.display =
"flex";

loader.style.alignItems =
"center";

loader.style.justifyContent =
"center";

loader.style.zIndex =
"99999";

document.body.appendChild(
loader
);

setTimeout(()=>{

loader.remove();

},1500);

});

/* ==========================================
   INITIALIZE
========================================== */

loadPlaceDetails();

loadSimilarPlaces();

setTimeout(()=>{

startSlider();

animateElements();

calculateBudget();

createFloatingButtons();

createThemeToggle();

},1000);
const slides =
document.querySelectorAll(".slide");

let currentSlide = 0;

function showSlide(index){

slides.forEach(slide=>{

slide.classList.remove("active");

});

slides[index].classList.add(
"active"
);

}

document.querySelector(".next")
.addEventListener("click",()=>{

currentSlide++;

if(currentSlide >= slides.length){

currentSlide = 0;

}

showSlide(currentSlide);

});

document.querySelector(".prev")
.addEventListener("click",()=>{

currentSlide--;

if(currentSlide < 0){

currentSlide =
slides.length - 1;

}

showSlide(currentSlide);

});

setInterval(()=>{

currentSlide++;

if(currentSlide >= slides.length){

currentSlide = 0;

}

showSlide(currentSlide);

},5000);
const galleryImages = [

"https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200",

"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200",

"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200",

"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200"

];

document.getElementById("gallery1").src = galleryImages[0];
document.getElementById("gallery2").src = galleryImages[1];
document.getElementById("gallery3").src = galleryImages[2];
document.getElementById("gallery4").src = galleryImages[3];