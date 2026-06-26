/* =========================================
   DARK MODE
========================================= */

const darkModeBtn =
document.getElementById("darkModeBtn");

const savedTheme =
localStorage.getItem("theme");

if(savedTheme === "dark"){

document.body.classList.add("dark-mode");

}

darkModeBtn?.addEventListener(

"click",

()=>{

document.body.classList.toggle(
"dark-mode"
);

if(
document.body.classList.contains(
"dark-mode"
)
){

localStorage.setItem(
"theme",
"dark"
);

}else{

localStorage.setItem(
"theme",
"light"
);

}

}

);

/* =========================================
   TYPING ANIMATION
========================================= */

const words = [

"Info All",
"AI Assistant",
"Travel Guide",
"Weather Updates",
"Smart Search"

];

let wordIndex = 0;

let charIndex = 0;

let isDeleting = false;

const typingElement =
document.querySelector(
".typing-text"
);

function typeEffect(){

if(!typingElement) return;

const currentWord =
words[wordIndex];

if(!isDeleting){

typingElement.textContent =
currentWord.substring(
0,
charIndex + 1
);

charIndex++;

if(charIndex === currentWord.length){

isDeleting = true;

setTimeout(
typeEffect,
1500
);

return;

}

}else{

typingElement.textContent =
currentWord.substring(
0,
charIndex - 1
);

charIndex--;

if(charIndex === 0){

isDeleting = false;

wordIndex++;

if(wordIndex >= words.length){

wordIndex = 0;

}

}

}

setTimeout(
typeEffect,
isDeleting ? 50 : 100
);

}

typeEffect();

/* =========================================
   SEARCH HISTORY
========================================= */

const searchInput =
document.getElementById(
"searchInput"
);

const searchBtn =
document.getElementById(
"searchBtn"
);

const recentSearches =
document.getElementById(
"recentSearches"
);

function loadSearchHistory(){

if(!recentSearches) return;

const searches =

JSON.parse(

localStorage.getItem(
"searchHistory"
)

) || [];

recentSearches.innerHTML = "";

searches.forEach(search => {

const tag =
document.createElement("span");

tag.className =
"search-tag";

tag.innerText =
search;

tag.onclick = () => {

searchInput.value =
search;

};

recentSearches.appendChild(
tag
);

});

}

loadSearchHistory();

searchBtn?.addEventListener(

"click",

()=>{

const query =
searchInput.value.trim();

if(query === "") return;

let searches =

JSON.parse(

localStorage.getItem(
"searchHistory"
)

) || [];

if(!searches.includes(query)){

searches.unshift(query);

}

searches = searches.slice(0,10);

localStorage.setItem(

"searchHistory",

JSON.stringify(searches)

);

loadSearchHistory();

alert(
"Searching: " + query
);

}

);

/* =========================================
   VOICE SEARCH
========================================= */

const voiceBtn =
document.getElementById(
"voiceSearchBtn"
);

if(

'webkitSpeechRecognition'
in window

){

const recognition =

new webkitSpeechRecognition();

recognition.continuous =
false;

recognition.lang =
"en-US";

voiceBtn?.addEventListener(

"click",

()=>{

recognition.start();

}

);

recognition.onresult =
(event)=>{

const result =

event.results[0][0]
.transcript;

searchInput.value =
result;

};

}

/* =========================================
   COUNTER ANIMATION
========================================= */

const counters =
document.querySelectorAll(
".counter"
);

const counterObserver =

new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

const counter =
entry.target;

const target =

+counter.getAttribute(
"data-target"
);

let count = 0;

const updateCounter =
()=>{

const increment =
target / 100;

count += increment;

if(count < target){

counter.innerText =
Math.floor(count);

requestAnimationFrame(
updateCounter
);

}else{

counter.innerText =
target.toLocaleString();

}

};

updateCounter();

counterObserver.unobserve(
counter
);

}

});

},

{
threshold:0.5
}

);

counters.forEach(counter=>{

counterObserver.observe(
counter
);

});

/* =========================================
   BACK TO TOP
========================================= */

const backToTop =
document.getElementById(
"backToTop"
);

window.addEventListener(

"scroll",

()=>{

if(window.scrollY > 500){

backToTop.style.display =
"block";

}else{

backToTop.style.display =
"none";

}

}

);

