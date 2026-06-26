/* =====================================
        INFO ALL - PLACE PAGE JS
===================================== */

/* -----------------------------
      LOADER SCREEN
------------------------------ */

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    setTimeout(() => {

        if (loader) {
            loader.style.opacity = "0";
            loader.style.visibility = "hidden";
        }

    }, 700);

});


/* -----------------------------
      MOBILE DRAWER
------------------------------ */

const menuBtn = document.getElementById("menuBtn");
const closeDrawer = document.getElementById("closeDrawer");
const mobileDrawer = document.getElementById("mobileDrawer");

if (menuBtn && mobileDrawer) {

    menuBtn.addEventListener("click", () => {

        mobileDrawer.classList.add("active");

    });

}

if (closeDrawer && mobileDrawer) {

    closeDrawer.addEventListener("click", () => {

        mobileDrawer.classList.remove("active");

    });

}


/* -----------------------------
    DESTINATION DATA
------------------------------ */

let allPlaces = [];
let currentPlaces = [];


/* -----------------------------
      LOAD PLACES
------------------------------ */

fetch("place.json")

.then(response => response.json())

.then(data => {

    allPlaces = data;
    currentPlaces = data;

    renderPlaces(data);

    setupSearch(data);

})

.catch(error => {

    console.error(error);

    document.getElementById("placesGrid").innerHTML = `
        <h2 style="
        text-align:center;
        width:100%;
        color:#ef4444;
        ">
            Failed to load destinations.
        </h2>
    `;

});


/* -----------------------------
     RENDER DESTINATION CARDS
------------------------------ */

function renderPlaces(placeList) {

    const grid =
    document.getElementById("placesGrid");

    const total =
    document.getElementById("totalPlaces");

    if (!grid) return;

    grid.innerHTML = "";

    if (total) {

        total.textContent =
        `${placeList.length} Destinations`;

    }

    if (placeList.length === 0) {

        grid.innerHTML = `
        <div style="
        text-align:center;
        width:100%;
        padding:80px 0;
        ">
            <h2>No destinations found.</h2>
        </div>
        `;

        return;

    }

    placeList.forEach((place, index) => {

        const badge =
        place.rating >= 4.9 ?
        "🔥 Trending" :
        "⭐ Popular";

        const card =
        document.createElement("div");

        card.className =
        "place-card hidden";

        card.innerHTML = `

            <div class="badge">
                ${badge}
            </div>

            <img
            src="${place.image}"
            alt="${place.name}">

            <div class="card-content">

                <span class="card-state">
                    ${place.state}
                </span>

                <h3>
                    ${place.name}
                </h3>

                <div class="card-rating">
                    ⭐ ${place.rating}
                </div>

                <p>
                    Best Time:
                    ${place.bestTime}
                </p>

                <a
                href="place-details.html?name=${encodeURIComponent(place.name)}"
                class="explore-btn">

                    Explore →

                </a>

            </div>

        `;

        grid.appendChild(card);

        setTimeout(() => {

            card.classList.remove("hidden");
            card.classList.add("show");

        }, index * 60);

    });

}


/* -----------------------------
     LIVE SEARCH
------------------------------ */

function setupSearch(data) {

    const searchInput =
    document.getElementById(
    "searchInput"
    );

    const suggestions =
    document.getElementById(
    "searchSuggestions"
    );

    if (!searchInput ||
        !suggestions) return;

    searchInput.addEventListener(
    "input",

    () => {

        const value =
        searchInput.value
        .trim()
        .toLowerCase();

        if (value === "") {

            suggestions.style.display =
            "none";

            renderPlaces(allPlaces);

            return;

        }

        const filtered =
        data.filter(place =>

            place.name
            .toLowerCase()
            .includes(value)

            ||

            place.state
            .toLowerCase()
            .includes(value)

        );

        renderPlaces(filtered);

        if (filtered.length === 0) {

            suggestions.style.display =
            "none";

            return;

        }

        suggestions.innerHTML =
        filtered
        .slice(0, 6)
        .map(place => `

            <div
            class="suggestion-item"
            data-name="${place.name}">

                ${place.name}
                <small style="
                color:#64748b;
                margin-left:8px;
                ">
                    ${place.state}
                </small>

            </div>

        `)
        .join("");

        suggestions.style.display =
        "block";

        document
        .querySelectorAll(
        ".suggestion-item"
        )

        .forEach(item => {

            item.addEventListener(
            "click",

            () => {

                searchInput.value =
                item.dataset.name;

                suggestions.style.display =
                "none";

                const result =
                allPlaces.filter(place =>

                    place.name ===
                    item.dataset.name

                );

                renderPlaces(result);

            });

        });

    });

    document.addEventListener(
    "click",

    (e) => {

        if (
            !searchInput.contains(e.target)
            &&
            !suggestions.contains(e.target)
        ) {

            suggestions.style.display =
            "none";

        }

    });

}


/* -----------------------------
      FILTER BUTTONS
------------------------------ */

