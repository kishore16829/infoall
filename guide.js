/* ==========================================================
   GUIDE.JS
   Part 1 : Core UI Functions
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       PAGE LOADER
    ========================================== */

    const loader = document.getElementById("loader");

    window.addEventListener("load", () => {
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = "0";
                loader.style.visibility = "hidden";
            }, 600);
        }
    });

    /* ==========================================
       STICKY HEADER
    ========================================== */

    const header = document.querySelector(".header");

    function updateHeader() {
        if (!header) return;

        if (window.scrollY > 60) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader);

    /* ==========================================
       MOBILE DRAWER MENU
    ========================================== */

    const menuBtn = document.getElementById("menuBtn");
    const mobileDrawer = document.getElementById("mobileDrawer");
    const closeDrawer = document.getElementById("closeDrawer");

    if (menuBtn && mobileDrawer) {

        menuBtn.addEventListener("click", () => {
            mobileDrawer.classList.add("active");
            document.body.style.overflow = "hidden";
        });

    }

    if (closeDrawer && mobileDrawer) {

        closeDrawer.addEventListener("click", () => {
            mobileDrawer.classList.remove("active");
            document.body.style.overflow = "";
        });

    }

    // Close drawer when clicking a link

    document.querySelectorAll(".drawer-links a")
        .forEach(link => {

            link.addEventListener("click", () => {
                if (mobileDrawer) {
                    mobileDrawer.classList.remove("active");
                    document.body.style.overflow = "";
                }
            });

        });

    /* ==========================================
       SEARCH OVERLAY
    ========================================== */

    const searchBtn = document.getElementById("searchBtn");
    const searchOverlay = document.getElementById("searchOverlay");
    const closeSearch = document.getElementById("closeSearch");

    if (searchBtn && searchOverlay) {

        searchBtn.addEventListener("click", () => {
            searchOverlay.classList.add("active");
            document.body.style.overflow = "hidden";

            const input =
                document.getElementById("globalSearchInput");

            if (input) {
                setTimeout(() => {
                    input.focus();
                }, 200);
            }
        });

    }

    if (closeSearch && searchOverlay) {

        closeSearch.addEventListener("click", () => {
            searchOverlay.classList.remove("active");
            document.body.style.overflow = "";
        });

    }

    // Close overlay using ESC key

    document.addEventListener("keydown", (event) => {

        if (
            event.key === "Escape" &&
            searchOverlay &&
            searchOverlay.classList.contains("active")
        ) {
            searchOverlay.classList.remove("active");
            document.body.style.overflow = "";
        }

    });

    /* ==========================================
       BACK TO TOP BUTTON
    ========================================== */

    const backToTop =
        document.getElementById("backToTop");

    function updateBackToTop() {

        if (!backToTop) return;

        if (window.scrollY > 500) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }

    }

    window.addEventListener(
        "scroll",
        updateBackToTop
    );

    updateBackToTop();

    if (backToTop) {

        backToTop.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }

    /* ==========================================
       FOOTER CURRENT YEAR
    ========================================== */

    const yearElement =
        document.querySelector(".current-year");

    if (yearElement) {
        yearElement.textContent =
            new Date().getFullYear();
    }

    /* ==========================================
       HERO SEARCH BUTTON
    ========================================== */

    const heroSearchBtn =
        document.getElementById("heroSearchBtn");

    const heroSearchInput =
        document.getElementById("heroSearchInput");

    if (heroSearchBtn && heroSearchInput) {

        heroSearchBtn.addEventListener("click", () => {

            const value =
                heroSearchInput.value.trim();

            if (value.length > 0) {

                // Future: connect to place-details page
                alert(
                    `Searching travel guides for "${value}"...`
                );

            } else {

                heroSearchInput.focus();

            }

        });

    }

});
/* ==========================================================
   GUIDE.JS
   Part 2 : Search + Guide Loading + Filters
========================================================== */

/* ==========================================
   GLOBAL VARIABLES
========================================== */

let allGuides = [];
let currentFilter = "all";

/* ==========================================
   LOAD GUIDES FROM JSON
========================================== */

async function loadGuides() {

    try {

        const response = await fetch("guides.json");

        if (!response.ok) {
            throw new Error("Unable to load guides.json");
        }

        allGuides = await response.json();

        renderGuideCards(allGuides);

        initializeFilters();

    } catch (error) {

        console.error(error);

        const guideGrid =
            document.getElementById("guideGrid");

        if (guideGrid) {

            guideGrid.innerHTML = `
                <div class="guide-error">
                    <h3>⚠ Unable to load travel guides</h3>
                    <p>Please check your guides.json file.</p>
                </div>
            `;

        }

    }

}

