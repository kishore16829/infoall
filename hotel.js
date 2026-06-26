/* ==========================================
        INFO ALL - HOTEL PAGE
        hotel.js (Part 1)
========================================== */

/* ==========================================
            GLOBAL VARIABLES
========================================== */

let hotels = [];
let filteredHotels = [];

const hotelGrid =
document.getElementById(
    "hotelGrid"
);

const totalHotels =
document.getElementById(
    "totalHotels"
);

const hotelSearch =
document.getElementById(
    "hotelSearch"
);

const searchSuggestions =
document.getElementById(
    "searchSuggestions"
);

const loader =
document.getElementById(
    "loader"
);

const menuBtn =
document.getElementById(
    "menuBtn"
);

const closeDrawer =
document.getElementById(
    "closeDrawer"
);

const mobileDrawer =
document.getElementById(
    "mobileDrawer"
);

const backToTop =
document.getElementById(
    "backToTop"
);

const searchBtn =
document.getElementById(
    "searchBtn"
);

const priceRange =
document.getElementById(
    "priceRange"
);

const priceValue =
document.getElementById(
    "priceValue"
);

const sortHotels =
document.getElementById(
    "sortHotels"
);

/* ==========================================
            WINDOW LOADER
========================================== */

window.addEventListener(
    "load",
    () => {

        setTimeout(() => {

            if(loader){

                loader.style.opacity =
                "0";

                loader.style.visibility =
                "hidden";

            }

        }, 700);

    }
);

/* ==========================================
        MOBILE DRAWER MENU
========================================== */

if(menuBtn){

    menuBtn.addEventListener(
        "click",
        () => {

            mobileDrawer.classList.add(
                "active"
            );

        }
    );

}

if(closeDrawer){

    closeDrawer.addEventListener(
        "click",
        () => {

            mobileDrawer.classList.remove(
                "active"
            );

        }
    );

}

/* Close drawer by clicking outside */

document.addEventListener(
    "click",
    (event) => {

        if(
            mobileDrawer &&
            mobileDrawer.classList.contains(
                "active"
            )
        ){

            if(
                !mobileDrawer.contains(
                    event.target
                )
                &&
                !menuBtn.contains(
                    event.target
                )
            ){

                mobileDrawer.classList.remove(
                    "active"
                );

            }

        }

    }
);

/* ==========================================
            BACK TO TOP
========================================== */

if(backToTop){

    backToTop.style.opacity = "0";
    backToTop.style.pointerEvents =
    "none";

}

window.addEventListener(
    "scroll",
    () => {

        if(
            window.scrollY > 500
        ){

            backToTop.style.opacity =
            "1";

            backToTop.style.pointerEvents =
            "auto";

        }

        else{

            backToTop.style.opacity =
            "0";

            backToTop.style.pointerEvents =
            "none";

        }

    }
);

if(backToTop){

    backToTop.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top:0,
                behavior:"smooth"

            });

        }
    );

}

/* ==========================================
        PRICE RANGE SLIDER
========================================== */

if(priceRange){

    priceRange.addEventListener(
        "input",
        () => {

            if(priceValue){

                priceValue.textContent =
                "₹" +
                Number(
                    priceRange.value
                ).toLocaleString(
                    "en-IN"
                );

            }

        }
    );

}

/* ==========================================
        LIVE SEARCH SUGGESTIONS
========================================== */

function showSuggestions(
    keyword
){

    if(
        !searchSuggestions
    ) return;

    if(
        keyword.trim() === ""
    ){

        searchSuggestions.innerHTML =
        "";

        searchSuggestions.style.display =
        "none";

        return;

    }

    const results =
    hotels.filter(
        hotel =>

        hotel.name
        .toLowerCase()
        .includes(
            keyword.toLowerCase()
        )

        ||

        hotel.location
        .toLowerCase()
        .includes(
            keyword.toLowerCase()
        )

        ||

        hotel.category
        .toLowerCase()
        .includes(
            keyword.toLowerCase()
        )

    ).slice(0,5);

    if(
        results.length === 0
    ){

        searchSuggestions.innerHTML =
        `
        <div class="suggestion-item">
            No matching hotels found
        </div>
        `;

    }

    else{

        searchSuggestions.innerHTML =
        results.map(
            hotel =>

            `
            <div class="suggestion-item"
                data-name="${hotel.name}">

                <strong>
                    ${hotel.name}
                </strong>

                <br>

                <small>
                    📍 ${hotel.location}
                </small>

            </div>
            `
        ).join("");

    }

    searchSuggestions.style.display =
    "block";

}