backToTop?.addEventListener(

"click",

()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

}

);
/* =========================================
   MOBILE MENU
========================================= */

const menuBtn =
document.getElementById(
"menuBtn"
);

const navLinks =
document.querySelector(
".nav-links"
);

menuBtn?.addEventListener(

"click",

()=>{

if(
navLinks.style.display ===
"flex"
){

navLinks.style.display =
"none";

}else{

navLinks.style.display =
"flex";

navLinks.style.flexDirection =
"column";

}

}

);

/* =========================================
   FAQ ACCORDION
========================================= */

const faqQuestions =

document.querySelectorAll(
".faq-question"
);

faqQuestions.forEach(question=>{

question.addEventListener(

"click",

()=>{

const answer =

question.nextElementSibling;

const isOpen =

answer.style.maxHeight;

document
.querySelectorAll(
".faq-answer"
)
.forEach(item=>{

item.style.maxHeight =
null;

});

if(!isOpen){

answer.style.maxHeight =

answer.scrollHeight +
"px";

}

}

);

});

/* =========================================
   NEWSLETTER
========================================= */

const newsletterBtn =

document.querySelector(
".newsletter-form button"
);

newsletterBtn?.addEventListener(

"click",

()=>{

const email =

document.querySelector(
".newsletter-form input"
).value;

if(email === ""){

alert(
"Please enter email"
);

return;

}

localStorage.setItem(

"newsletterEmail",

email

);

alert(
"Subscribed Successfully!"
);

}

);

/* =========================================
   DESTINATION AUTO SLIDER
========================================= */

const slider =

document.querySelector(
".destination-slider"
);

let scrollAmount = 0;

function autoSlide(){

if(!slider) return;

scrollAmount += 1;

slider.scrollLeft =
scrollAmount;

if(

scrollAmount >=

slider.scrollWidth -
slider.clientWidth

){

scrollAmount = 0;

}

}

setInterval(
autoSlide,
40
);

/* =========================================
   USER PROFILE
========================================= */

const userName =
document.getElementById(
"userName"
);

const userPhoto =
document.getElementById(
"userPhoto"
);

const savedUser =

JSON.parse(

localStorage.getItem(
"userProfile"
)

);

if(savedUser){

if(userName){

userName.innerText =
savedUser.name;

}

if(userPhoto){

userPhoto.src =
savedUser.photo;

}

}

/* =========================================
   LOGIN DETECTION
========================================= */

const loginBtn =

document.querySelector(
".login-btn"
);

if(savedUser){

if(loginBtn){

loginBtn.innerText =
"Dashboard";

loginBtn.href =
"profile.html";

}

}

/* =========================================
   PREMIUM TOAST NOTIFICATION
========================================= */

function showToast(message){

const toast =

document.createElement(
"div"
);

toast.className =
"toast";

toast.innerText =
message;

document.body.appendChild(
toast
);

setTimeout(()=>{

toast.classList.add(
"show"
);

},100);

setTimeout(()=>{

toast.remove();

},3000);

}

/* Example */

showToast(
"Welcome to Info All!"
);

/* =========================================
   LIVE DATE & TIME
========================================= */

function updateClock(){

const clock =

document.getElementById(
"liveClock"
);

if(!clock) return;

const now = new Date();

clock.innerText =

now.toLocaleString();

}

setInterval(
updateClock,
1000
);

updateClock();

/* =========================================
   HERO BUTTON ANIMATION
========================================= */

const heroButtons =

document.querySelectorAll(
".primary-btn,.secondary-btn"
);

heroButtons.forEach(btn=>{

btn.addEventListener(

"mouseenter",

()=>{

btn.style.transform =
"translateY(-5px)";

}

);

btn.addEventListener(

"mouseleave",

()=>{

btn.style.transform =
"translateY(0)";

}

);

});
/* =========================================
   ADVANCED SEARCH SYSTEM
========================================= */

const searchData = [

"Munnar",
"Ooty",
"Goa",
"Mysore",
"Kodaikanal",
"Chennai Weather",
"Travel Guide",
"AI Assistant",
"Hotels",
"Restaurants",
"Tourist Places"

];

const searchBox =
document.getElementById(
"searchInput"
);

const suggestionBox =
document.createElement("div");

suggestionBox.id =
"searchSuggestions";