/* ==========================================
   RENDER GUIDE CARDS
========================================== */

function renderGuideCards(guides) {

    const guideGrid =
        document.getElementById("guideGrid");

    if (!guideGrid) return;

    guideGrid.innerHTML = "";

    if (guides.length === 0) {

        guideGrid.innerHTML = `
            <div class="guide-error">
                <h3>No guides found.</h3>
            </div>
        `;

        return;

    }

    guides.forEach(guide => {

        const card = document.createElement("article");

        card.className = "guide-card fade-up";

        card.innerHTML = `

            <div class="guide-card-image">

                <img
                    src="${guide.image}"
                    alt="${guide.title}">

                <span class="guide-card-category">
                    ${guide.category}
                </span>

            </div>

            <div class="guide-card-content">

                <h3>
                    ${guide.title}
                </h3>

                <p>
                    ${guide.description}
                </p>

                <div class="guide-card-footer">

                    <span>
                        <i class="fa-solid fa-clock"></i>
                        ${guide.readTime}
                    </span>

                    <a href="${guide.link || '#'}">

                        Read More

                        <i class="fa-solid fa-arrow-right"></i>

                    </a>

                </div>

            </div>

        `;

        guideGrid.appendChild(card);

    });

    runScrollAnimation();

}

/* ==========================================
   FILTER BUTTONS
========================================== */

function initializeFilters() {

    const filterButtons =
        document.querySelectorAll(".filter-btn");

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            currentFilter =
                button.dataset.filter;

            filterGuides(currentFilter);

        });

    });

    /* CATEGORY CARDS */

    const categoryCards =
        document.querySelectorAll(".category-card");

    categoryCards.forEach(card => {

        card.addEventListener("click", () => {

            categoryCards.forEach(item => {
                item.classList.remove("active");
            });

            card.classList.add("active");

            currentFilter =
                card.dataset.category;

            filterGuides(currentFilter);

            // Update filter button UI

            filterButtons.forEach(btn => {

                btn.classList.remove("active");

                if (
                    btn.dataset.filter ===
                    currentFilter
                ) {
                    btn.classList.add("active");
                }

            });

        });

    });

}

/* ==========================================
   FILTER LOGIC
========================================== */

function filterGuides(category) {

    if (category === "all") {

        renderGuideCards(allGuides);

        return;

    }

    const filtered =
        allGuides.filter(guide => {

            return (
                guide.category
                    .toLowerCase()
                    .replace(/\s+/g, "") ===
                category
                    .toLowerCase()
                    .replace(/\s+/g, "")
            );

        });

    renderGuideCards(filtered);

}

/* ==========================================
   LIVE SEARCH SUGGESTIONS
========================================== */

const globalSearchInput =
    document.getElementById(
        "globalSearchInput"
    );

const suggestionsBox =
    document.querySelector(
        ".suggestions-box"
    );

if (
    globalSearchInput &&
    suggestionsBox
) {

    globalSearchInput.addEventListener(
        "input",
        function () {

            const keyword =
                this.value
                    .trim()
                    .toLowerCase();

            suggestionsBox.innerHTML = "";

            if (
                keyword.length < 1 ||
                allGuides.length === 0
            ) {
                return;
            }

            const results =
                allGuides.filter(item => {

                    return (
                        item.title
                            .toLowerCase()
                            .includes(keyword) ||

                        item.category
                            .toLowerCase()
                            .includes(keyword)
                    );

                });

            results
                .slice(0, 6)
                .forEach(item => {

                    const div =
                        document.createElement(
                            "div"
                        );

                    div.className =
                        "search-suggestion";

                    div.innerHTML = `

                        <img
                            src="${item.image}"
                            alt="${item.title}">

                        <div>

                            <strong>
                                ${item.title}
                            </strong>

                            <small>
                                ${item.category}
                            </small>

                        </div>

                    `;

                    div.addEventListener(
                        "click",
                        () => {

                            globalSearchInput.value =
                                item.title;

                            suggestionsBox.innerHTML =
                                "";

                            if (
                                item.link
                            ) {
                                window.location.href =
                                    item.link;
                            }

                        }
                    );

                    suggestionsBox.appendChild(
                        div
                    );

                });

        }
    );

    /* Clear suggestions when input loses focus */

    globalSearchInput.addEventListener(
        "blur",
        () => {

            setTimeout(() => {

                suggestionsBox.innerHTML =
                    "";

            }, 200);

        }
    );

}

