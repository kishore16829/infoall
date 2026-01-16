/* ===== Smooth Fade-In on Scroll ===== */
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.15
  }
);

document.querySelectorAll(".card, .intro, .box").forEach(el => {
  el.classList.add("hidden");
  observer.observe(el);
});

/* ===== Back to Top Button ===== */
const backToTop = document.createElement("button");
backToTop.innerText = "↑";
backToTop.className = "back-to-top";
document.body.appendChild(backToTop);

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

/* ===== Hover Elevation Effect ===== */
document.querySelectorAll(".card, .box").forEach(item => {
  item.addEventListener("mouseenter", () => {
    item.style.transform = "translateY(-6px)";
    item.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
  });

  item.addEventListener("mouseleave", () => {
    item.style.transform = "translateY(0)";
    item.style.boxShadow = "0 10px 30px rgba(0,0,0,0.08)";
  });
});