if(searchBox){

searchBox.parentNode.appendChild(
suggestionBox
);

searchBox.addEventListener(

"input",

()=>{

const value =
searchBox.value.toLowerCase();

suggestionBox.innerHTML = "";

if(value.length < 1){

return;

}

const filtered =

searchData.filter(item =>

item.toLowerCase()
.includes(value)

);

filtered.forEach(item=>{

const div =
document.createElement(
"div"
);

div.className =
"suggestion-item";

div.innerText =
item;

div.onclick = ()=>{

searchBox.value =
item;

suggestionBox.innerHTML =
"";

};

suggestionBox.appendChild(
div
);

});

});

}

/* =========================================
   FAVORITES SYSTEM
========================================= */

let favorites =

JSON.parse(

localStorage.getItem(
"favorites"
)

) || [];

function addToFavorites(item){

if(
!favorites.includes(item)
){

favorites.push(item);

localStorage.setItem(

"favorites",

JSON.stringify(
favorites
)

);

showToast(
item +
" added to favorites"
);

}

}

window.addToFavorites =
addToFavorites;

/* =========================================
   DARK MODE ICON SWITCH
========================================= */

function updateThemeIcon(){

const btn =
document.getElementById(
"darkModeBtn"
);

if(!btn) return;

if(

document.body.classList.contains(
"dark-mode"
)

){

btn.innerHTML =
"☀️";

}else{

btn.innerHTML =
"🌙";

}

}

updateThemeIcon();

darkModeBtn?.addEventListener(

"click",

()=>{

setTimeout(
updateThemeIcon,
100
);

}

/* =========================================
   SCROLL REVEAL ANIMATION
========================================= */

);

const revealElements =

document.querySelectorAll(

".feature-card,\
.destination-card,\
.stat-box,\
.testimonial-card,\
.gallery-grid img"

);

const revealObserver =

new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add(
"show"
);

}

});

},

{
threshold:0.15
}

);

revealElements.forEach(el=>{

revealObserver.observe(el);

});

/* =========================================
   PAGE LOADER
========================================= */

window.addEventListener(

"load",

()=>{

const loader =

document.getElementById(
"loader"
);

if(loader){

loader.style.opacity =
"0";

setTimeout(()=>{

loader.style.display =
"none";

},500);

}

}

);

/* =========================================
   PREMIUM GREETING
========================================= */

const hour =
new Date().getHours();

let greeting =

"Welcome";

if(hour < 12){

greeting =
"Good Morning";

}else if(hour < 18){

greeting =
"Good Afternoon";

}else{

greeting =
"Good Evening";

}

console.log(
greeting +
" to Info All"
);

/* =========================================
   FEATURED PLACE ROTATOR
========================================= */

const featuredPlaces = [

"🌄 Munnar",
"🏖 Goa",
"🏔 Ooty",
"🏰 Mysore",
"🌳 Kodaikanal"

];

let placeIndex = 0;

const featuredText =

document.getElementById(
"featuredPlace"
);

setInterval(()=>{

if(featuredText){

featuredText.innerText =

featuredPlaces[
placeIndex
];

placeIndex++;

if(
placeIndex >=
featuredPlaces.length
){

placeIndex = 0;

}

}

},3000);

/* =========================================
   SAVE LAST VISIT
========================================= */

localStorage.setItem(

"lastVisit",

new Date().toLocaleString()

);

const lastVisit =

localStorage.getItem(
"lastVisit"
);

console.log(
"Last Visit:",
lastVisit
);

/* =========================================
   QUICK SEARCH REDIRECT
========================================= */

searchBtn?.addEventListener(

"click",

()=>{

const query =

searchInput.value
.toLowerCase();

if(
query.includes("weather")
){

window.location.href =
"weather.html";

}
else if(
query.includes("ai")
){

window.location.href =
"ai.html";

}
else if(
query.includes("place")
){

window.location.href =
"destinations.html";

}

}

);

/* =========================================
   AUTO SAVE USER SETTINGS
========================================= */

window.addEventListener(

"beforeunload",

()=>{

localStorage.setItem(

"userSettings",

JSON.stringify({

theme:

document.body
.classList.contains(
"dark-mode"
)

})

);

}

);

/* =========================================
   INFO ALL PREMIUM JS PART 3 END
========================================= */