/* ==========================================
   HERO SEARCH FILTER
========================================== */

const heroSearchInput =
    document.getElementById(
        "heroSearchInput"
    );

const heroSearchBtn =
    document.getElementById(
        "heroSearchBtn"
    );

if (
    heroSearchBtn &&
    heroSearchInput
) {

    heroSearchBtn.addEventListener(
        "click",
        () => {

            const keyword =
                heroSearchInput.value
                    .trim()
                    .toLowerCase();

            if (!keyword) return;

            const filtered =
                allGuides.filter(
                    guide =>

                        guide.title
                            .toLowerCase()
                            .includes(
                                keyword
                            ) ||

                        guide.category
                            .toLowerCase()
                            .includes(
                                keyword
                            )
                );

            renderGuideCards(
                filtered
            );

            document
                .getElementById(
                    "featuredGuides"
                )
                ?.scrollIntoView({
                    behavior:
                        "smooth"
                });

        }
    );

}

/* ==========================================
   INITIALIZE
========================================== */

loadGuides();
/* ==========================================================
   GUIDE.JS
   Part 3 : AI Guide + Animations + Newsletter
========================================================== */

/* ==========================================
   AI TRAVEL GUIDE GENERATOR
========================================== */

const generateGuideBtn =
    document.getElementById(
        "generateGuideBtn"
    );

const aiDestination =
    document.getElementById(
        "aiDestination"
    );

const aiBudget =
    document.getElementById(
        "aiBudget"
    );

const aiTravelStyle =
    document.getElementById(
        "aiTravelStyle"
    );

const aiGuideResult =
    document.getElementById(
        "aiGuideResult"
    );

if (
    generateGuideBtn &&
    aiDestination &&
    aiBudget &&
    aiTravelStyle &&
    aiGuideResult
) {

    generateGuideBtn.addEventListener(
        "click",
        () => {

            const destination =
                aiDestination.value.trim();

            const budget =
                aiBudget.value;

            const style =
                aiTravelStyle.value;

            if (!destination) {

                aiGuideResult.innerHTML = `
                    <div class="ai-result-icon">
                        <i class="fa-solid fa-location-dot"></i>
                    </div>

                    <h3>
                        Enter a Destination
                    </h3>

                    <p>
                        Please type a destination to
                        generate your travel plan.
                    </p>
                `;

                return;

            }

            let hotelType = "";
            let activities = "";
            let travelTip = "";

            switch (budget) {

                case "budget":
                    hotelType =
                        "Budget hotels and local homestays";
                    break;

                case "mid":
                    hotelType =
                        "Comfort hotels and boutique stays";
                    break;

                default:
                    hotelType =
                        "Luxury resorts and premium experiences";

            }

            switch (
                style.toLowerCase()
            ) {

                case "adventure":
                    activities =
                        "trekking, hiking, waterfalls and outdoor activities";
                    travelTip =
                        "Carry trekking shoes and light rain protection.";
                    break;

                case "family":
                    activities =
                        "family attractions, parks and cultural sites";
                    travelTip =
                        "Book family-friendly hotels in advance.";
                    break;

                case "honeymoon":
                    activities =
                        "romantic viewpoints, resorts and sunset experiences";
                    travelTip =
                        "Reserve premium stays for the best experience.";
                    break;

                case "solo":
                    activities =
                        "local markets, cafés and backpacking routes";
                    travelTip =
                        "Keep emergency contacts and digital copies of documents.";
                    break;

                default:
                    activities =
                        "heritage sites, museums and local cuisine";
                    travelTip =
                        "Explore local traditions and festivals.";

            }

            aiGuideResult.innerHTML = `

                <div class="ai-result-icon">
                    <i class="fa-solid fa-robot"></i>
                </div>

                <h3>
                    ${destination} Travel Plan
                </h3>

                <p>
                    <strong>Budget:</strong>
                    ${budget}
                </p>

                <p>
                    <strong>Recommended Stay:</strong><br>
                    ${hotelType}
                </p>

                <p>
                    <strong>Best Activities:</strong><br>
                    ${activities}
                </p>

                <p>
                    <strong>AI Travel Tip:</strong><br>
                    ${travelTip}
                </p>

            `;

        }
    );

}