const filterButtons =
document.querySelectorAll(
".filter-btn"
);

filterButtons.forEach(button => {

    button.addEventListener(
    "click",

    () => {

        filterButtons.forEach(btn =>

            btn.classList.remove(
            "active"
            )

        );

        button.classList.add(
        "active"
        );

        const filter =
        button.dataset.filter;

        if (
            filter === "all"
        ) {

            renderPlaces(
            allPlaces
            );

            return;

        }

        const filtered =
        allPlaces.filter(place => {

            const name =
            place.name.toLowerCase();

            const state =
            place.state.toLowerCase();

            if (
                filter === "hill"
            ) {

                return (
                    name.includes("munnar")
                    ||
                    name.includes("ooty")
                    ||
                    name.includes("kodaikanal")
                    ||
                    name.includes("manali")
                    ||
                    name.includes("shimla")
                    ||
                    name.includes("darjeeling")
                    ||
                    name.includes("gangtok")
                );

            }

            if (
                filter === "beach"
            ) {

                return (
                    name.includes("goa")
                    ||
                    name.includes("alleppey")
                    ||
                    name.includes("andaman")
                    ||
                    name.includes("lakshadweep")
                    ||
                    name.includes("puri")
                );

            }

            if (
                filter === "heritage"
            ) {

                return (
                    name.includes("agra")
                    ||
                    name.includes("jaipur")
                    ||
                    name.includes("hampi")
                    ||
                    name.includes("mahabalipuram")
                    ||
                    name.includes("konark")
                );

            }

            if (
                filter === "nature"
            ) {

                return (
                    state.includes("kerala")
                    ||
                    state.includes("meghalaya")
                    ||
                    state.includes("sikkim")
                );

            }

            if (
                filter === "adventure"
            ) {

                return (
                    name.includes("leh")
                    ||
                    name.includes("ladakh")
                    ||
                    name.includes("kaziranga")
                    ||
                    name.includes("wayanad")
                );

            }

            return true;

        });

        renderPlaces(
        filtered
        );

    });

});


/* -----------------------------
   HEADER SCROLL EFFECT
------------------------------ */

window.addEventListener(
"scroll",

() => {

    const header =
    document.querySelector(
    ".header"
    );

    if (!header) return;

    if (
        window.scrollY > 50
    ) {

        header.style.background =
        "rgba(15,23,42,.95)";

        header.style.boxShadow =
        "0 10px 30px rgba(0,0,0,.15)";

    }

    else {

        header.style.background =
        "rgba(15,23,42,.82)";

        header.style.boxShadow =
        "none";

    }

});


/* -----------------------------
    INTERSECTION ANIMATION
------------------------------ */

const observer =
new IntersectionObserver(

(entries) => {

    entries.forEach(
    entry => {

        if (
            entry.isIntersecting
        ) {

            entry.target
            .classList.add(
            "show"
            );

        }

    });

},

{
    threshold: 0.15
}

);

setInterval(() => {

    document
    .querySelectorAll(
    ".place-card.hidden"
    )

    .forEach(card => {

        observer.observe(
        card
        );

    });

}, 500);


/* -----------------------------
    NEWSLETTER BUTTON
------------------------------ */

const subscribeBtn =
document.querySelector(
".newsletter-form button"
);

if (subscribeBtn) {

    subscribeBtn.addEventListener(
    "click",

    () => {

        const email =
        document.querySelector(
        ".newsletter-form input"
        ).value;

        if (
            email.trim() === ""
        ) {

            alert(
            "Please enter your email."
            );

            return;

        }

        alert(
        "🎉 Thank you for subscribing!"
        );

    });

}


/* -----------------------------
    BACK TO TOP BUTTON
------------------------------ */

const topBtn =
document.createElement(
"button"
);

topBtn.innerHTML =
`<i class="fa-solid fa-arrow-up"></i>`;

topBtn.id =
"topButton";

document.body.appendChild(
topBtn
);

topBtn.style.position =
"fixed";

topBtn.style.right =
"25px";

topBtn.style.bottom =
"25px";

topBtn.style.width =
"55px";

topBtn.style.height =
"55px";

topBtn.style.border =
"none";

topBtn.style.borderRadius =
"50%";

topBtn.style.background =
"#2563eb";

topBtn.style.color =
"#fff";

topBtn.style.cursor =
"pointer";

topBtn.style.display =
"none";

topBtn.style.zIndex =
"999";

topBtn.style.boxShadow =
"0 10px 25px rgba(37,99,235,.35)";

window.addEventListener(
"scroll",

() => {

    if (
        window.scrollY > 400
    ) {

        topBtn.style.display =
        "block";

    }

    else {

        topBtn.style.display =
        "none";

    }

});

topBtn.addEventListener(
"click",

() => {

    window.scrollTo({

        top: 0,
        behavior: "smooth"

    });

});


/* -----------------------------
       CONSOLE MESSAGE
------------------------------ */

console.log(
"✨ Info All Premium Destination Portal Loaded Successfully"
);