/* ==========================================
        SEARCH INPUT EVENT
========================================== */

if(hotelSearch){

    hotelSearch.addEventListener(
        "input",
        function(){

            showSuggestions(
                this.value
            );

        }
    );

}

/* Select suggestion */

document.addEventListener(
    "click",
    (event) => {

        if(
            event.target.closest(
                ".suggestion-item"
            )
        ){

            const selected =
            event.target
            .closest(
                ".suggestion-item"
            )
            .dataset
            .name;

            if(
                selected &&
                hotelSearch
            ){

                hotelSearch.value =
                selected;

            }

            searchSuggestions.style.display =
            "none";

        }

    }
);

/* Hide suggestions when clicking elsewhere */

document.addEventListener(
    "click",
    (event) => {

        if(
            hotelSearch &&
            searchSuggestions
        ){

            if(
                !hotelSearch.contains(
                    event.target
                )
                &&
                !searchSuggestions.contains(
                    event.target
                )
            ){

                searchSuggestions.style.display =
                "none";

            }

        }

    }
);

/* ==========================================
        HERO SEARCH BUTTON
========================================== */

if(searchBtn){

    searchBtn.addEventListener(
        "click",
        () => {

            const keyword =
            hotelSearch.value
            .toLowerCase()
            .trim();

            filteredHotels =
            hotels.filter(
                hotel =>

                hotel.name
                .toLowerCase()
                .includes(
                    keyword
                )

                ||

                hotel.location
                .toLowerCase()
                .includes(
                    keyword
                )

                ||

                hotel.category
                .toLowerCase()
                .includes(
                    keyword
                )

            );

            if(
                typeof renderHotels
                === "function"
            ){

                renderHotels(
                    filteredHotels
                );

            }

        }
    );

}
/* ==========================================
        LOAD HOTEL DATA
========================================== */

async function loadHotels(){

    try{

        const response =
        await fetch(
            "hotel.json"
        );

        if(
            !response.ok
        ){

            throw new Error(
                "Unable to load hotel data."
            );

        }

        hotels =
        await response.json();

        filteredHotels =
        [...hotels];

        renderHotels(
            filteredHotels
        );

    }

    catch(error){

        console.error(
            error
        );

        if(hotelGrid){

            hotelGrid.innerHTML =
            `
            <div class="no-hotels">

                <i class="fa-solid fa-circle-exclamation"></i>

                <h2>
                    Failed to Load Hotels
                </h2>

                <p>
                    Please make sure
                    <strong>hotel.json</strong>
                    exists in your project folder.
                </p>

            </div>
            `;

        }

    }

}

/* ==========================================
        CREATE HOTEL CARD
========================================== */

function createHotelCard(
    hotel
){

    return `

    <div class="hotel-card">

        <div class="hotel-card-image">

            <img
                src="${hotel.image}"
                alt="${hotel.name}"
            >

            <span class="hotel-label">
                ${hotel.badge || "Top Rated"}
            </span>

            <div class="hotel-favorite">

                <i class="fa-regular fa-heart"></i>

            </div>

        </div>

        <div class="hotel-card-content">

            <div class="hotel-location">

                <i class="fa-solid fa-location-dot"></i>

                <span>
                    ${hotel.location}
                </span>

            </div>

            <h3>
                ${hotel.name}
            </h3>

            <p class="hotel-description">

                ${hotel.description}

            </p>

            <div class="hotel-facilities">

                ${createAmenities(
                    hotel.amenities
                )}

            </div>

            <div class="hotel-card-footer">

                <div class="hotel-rating">

                    <i class="fa-solid fa-star"></i>

                    ${hotel.rating}

                </div>

                <div class="hotel-price">

                    <strong>
                        ₹${Number(
                            hotel.price
                        ).toLocaleString(
                            "en-IN"
                        )}
                    </strong>

                    <span>
                        / night
                    </span>

                </div>

            </div>

            <a
                href="hotel-details.html?id=${hotel.id}"
                class="hotel-btn"
            >

                <i class="fa-solid fa-hotel"></i>

                View Details

            </a>

        </div>

    </div>

    `;

}

/* ==========================================
        CREATE AMENITIES TAGS
========================================== */

function createAmenities(
    amenities
){

    if(
        !amenities ||
        !Array.isArray(
            amenities
        )
    ){

        return "";

    }

    return amenities
    .slice(0,4)
    .map(
        item =>

        `
        <span>

            ${item}

        </span>
        `
    )
    .join("");

}

/* ==========================================
        RENDER HOTEL GRID
========================================== */

