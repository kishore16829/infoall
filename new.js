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
