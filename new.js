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

// Voice Assistant (Tamil + English)

function startVoice(){

  if(!('webkitSpeechRecognition' in window)){
    alert("Voice not supported in this browser");
    return;
  }

  const recognition = new webkitSpeechRecognition();

  recognition.lang = localStorage.getItem("lang") === "ta" ? "ta-IN" : "en-US";

  recognition.start();

  recognition.onstart = () => {
    speak("Listening");
  };

  recognition.onresult = (event) => {

    let speech = event.results[0][0].transcript.toLowerCase();

    console.log("User said:", speech);

    handleVoice(speech);

  };

  recognition.onerror = () => {
    speak("Please try again");
  };
}


// Process Commands
function handleVoice(text){

  // English
  if(text.includes("jee")){
    speak("Opening JEE page");
    window.location.href="jee.html";
  }

  else if(text.includes("career")){
    speak("Opening career page");
    window.location.href="career.html";
  }

  else if(text.includes("college")){
    speak("Opening college page");
    window.location.href="best-colleges.html";
  }

  else if(text.includes("government")){
    speak("Opening government exams");
    window.location.href="government.html";
  }

  // Tamil
  else if(text.includes("ஜே") || text.includes("jee")){
    speak("ஜே இ பக்கம் திறக்கப்படுகிறது");
    window.location.href="jee.html";
  }

  else if(text.includes("தொழில்")){
    speak("தொழில் வழிகாட்டி திறக்கப்படுகிறது");
    window.location.href="career.html";
  }

  else if(text.includes("கல்லூரி")){
    speak("சிறந்த கல்லூரிகள் திறக்கப்படுகிறது");
    window.location.href="best-colleges.html";
  }

  else{
    speak("Sorry, I did not understand");
  }

}


// Text to Speech
function speak(msg){

  let speech = new SpeechSynthesisUtterance();

  let lang = localStorage.getItem("lang") || "en";

  speech.lang = lang === "ta" ? "ta-IN" : "en-US";

  speech.text = msg;

  speech.rate = 1;

  window.speechSynthesis.speak(speech);
}
// ===== STUDY PLANNER SYSTEM =====

let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];

function saveTasks(){
  localStorage.setItem("studyTasks", JSON.stringify(tasks));
}

function loadTasks(){
  document.getElementById("taskList").innerHTML = "";

  tasks.forEach((task,index)=>{

    let li = document.createElement("li");

    li.innerHTML = `
      <span>${task.time} - ${task.text}</span>
      <button onclick="deleteTask(${index})">✖</button>
    `;

    document.getElementById("taskList").appendChild(li);
  });
}


// Add Task
function addTask(){

  let text = document.getElementById("taskInput").value;
  let time = document.getElementById("timeInput").value;

  if(text==="" || time===""){
    alert("Please enter task and time");
    return;
  }

  tasks.push({
    text:text,
    time:time
  });

  saveTasks();
  loadTasks();

  document.getElementById("taskInput").value="";
  document.getElementById("timeInput").value="";
}


// Delete Task
function deleteTask(index){

  tasks.splice(index,1);

  saveTasks();
  loadTasks();
}


// Load on start
window.addEventListener("load", loadTasks);
// ===== DAILY REMINDER SYSTEM =====

// Ask permission
function enableReminder(){

  if(!("Notification" in window)){
    alert("Your browser does not support notifications");
    return;
  }

  Notification.requestPermission().then(permission=>{

    if(permission==="granted"){
      alert("Reminder enabled ✅");
      localStorage.setItem("reminder","on");
      scheduleReminder();
    }
    else{
      alert("Please allow notifications");
    }

  });

}


// Schedule daily reminder
function scheduleReminder(){

  if(localStorage.getItem("reminder")!=="on") return;

  setInterval(()=>{

    let now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();

    // Reminder Time (Change if needed)
    if(hours===18 && minutes===0){

      new Notification("📚 Study Time!",{
        body:"Time to revise your tasks. Stay focused 💪",
        icon:"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
      });

    }

  },60000); // Check every minute

}


// Auto Start Reminder
window.addEventListener("load",()=>{

  if(localStorage.getItem("reminder")==="on"){
    scheduleReminder();
  }

});
