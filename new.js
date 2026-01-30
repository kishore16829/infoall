// ================================
// PREMIUM WEBSITE MAIN SYSTEM
// ================================

window.addEventListener("offline", ()=>{
  alert("You are offline. Some features may not work.");
});

// ===== SEARCH SYSTEM =====
function searchSite(){

  let q = document.getElementById("searchInput").value.trim().toLowerCase();

  if(!q){
    alert("Please enter a keyword");
    return;
  }

  const pages = {
    jee: "jee.html",
    neet: "jee.html",
    career: "career.html",
    college: "best-colleges.html",
    government: "government.html",
    upsc: "government.html"
  };

  for(let key in pages){
    if(q.includes(key)){
      window.location.href = pages[key];
      return;
    }
  }

  alert("No matching content found");
}



// ===== LANGUAGE SYSTEM =====

function setLang(lang){
  localStorage.setItem("lang", lang);
  applyLang(lang);
}

function applyLang(lang){

  document.querySelectorAll("[data-en]").forEach(el=>{

    el.textContent =
      lang==="ta"
      ? el.getAttribute("data-ta")
      : el.getAttribute("data-en");

  });
}



// ===== VOICE SYSTEM =====

function startVoice(){

  if(!("webkitSpeechRecognition" in window)){
    alert("Voice not supported");
    return;
  }

  const rec = new webkitSpeechRecognition();

  rec.lang =
    localStorage.getItem("lang")==="ta"
    ? "ta-IN"
    : "en-US";

  rec.start();

  rec.onresult = e => {
    handleVoice(e.results[0][0].transcript.toLowerCase());
  };

}


function handleVoice(text){

  if(text.includes("jee")){
    speak("Opening JEE page");
    location.href="jee.html";
  }

  else if(text.includes("career")){
    speak("Opening career page");
    location.href="career.html";
  }

  else if(text.includes("college")){
    speak("Opening colleges");
    location.href="best-colleges.html";
  }
   else if(text.includes("about")){
    speak("Opening about");
    location.href="about.html";
  }
   else if(text.includes("exam tips")){
    speak("Opening exam tips");
    location.href="exam.html";
  }
   else if(text.includes("formula")){
    speak("Opening formula");
    location.href="formula.html";
  }

  else{
    speak("Please try again");
  }

}


function speak(msg){

  let sp = new SpeechSynthesisUtterance();

  sp.lang =
    localStorage.getItem("lang")==="ta"
    ? "ta-IN"
    : "en-US";

  sp.text = msg;

  speechSynthesis.speak(sp);
}



// ===== STUDY PLANNER =====

let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];


function saveTasks(){
  localStorage.setItem("studyTasks",JSON.stringify(tasks));
}


function loadTasks(){

  let list = document.getElementById("taskList");
  if(!list) return;

  list.innerHTML="";

  tasks.forEach((t,i)=>{

    let li = document.createElement("li");

    li.innerHTML=`
      ${t.time} - ${t.text}
      <button onclick="deleteTask(${i})">✖</button>
    `;

    list.appendChild(li);

  });

}


function addTask(){

  let t = taskInput.value;
  let time = timeInput.value;

  if(!t || !time){
    alert("Fill all fields");
    return;
  }

  tasks.push({text:t,time});

  saveTasks();
  loadTasks();

  taskInput.value="";
  timeInput.value="";
}


function deleteTask(i){

  tasks.splice(i,1);

  saveTasks();
  loadTasks();
}



// ===== REMINDER =====

function enableReminder(){

  if(!("Notification" in window)){
    alert("Not supported");
    return;
  }

  Notification.requestPermission().then(p=>{

    if(p==="granted"){
      localStorage.setItem("reminder","on");
      alert("Reminder ON");
    }

  });

}


setInterval(()=>{

  if(localStorage.getItem("reminder")!=="on") return;

  let now = new Date();

  if(now.getHours()==18 && now.getMinutes()==0){

    new Notification("📚 Study Time!",{
      body:"Start studying now 💪"
    });

  }

},60000);



// ================================
// REAL AI STUDY COACH
// ================================


function toggleCoach(){

  let box = document.getElementById("ai-coach");

  box.style.display =
    box.style.display==="flex"
    ? "none"
    : "flex";

}



async function sendCoach(){

  let input = document.getElementById("coachText");
  let text = input.value.trim();

  if(!text) return;

  let chat = document.getElementById("coach-chat");


  // User
  chat.innerHTML += `
    <div class="user-msg">${text}</div>
  `;

  input.value="";


  // Loading
  let load = document.createElement("div");
  load.className="ai-msg";
  load.innerText="Typing...";
  chat.appendChild(load);

  chat.scrollTop = chat.scrollHeight;


  try{

    
      let res = await fetch(
  "http://localhost:3000/ask",

      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({message:text})
      }
    );

    let data = await res.json();

    load.remove();

    chat.innerHTML += `
      <div class="ai-msg">${data.reply}</div>
    `;

  }
  catch{

    load.remove();

    chat.innerHTML += `
      <div class="ai-msg">
        ❌ AI Server Offline
      </div>
    `;

  }

  chat.scrollTop = chat.scrollHeight;

}



// ===== STARTUP =====

window.onload = ()=>{

  applyLang(localStorage.getItem("lang")||"en");

  loadTasks();

};
// Show/Hide Scroll Buttons
window.addEventListener("scroll", () => {
  const topBtn = document.getElementById("topBtn");
  const bottomBtn = document.getElementById("bottomBtn");

  if (window.scrollY > 200) {
    topBtn.style.display = "block";
  } else {
    topBtn.style.display = "none";
  }

  if (window.innerHeight + window.scrollY < document.body.offsetHeight - 200) {
    bottomBtn.style.display = "block";
  } else {
    bottomBtn.style.display = "none";
  }
});

// Scroll to Top
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// Scroll to Bottom
function scrollToBottom() {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth"
  });
}
/* ===== MENU CONTROL ===== */

const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");

menuBtn.addEventListener("click", ()=>{

  menu.classList.toggle("active");
  menuBtn.classList.toggle("active");

});
/* MOBILE MENU */

function toggleMenu(){

  const menu = document.getElementById("mobileMenu");

  if(menu.style.right === "0px"){
    menu.style.right = "-100%";
  }else{
    menu.style.right = "0px";
  }

}