/* ==========================================
   SCROLL REVEAL ANIMATION
========================================== */

function runScrollAnimation() {

    const elements =
        document.querySelectorAll(
            ".fade-up"
        );

    const trigger =
        window.innerHeight * 0.88;

    elements.forEach(item => {

        const top =
            item.getBoundingClientRect()
                .top;

        if (top < trigger) {
            item.classList.add(
                "show"
            );
        }

    });

}

window.addEventListener(
    "scroll",
    runScrollAnimation
);

window.addEventListener(
    "load",
    runScrollAnimation
);

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

if (
    subscribeBtn &&
    newsletterEmail
) {

    subscribeBtn.addEventListener(
        "click",
        () => {

            const email =
                newsletterEmail.value.trim();

            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (
                !emailRegex.test(
                    email
                )
            ) {

                alert(
                    "Please enter a valid email address."
                );

                newsletterEmail.focus();

                return;

            }

            subscribeBtn.innerHTML =
                `<i class="fa-solid fa-circle-check"></i> Subscribed`;

            subscribeBtn.disabled =
                true;

            newsletterEmail.value = "";

            setTimeout(() => {

                subscribeBtn.innerHTML =
                    `<i class="fa-solid fa-paper-plane"></i> Subscribe`;

                subscribeBtn.disabled =
                    false;

            }, 3000);

        }
    );

}

/* ==========================================
   SMOOTH SCROLL FOR ANCHOR LINKS
========================================== */

document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach(link => {

        link.addEventListener(
            "click",
            function (event) {

                const targetId =
                    this.getAttribute(
                        "href"
                    );

                if (
                    targetId === "#"
                ) return;

                const target =
                    document.querySelector(
                        targetId
                    );

                if (
                    target
                ) {

                    event.preventDefault();

                    target.scrollIntoView(
                        {
                            behavior:
                                "smooth",
                            block:
                                "start"
                        }
                    );

                }

            }
        );

    });

/* ==========================================
   ACTIVE NAV LINK ON SCROLL
========================================== */

const sections =
    document.querySelectorAll(
        "section[id]"
    );

const navLinks =
    document.querySelectorAll(
        ".navbar a"
    );

function updateActiveLink() {

    let currentSection = "";

    sections.forEach(
        section => {

            const sectionTop =
                section.offsetTop - 150;

            const sectionHeight =
                section.offsetHeight;

            if (
                window.scrollY >=
                    sectionTop &&
                window.scrollY <
                    sectionTop +
                        sectionHeight
            ) {
                currentSection =
                    section.getAttribute(
                        "id"
                    );
            }

        }
    );

    navLinks.forEach(
        link => {

            link.classList.remove(
                "active"
            );

            const href =
                link.getAttribute(
                    "href"
                );

            if (
                href ===
                "#" +
                    currentSection
            ) {
                link.classList.add(
                    "active"
                );
            }

        }
    );

}

window.addEventListener(
    "scroll",
    updateActiveLink
);

/* ==========================================
   PARALLAX HERO EFFECT
========================================== */

const heroSection =
    document.querySelector(
        ".guide-hero"
    );

window.addEventListener(
    "scroll",
    () => {

        if (
            heroSection
        ) {

            const offset =
                window.pageYOffset;

            heroSection.style.backgroundPositionY =
                offset * 0.4 +
                "px";

        }

    }
);

/* ==========================================
   CARD HOVER GLOW EFFECT
========================================== */

document
    .querySelectorAll(
        ".guide-card, .popular-card, .blog-card, .category-card"
    )
    .forEach(card => {

        card.addEventListener(
            "mousemove",
            e => {

                const rect =
                    card.getBoundingClientRect();

                const x =
                    e.clientX -
                    rect.left;

                const y =
                    e.clientY -
                    rect.top;

                card.style.setProperty(
                    "--mouse-x",
                    `${x}px`
                );

                card.style.setProperty(
                    "--mouse-y",
                    `${y}px`
                );

            }
        );

    });

/* ==========================================
   INITIAL ANIMATIONS
========================================== */

window.addEventListener(
    "load",
    () => {

        document
            .querySelectorAll(
                ".category-card, .guide-card, .popular-card, .blog-card"
            )
            .forEach(
                (
                    element,
                    index
                ) => {

                    element.style.animation =
                        `fadeInUp 0.6s ease forwards`;

                    element.style.animationDelay =
                        `${index * 0.08}s`;

                }
            );

    }
);