function renderHotels(
    hotelArray
){

    if(
        !hotelGrid
    ) return;

    if(
        totalHotels
    ){

        totalHotels.textContent =
        hotelArray.length;

    }

    if(
        hotelArray.length === 0
    ){

        hotelGrid.innerHTML =
        `
        <div class="no-hotels">

            <i class="fa-solid fa-bed"></i>

            <h2>
                No Hotels Found
            </h2>

            <p>
                Try changing your
                search or filter options.
            </p>

        </div>
        `;

        return;

    }

    hotelGrid.innerHTML =
    hotelArray
    .map(
        hotel =>
        createHotelCard(
            hotel
        )
    )
    .join("");

}

/* ==========================================
        FAVORITE BUTTON
========================================== */

document.addEventListener(
    "click",
    (event) => {

        const favButton =
        event.target.closest(
            ".hotel-favorite"
        );

        if(
            favButton
        ){

            const icon =
            favButton.querySelector(
                "i"
            );

            if(
                icon.classList.contains(
                    "fa-regular"
                )
            ){

                icon.classList.remove(
                    "fa-regular"
                );

                icon.classList.add(
                    "fa-solid"
                );

                icon.style.color =
                "#ef4444";

            }

            else{

                icon.classList.remove(
                    "fa-solid"
                );

                icon.classList.add(
                    "fa-regular"
                );

                icon.style.color =
                "";

            }

        }

    }
);

/* ==========================================
        INITIALIZE DATA
========================================== */

loadHotels();
/* ==========================================
        FILTER & SEARCH SYSTEM
========================================== */

function applyFilters(){

    let results = [...hotels];

    /* -----------------------------
        SEARCH FILTER
    ----------------------------- */

    const keyword =
    hotelSearch ?
    hotelSearch.value
    .toLowerCase()
    .trim()
    : "";

    if(keyword !== ""){

        results =
        results.filter(
            hotel =>

            hotel.name
            .toLowerCase()
            .includes(
                keyword
            )

            ||

            hotel.location
            .toLowerCase()
            .includes(
                keyword
            )

            ||

            hotel.category
            .toLowerCase()
            .includes(
                keyword
            )

        );

    }

    /* -----------------------------
        CATEGORY FILTER
    ----------------------------- */

    const activeCategory =
    document.querySelector(
        ".filter-btn.active"
    );

    if(
        activeCategory &&
        activeCategory.dataset.category &&
        activeCategory.dataset.category !==
        "all"
    ){

        const category =
        activeCategory.dataset.category
        .toLowerCase();

        results =
        results.filter(
            hotel =>

            hotel.category
            .toLowerCase() ===
            category

        );

    }

    /* -----------------------------
        PRICE FILTER
    ----------------------------- */

    if(priceRange){

        const maxPrice =
        Number(
            priceRange.value
        );

        results =
        results.filter(
            hotel =>

            Number(
                hotel.price
            ) <= maxPrice

        );

    }

    /* -----------------------------
        FACILITY FILTERS
    ----------------------------- */

    const wifi =
    document.getElementById(
        "wifiFilter"
    );

    const pool =
    document.getElementById(
        "poolFilter"
    );

    const parking =
    document.getElementById(
        "parkingFilter"
    );

    if(
        wifi &&
        wifi.checked
    ){

        results =
        results.filter(
            hotel =>

            hotel.amenities &&
            hotel.amenities.includes(
                "Free WiFi"
            )

        );

    }

    if(
        pool &&
        pool.checked
    ){

        results =
        results.filter(
            hotel =>

            hotel.amenities &&
            hotel.amenities.includes(
                "Swimming Pool"
            )

        );

    }

    if(
        parking &&
        parking.checked
    ){

        results =
        results.filter(
            hotel =>

            hotel.amenities &&
            hotel.amenities.includes(
                "Parking"
            )

        );

    }

    /* -----------------------------
        SORT RESULTS
    ----------------------------- */

    if(sortHotels){

        switch(
            sortHotels.value
        ){

            case "priceLow":

                results.sort(
                    (
                        a,
                        b
                    ) =>
                    a.price -
                    b.price
                );

                break;

            case "priceHigh":

                results.sort(
                    (
                        a,
                        b
                    ) =>
                    b.price -
                    a.price
                );

                break;

            case "rating":

                results.sort(
                    (
                        a,
                        b
                    ) =>
                    b.rating -
                    a.rating
                );

                break;

            case "name":

                results.sort(
                    (
                        a,
                        b
                    ) =>
                    a.name.localeCompare(
                        b.name
                    )
                );

                break;

            default:

                break;

        }

    }

    filteredHotels =
    results;

    renderHotels(
        filteredHotels
    );

}

