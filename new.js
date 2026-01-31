// SEARCH
function searchSite(){
  let q = document.getElementById("searchInput").value.trim().toLowerCase();
  if(!q) return alert("Enter keyword");

  const pages = {
    jee:"jee.html",
    neet:"jee.html",
    career:"career.html",
    college:"best-colleges.html",
    government:"government.html",
    upsc:"government.html"
  };

  for(let k in pages){
    if(q.includes(k)){
      location.href = pages[k];
      return;
    }
  }

  alert("No matching content found");
}

// LANGUAGE
function setLang(lang){
  localStorage.setItem("lang",lang);
}

// ===== VOICE SYSTEM =====

function startVoice(){

  if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
    alert("Voice recognition not supported in this browser");
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = localStorage.getItem("lang") === "ta" ? "ta-IN" : "en-US";
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.start();
  speak("Listening");

  recognition.onresult = function (event) {
    const text = event.results[0][0].transcript.toLowerCase();
    console.log("Voice:", text);
    handleVoice(text);
  };

  recognition.onerror = function () {
    speak("Sorry, I didn't catch that");
  };
}

function handleVoice(text){

  if(text.includes("jee")){
    speak("Opening JEE page");
    location.href="jee.html";
  }
  else if(text.includes("neet")){
    speak("Opening NEET page");
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
  else if(text.includes("government") || text.includes("upsc")){
    speak("Opening government exams");
    location.href="government.html";
  }
  else if(text.includes("exam")){
    speak("Opening exam tips");
    location.href="exam.html";
  }
  else if(text.includes("formula")){
    speak("Opening formulas");
    location.href="formulamain.html";
  }
  else if(text.includes("home")){
    speak("Going home");
    location.href="index.html";
  }
  else{
    speak("Command not recognized");
  }
}

function speak(msg){

  const speech = new SpeechSynthesisUtterance(msg);
  speech.lang = localStorage.getItem("lang") === "ta" ? "ta-IN" : "en-US";
  speech.rate = 1;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}


// STUDY PLANNER
let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];

function saveTasks(){
  localStorage.setItem("studyTasks",JSON.stringify(tasks));
}

function loadTasks(){
  const list = document.getElementById("taskList");
  if(!list) return;
  list.innerHTML="";

  tasks.forEach((t,i)=>{
    let li=document.createElement("li");
    li.innerHTML = `${t.time} - ${t.text} <button onclick="deleteTask(${i})">✖</button>`;
    list.appendChild(li);
  });
}

function addTask(){
  let t = taskInput.value;
  let time = timeInput.value;
  if(!t||!time) return alert("Fill all fields");

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

function enableReminder(){
  alert("Reminder Enabled");
}

// SCROLL
window.addEventListener("scroll",()=>{
  topBtn.style.display = scrollY>200?"block":"none";
  bottomBtn.style.display = (innerHeight+scrollY < document.body.scrollHeight-200)?"block":"none";
});

function scrollToTop(){scrollTo({top:0,behavior:"smooth"});}
function scrollToBottom(){scrollTo({top:document.body.scrollHeight,behavior:"smooth"});}

// MENU
window.onload=()=>{
  loadTasks();
  const menuBtn=document.getElementById("menuBtn");
  const menu=document.getElementById("menu");

  menuBtn.addEventListener("click",()=>{
    menu.classList.toggle("active");
    menuBtn.classList.toggle("active");
  });
};
