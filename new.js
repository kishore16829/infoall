const btn = document.getElementById("ai-btn");
const box = document.getElementById("ai-box");
const msg = document.getElementById("ai-msg");
const text = document.getElementById("ai-text");

btn.onclick = ()=>{
  box.style.display = "block";
  box.style.animation = "pop .3s ease";
};

function closeAI(){
  box.style.display = "none";
}

function sendAI(){

  let q = text.value.trim();
  if(!q) return;

  msg.innerHTML += `<p><b>You:</b> ${q}</p>`;

  setTimeout(()=>{
    msg.innerHTML += `<p><b>AI:</b> Please explore our learning sections 😊</p>`;
    msg.scrollTop = msg.scrollHeight;
  },500);

  text.value="";
}

/* Animation */
const style = document.createElement("style");
style.innerHTML = `
@keyframes pop{
  from{transform:scale(.7);opacity:0}
  to{transform:scale(1);opacity:1}
}`;
document.head.appendChild(style);
// Search Function
function searchSite(){

  let q = document.getElementById("searchInput").value.toLowerCase();

  if(q.includes("jee") || q.includes("neet")){
    window.location.href="jee.html";
  }

  else if(q.includes("career")){
    window.location.href="career.html";
  }

  else if(q.includes("college")){
    window.location.href="best-colleges.html";
  }

  else if(q.includes("government") || q.includes("upsc")){
    window.location.href="government.html";
  }

  else if(q===""){
    alert("Type something to search");
  }

  else{
    alert("No result found");
  }
}
// Language Switch System

function setLang(lang){

  localStorage.setItem("lang", lang);

  applyLang(lang);
}

function applyLang(lang){

  document.querySelectorAll("[data-en]").forEach(el => {

    if(lang === "ta"){
      el.textContent = el.getAttribute("data-ta");
    }
    else{
      el.textContent = el.getAttribute("data-en");
    }

  });
}

// Load saved language
window.addEventListener("load", () => {

  let savedLang = localStorage.getItem("lang") || "en";

  applyLang(savedLang);

});