/* ==========================================
        CATEGORY BUTTONS
========================================== */

const filterButtons =
document.querySelectorAll(
    ".filter-btn"
);

filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    item =>

                    item.classList.remove(
                        "active"
                    )

                );

                button.classList.add(
                    "active"
                );

                applyFilters();

            }
        );

    }
);

/* ==========================================
        SEARCH INPUT EVENT
========================================== */

if(hotelSearch){

    hotelSearch.addEventListener(
        "keyup",
        () => {

            applyFilters();

        }
    );

}

/* ==========================================
        PRICE SLIDER EVENT
========================================== */

if(priceRange){

    priceRange.addEventListener(
        "input",
        () => {

            if(priceValue){

                priceValue.textContent =
                "₹" +
                Number(
                    priceRange.value
                ).toLocaleString(
                    "en-IN"
                );

            }

            applyFilters();

        }
    );

}

/* ==========================================
        SORT EVENT
========================================== */

if(sortHotels){

    sortHotels.addEventListener(
        "change",
        () => {

            applyFilters();

        }
    );

}

/* ==========================================
        CHECKBOX FILTER EVENTS
========================================== */

[
    "wifiFilter",
    "poolFilter",
    "parkingFilter"
].forEach(
    id => {

        const element =
        document.getElementById(
            id
        );

        if(element){

            element.addEventListener(
                "change",
                applyFilters
            );

        }

    }
);

/* ==========================================
        HERO SEARCH BUTTON
========================================== */

if(searchBtn){

    searchBtn.addEventListener(
        "click",
        () => {

            applyFilters();

            document
            .querySelector(
                ".hotel-listing"
            )
            ?.scrollIntoView({

                behavior:
                "smooth"

            });

        }
    );

}

/* ==========================================
        RESET FILTERS
========================================== */

const resetFilter =
document.querySelector(
    ".reset-filter"
);

if(resetFilter){

    resetFilter.addEventListener(
        "click",
        () => {

            if(
                hotelSearch
            ){

                hotelSearch.value =
                "";

            }

            if(
                priceRange
            ){

                priceRange.value =
                50000;

                if(
                    priceValue
                ){

                    priceValue.textContent =
                    "₹50,000";

                }

            }

            if(
                sortHotels
            ){

                sortHotels.value =
                "default";

            }

            filterButtons.forEach(
                button => {

                    button.classList.remove(
                        "active"
                    );

                    if(
                        button.dataset.category ===
                        "all"
                    ){

                        button.classList.add(
                            "active"
                        );

                    }

                }
            );

            [
                "wifiFilter",
                "poolFilter",
                "parkingFilter"
            ].forEach(
                id => {

                    const checkbox =
                    document.getElementById(
                        id
                    );

                    if(
                        checkbox
                    ){

                        checkbox.checked =
                        false;

                    }

                }
            );

            filteredHotels =
            [...hotels];

            renderHotels(
                filteredHotels
            );

        }
    );

}
/* ==========================================
        AI HOTEL RECOMMENDATION
========================================== */

const generateHotelPlan =
document.getElementById(
    "generateHotelPlan"
);

const aiResult =
document.getElementById(
    "aiResult"
);

if(generateHotelPlan){

    generateHotelPlan.addEventListener(
        "click",
        () => {

            const destination =
            document.getElementById(
                "aiDestination"
            )?.value.trim();

            const budget =
            document.getElementById(
                "aiBudget"
            )?.value;

            const hotelType =
            document.getElementById(
                "aiType"
            )?.value;

            if(
                !destination
            ){

                aiResult.innerHTML =
                `
                <p>
                Please enter a destination.
                </p>
                `;

                return;

            }

            let message = "";

            if(
                budget === "budget"
            ){

                message =
                `
                💰 Budget hotels with
                complimentary WiFi and
                breakfast are recommended.
                `;

            }

            else if(
                budget === "mid"
            ){

                message =
                `
                🏨 Mid-range premium hotels
                with swimming pools and
                family-friendly facilities
                are recommended.
                `;

            }

            else{

                message =
                `
                👑 Luxury 5-star resorts with
                spa, fine dining and scenic
                views are recommended.
                `;

            }

            aiResult.innerHTML =
            `
            <h4>
                ✨ AI Hotel Suggestion
            </h4>

            <p>
                Destination:
                <strong>
                ${destination}
                </strong>
            </p>

            <p>
                Hotel Type:
                <strong>
                ${hotelType || "Premium"}
                </strong>
            </p>

            <p>
                ${message}
            </p>

            <p>
                🌟 Best booking time:
                3-4 weeks before travel
                for lower prices.
            </p>
            `;

        }
    );

}

