/* =========================
   PAGE LOADER EFFECT
========================= */
window.addEventListener("load", () => {
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 1.2s ease-in-out";
    setTimeout(() => {
        document.body.style.opacity = "1";
    }, 200);

    console.log("🔥 AK Wikipedia Loaded Successfully");
});

/* =========================
   SMOOTH SCROLL (NAV)
========================= */
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

/* =========================
   ACTIVE NAV HIGHLIGHT
========================= */
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (pageYOffset >= sectionTop) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }
    });
});

/* =========================
   SCROLL REVEAL ANIMATION
========================= */
const revealElements = document.querySelectorAll("section, h2, h3");

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;

    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }
    });
};

// Initial styles
revealElements.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    el.style.transition = "all 0.8s ease";
});

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

/* =========================
   BACK TO TOP BUTTON
========================= */
const topBtn = document.createElement("button");
topBtn.innerText = "⬆";
topBtn.style.position = "fixed";
topBtn.style.bottom = "30px";
topBtn.style.right = "30px";
topBtn.style.padding = "12px 15px";
topBtn.style.fontSize = "18px";
topBtn.style.border = "none";
topBtn.style.borderRadius = "50%";
topBtn.style.background = "#ffd700";
topBtn.style.color = "#000";
topBtn.style.cursor = "pointer";
topBtn.style.display = "none";
topBtn.style.boxShadow = "0 0 15px rgba(255,215,0,0.8)";
topBtn.style.zIndex = "999";

document.body.appendChild(topBtn);

window.addEventListener("scroll", () => {
    topBtn.style.display = window.scrollY > 400 ? "block" : "none";
});

topBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

/* =========================
   IMAGE GLOW ON HOVER
========================= */
const heroImage = document.querySelector("header img");

if (heroImage) {
    heroImage.addEventListener("mouseenter", () => {
        heroImage.style.boxShadow = "0 0 60px rgba(0,229,255,1)";
    });

    heroImage.addEventListener("mouseleave", () => {
        heroImage.style.boxShadow = "0 0 30px rgba(255,215,0,0.8)";
    });
}

/* =========================
   FOOTER YEAR AUTO UPDATE
========================= */
const footerText = document.querySelector("footer p");
if (footerText) {
    footerText.innerH
// ============================
// SMOOTH SCROLL FOR NAV LINKS
// ============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ============================
// CREATE BACK TO TOP BUTTON
// ============================
const backToTop = document.createElement('button');
backToTop.textContent = "⬆ Back to Top";
backToTop.classList.add('back-to-top');
backToTop.style.position = 'fixed';
backToTop.style.bottom = '30px';
backToTop.style.right = '30px';
backToTop.style.display = 'none';
document.body.appendChild(backToTop);

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Show button when scrolled down
window.addEventListener('scroll', () => {
    if(window.scrollY > 200) {
        backToTop.style.display = 'block';
    } else {
        backToTop.style.display = 'none';
    }
});