/* ==========================================
        NEWSLETTER SUBSCRIBE
========================================== */

const subscribeBtn =
document.getElementById(
    "subscribeBtn"
);

const newsletterEmail =
document.getElementById(
    "newsletterEmail"
);

if(
    subscribeBtn
){

    subscribeBtn.addEventListener(
        "click",
        () => {

            const email =
            newsletterEmail
            ?.value
            .trim();

            if(
                email === ""
            ){

                alert(
                    "Please enter your email."
                );

                return;

            }

            const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if(
                !emailRegex.test(
                    email
                )
            ){

                alert(
                    "Please enter a valid email."
                );

                return;

            }

            alert(
                "🎉 Successfully subscribed!"
            );

            newsletterEmail.value =
            "";

        }
    );

}

/* ==========================================
        STICKY HEADER EFFECT
========================================== */

const header =
document.querySelector(
    ".header"
);

window.addEventListener(
    "scroll",
    () => {

        if(
            !header
        ) return;

        if(
            window.scrollY > 80
        ){

            header.style.background =
            "rgba(15,23,42,.95)";

            header.style.backdropFilter =
            "blur(18px)";

            header.style.boxShadow =
            "0 12px 30px rgba(0,0,0,.12)";

        }

        else{

            header.style.background =
            "rgba(15,23,42,.75)";

            header.style.boxShadow =
            "none";

        }

    }
);

/* ==========================================
        SCROLL REVEAL ANIMATION
========================================== */

const revealItems =
document.querySelectorAll(
`
.category-card,
.featured-card,
.hotel-card,
.planner-card,
.newsletter-container,
.app-container
`
);

function revealOnScroll(){

    revealItems.forEach(
        item => {

            const top =
            item
            .getBoundingClientRect()
            .top;

            if(
                top <
                window.innerHeight - 80
            ){

                item.classList.add(
                    "show"
                );

            }

        }
    );

}

window.addEventListener(
    "scroll",
    revealOnScroll
);

window.addEventListener(
    "load",
    revealOnScroll
);

/* ==========================================
        QUICK CATEGORY TAGS
========================================== */

document
.querySelectorAll(
    ".quick-tags span"
)
.forEach(
    tag => {

        tag.addEventListener(
            "click",
            () => {

                if(
                    hotelSearch
                ){

                    hotelSearch.value =
                    tag.textContent
                    .trim();

                    applyFilters();

                    document
                    .querySelector(
                        ".hotel-listing"
                    )
                    ?.scrollIntoView({

                        behavior:
                        "smooth"

                    });

                }

            }
        );

    }
);

/* ==========================================
        KEYBOARD SHORTCUT
        Press "/" to Search
========================================== */

document.addEventListener(
    "keydown",
    (event) => {

        if(
            event.key === "/"
            &&
            hotelSearch
        ){

            event.preventDefault();

            hotelSearch.focus();

        }

    }
);

/* ==========================================
        SMOOTH SCROLL LINKS
========================================== */

document
.querySelectorAll(
    'a[href^="#"]'
)
.forEach(
    anchor => {

        anchor.addEventListener(
            "click",
            function(e){

                const target =
                document.querySelector(
                    this.getAttribute(
                        "href"
                    )
                );

                if(
                    target
                ){

                    e.preventDefault();

                    target.scrollIntoView({

                        behavior:
                        "smooth"

                    });

                }

            }
        );

    }
);

/* ==========================================
        HOTEL CARD PARALLAX HOVER
========================================== */

document.addEventListener(
    "mousemove",
    (event) => {

        const card =
        event.target.closest(
            ".hotel-card"
        );

        if(
            !card
        ) return;

        card.style.transition =
        "transform .2s ease";

    }
);

/* ==========================================
        PAGE INITIALIZATION
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "🏨 Hotel page initialized successfully."
        );

        revealOnScroll();

    }
);

/* ==========================================
        OPTIONAL: AUTO-CLOSE
        SEARCH SUGGESTIONS
========================================== */

document.addEventListener(
    "click",
    (event) => {

        if(
            searchSuggestions &&
            hotelSearch
        ){

            if(
                !searchSuggestions.contains(
                    event.target
                )
                &&
                !hotelSearch.contains(
                    event.target
                )
            ){

                searchSuggestions.style.display =
                "none";

            }

        }

    }
);

/* ==========================================
            END OF FILE
========================================== */