/* ==========================================
   INFO ALL AI PRO
========================================== */

const API_URL = "http://localhost:3000/chat";

/* ==========================================
   DOM ELEMENTS
========================================== */

const chatBox =
document.getElementById("chatBox");

const userInput =
document.getElementById("userInput");

const sendBtn =
document.getElementById("sendBtn");

const voiceBtn =
document.getElementById("voiceBtn");

const newChatBtn =
document.getElementById("newChatBtn");

const darkModeBtn =
document.getElementById("darkModeBtn");

const exportBtn =
document.getElementById("exportBtn");

const clearBtn =
document.getElementById("clearBtn");

const chatHistory =
document.getElementById("chatHistory");

const typingContainer =
document.getElementById("typingContainer");

/* ==========================================
   APP STATE
========================================== */

let conversations =
JSON.parse(
localStorage.getItem(
"infoall_conversations"
)
) || [];

let activeChatId =
localStorage.getItem(
"activeChatId"
) || null;

/* ==========================================
   USAGE STATISTICS
========================================== */

let stats =
JSON.parse(
localStorage.getItem(
"infoall_stats"
)
) || {

totalMessages:0,

userMessages:0,

aiMessages:0,

totalChats:0,

imagesGenerated:0

};

/* ==========================================
   SAVE STATS
========================================== */

function saveStats(){

localStorage.setItem(

"infoall_stats",

JSON.stringify(stats)

);

}

/* ==========================================
   CREATE NEW CHAT
========================================== */

function createNewChat(){

const chat = {

id: Date.now().toString(),

title:"New Chat",

messages:[],

createdAt:Date.now(),

updatedAt:Date.now(),

pinned:false

};

conversations.unshift(chat);

activeChatId = chat.id;

saveConversations();

renderConversations();

return chat;

}

/* ==========================================
   GET ACTIVE CHAT
========================================== */

function getActiveChat(){

return conversations.find(

c => c.id === activeChatId

);

}

/* ==========================================
   SAVE CONVERSATIONS
========================================== */

function saveConversations(){

localStorage.setItem(

"infoall_conversations",

JSON.stringify(conversations)

);

localStorage.setItem(

"activeChatId",

activeChatId

);

}

/* ==========================================
   SCROLL TO BOTTOM
========================================== */

function scrollBottom(){

chatBox.scrollTop =
chatBox.scrollHeight;

}

/* ==========================================
   AUTO RESIZE TEXTAREA
========================================== */

userInput.addEventListener(

"input",

()=>{

userInput.style.height =
"auto";

userInput.style.height =
userInput.scrollHeight + "px";

}

);

/* ==========================================
   DARK MODE
========================================== */

if(

localStorage.getItem("theme")
=== "light"

){

document.body.classList.add(
"light-mode"
);

}

darkModeBtn?.addEventListener(

"click",

()=>{

document.body.classList.toggle(
"light-mode"
);

localStorage.setItem(

"theme",

document.body.classList.contains(
"light-mode"
)

?

"light"

:

"dark"

);

}

);

/* ==========================================
   NEW CHAT BUTTON
========================================== */

newChatBtn?.addEventListener(

"click",

()=>{

createNewChat();

chatBox.innerHTML="";

renderConversations();

}

);

/* ==========================================
   ENTER TO SEND
========================================== */

userInput?.addEventListener(

"keydown",

(e)=>{

if(

e.key==="Enter"

&&

!e.shiftKey

){

e.preventDefault();

sendMessage();

}

}

);

/* ==========================================
   STARTUP
========================================== */

window.addEventListener(

"load",

()=>{

if(

conversations.length === 0

){

createNewChat();

}

renderConversations();

restoreActiveChat();

userInput.focus();

}

);

console.log(
"🚀 Info All AI Pro Started"
);
/* ==========================================
   MESSAGE RENDERING
========================================== */

function createMessageElement(
role,
content,
timestamp = Date.now()
){

const wrapper =
document.createElement("div");

wrapper.className =
`message ${role}`;

const avatar =
role === "user"
?
"👤"
:
"🤖";

wrapper.innerHTML =

`
<div class="avatar">

${avatar}

</div>

<div class="message-content">

<div class="message-text">

${content}

</div>

<div class="message-footer">

<span class="message-time">

${formatTime(timestamp)}

</span>

${
role === "ai"
?

`<button class="copy-btn">

📋 Copy

</button>`

:

""
}

</div>

</div>
`;

if(role === "ai"){

const copyBtn =

wrapper.querySelector(
".copy-btn"
);

copyBtn.addEventListener(

"click",

()=>{

navigator.clipboard.writeText(
stripHtml(content)
);

copyBtn.textContent =
"✅ Copied";

setTimeout(()=>{

copyBtn.textContent =
"📋 Copy";

},2000);

}

);

}

return wrapper;

}

/* ==========================================
   FORMAT TIME
========================================== */

function formatTime(time){

return new Date(time)
.toLocaleTimeString(
[],
{
hour:"2-digit",
minute:"2-digit"
}
);

}

/* ==========================================
   REMOVE HTML
========================================== */

function stripHtml(text){

const div =
document.createElement("div");

div.innerHTML = text;

return div.textContent;

}

/* ==========================================
   USER MESSAGE
========================================== */

function addUserMessage(text){

const msg = {

role:"user",

content:text,

timestamp:Date.now()

};

const active =
getActiveChat();

active.messages.push(msg);

active.updatedAt =
Date.now();

saveConversations();

stats.totalMessages++;
stats.userMessages++;

saveStats();

const element =

createMessageElement(
"user",
escapeHtml(text),
msg.timestamp
);

chatBox.appendChild(
element
);

scrollBottom();

updateChatTitle();

renderConversations();

}

/* ==========================================
   AI MESSAGE
========================================== */

function addAIMessage(text){

const msg = {

role:"ai",

content:text,

timestamp:Date.now()

};

const active =
getActiveChat();

active.messages.push(msg);

active.updatedAt =
Date.now();

saveConversations();

stats.totalMessages++;
stats.aiMessages++;

saveStats();

const element =

createMessageElement(
"ai",
"",
msg.timestamp
);

chatBox.appendChild(
element
);

const target =

element.querySelector(
".message-text"
);

typeMessage(
target,
text
);

scrollBottom();

}

/* ==========================================
   ESCAPE HTML
========================================== */

function escapeHtml(text){

return text
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;");

}

/* ==========================================
   CHARACTER TYPING EFFECT
========================================== */

function typeMessage(

element,
text

){

let index = 0;

const speed = 12;

function type(){

if(index < text.length){

element.innerHTML +=

text.charAt(index);

index++;

scrollBottom();

setTimeout(
type,
speed
);

}

}

type();

}

/* ==========================================
   SHOW TYPING
========================================== */

function showTyping(){

typingContainer.style.display =
"flex";

scrollBottom();

}

/* ==========================================
   HIDE TYPING
========================================== */

function hideTyping(){

typingContainer.style.display =
"none";

}

/* ==========================================
   IMAGE MESSAGE
========================================== */

function addImageMessage(imageUrl){

const active =
getActiveChat();

active.messages.push({

role:"image",

content:imageUrl,

timestamp:Date.now()

});

saveConversations();

const div =
document.createElement("div");

div.className =
"message ai";

div.innerHTML =

`
<div class="avatar">

🖼️

</div>

<div class="message-content">

<img
src="${imageUrl}"
class="chat-image">

</div>
`;

chatBox.appendChild(div);

scrollBottom();

}

/* ==========================================
   UPDATE CHAT TITLE
========================================== */

function updateChatTitle(){

const active =
getActiveChat();

if(!active) return;

const firstUser =

active.messages.find(

m => m.role === "user"

);

if(firstUser){

active.title =

firstUser.content
.substring(0,35);

saveConversations();

}

}

/* ==========================================
   RESTORE CHAT
========================================== */

function restoreActiveChat(){

const active =
getActiveChat();

if(!active) return;

chatBox.innerHTML = "";

active.messages.forEach(

msg=>{

if(msg.role==="image"){

const div =
document.createElement("div");

div.className =
"message ai";

div.innerHTML =

`
<div class="avatar">🖼️</div>

<div class="message-content">

<img
src="${msg.content}"
class="chat-image">

</div>
`;

chatBox.appendChild(div);

}
else{

const element =

createMessageElement(

msg.role,

msg.content,

msg.timestamp

);

chatBox.appendChild(
element
);

}

}

);

scrollBottom();

}
/* ==========================================
   SEND BUTTON
========================================== */

sendBtn?.addEventListener(
"click",
sendMessage
);

/* ==========================================
   SEND MESSAGE
========================================== */

async function sendMessage(){

const message =
userInput.value.trim();

if(!message) return;

addUserMessage(message);

userInput.value = "";
userInput.style.height = "auto";

showTyping();

try{

const response =

await fetch(

API_URL,

{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
message
})

}

);

if(!response.ok){

throw new Error(
"Server Error"
);

}

const data =
await response.json();

hideTyping();

addAIMessage(

data.reply ||

"Sorry, no response received."

);

}
catch(error){

console.error(error);

hideTyping();

addAIMessage(

"❌ Unable to connect to AI server. Please check your backend."

);

}

}

/* ==========================================
   VOICE SEARCH
========================================== */

voiceBtn?.addEventListener(

"click",

()=>{

if(

!("webkitSpeechRecognition" in window)

){

alert(
"Voice Search Not Supported"
);

return;

}

const recognition =

new webkitSpeechRecognition();

recognition.lang =
"en-US";

recognition.start();

voiceBtn.innerHTML =
"🎙️";

recognition.onresult =

(event)=>{

const transcript =

event.results[0][0]
.transcript;

userInput.value =
transcript;

voiceBtn.innerHTML =
'<i class="fa-solid fa-microphone"></i>';

};

recognition.onend =

()=>{

voiceBtn.innerHTML =
'<i class="fa-solid fa-microphone"></i>';

};

}

);

/* ==========================================
   EXPORT CHAT TXT
========================================== */

exportBtn?.addEventListener(

"click",

()=>{

const active =
getActiveChat();

if(!active) return;

let text = "";

active.messages.forEach(

msg=>{

text +=

`[${msg.role.toUpperCase()}]

${stripHtml(msg.content)}

\n\n`;

}

);

const blob =

new Blob(
[text],
{type:"text/plain"}
);

const link =
document.createElement("a");

link.href =

URL.createObjectURL(
blob
);

link.download =
"InfoAllAI-Chat.txt";

link.click();

}

);

/* ==========================================
   CLEAR CHAT
========================================== */

clearBtn?.addEventListener(

"click",

()=>{

if(

!confirm(
"Clear this chat?"
)

){

return;

}

const active =
getActiveChat();

if(!active) return;

active.messages = [];

saveConversations();

chatBox.innerHTML = "";

}

);

/* ==========================================
   RENDER SIDEBAR
========================================== */

function renderConversations(){

chatHistory.innerHTML="";

conversations

.sort(

(a,b)=>

(b.pinned||0)
-
(a.pinned||0)

||

b.updatedAt-a.updatedAt

)

.forEach(chat=>{

const item =
document.createElement("div");

item.className =
"chat-folder";

if(

chat.id === activeChatId

){

item.classList.add(
"active"
);

}

item.innerHTML =

`
<div class="chat-name">

${chat.title}

</div>

<div class="chat-actions">

<button
onclick="renameChat('${chat.id}')">

✏️

</button>

<button
onclick="pinChat('${chat.id}')">

⭐

</button>

<button
onclick="deleteChat('${chat.id}')">

🗑️

</button>

</div>
`;

item.addEventListener(

"click",

()=>{

loadChat(chat.id);

}

);

chatHistory.appendChild(
item
);

});

}

/* ==========================================
   LOAD CHAT
========================================== */

function loadChat(id){

activeChatId = id;

saveConversations();

restoreActiveChat();

renderConversations();

}

/* ==========================================
   DELETE CHAT
========================================== */

function deleteChat(id){

event.stopPropagation();

if(

!confirm(
"Delete chat?"
)

){

return;

}

conversations =

conversations.filter(

c => c.id !== id

);

saveConversations();

if(

conversations.length===0

){

createNewChat();

}

activeChatId =
conversations[0]?.id;

renderConversations();

restoreActiveChat();

}

/* ==========================================
   RENAME CHAT
========================================== */

function renameChat(id){

event.stopPropagation();

const chat =

conversations.find(

c=>c.id===id

);

if(!chat) return;

const name =

prompt(

"Rename Chat",

chat.title

);

if(!name) return;

chat.title = name;

saveConversations();

renderConversations();

}

/* ==========================================
   PIN CHAT
========================================== */

function pinChat(id){

event.stopPropagation();

const chat =

conversations.find(

c=>c.id===id

);

if(!chat) return;

chat.pinned =

!chat.pinned;

saveConversations();

renderConversations();

}

/* ==========================================
   SEARCH CHATS
========================================== */

const searchBox =

document.querySelector(
".sidebar-search input"
);

searchBox?.addEventListener(

"input",

()=>{

const keyword =

searchBox.value
.toLowerCase();

document
.querySelectorAll(
".chat-folder"
)

.forEach(folder=>{

folder.style.display =

folder.innerText
.toLowerCase()
.includes(keyword)

?

"flex"

:

"none";

});

}

);

/* ==========================================
   AUTO SAVE
========================================== */

setInterval(

()=>{

saveConversations();

},

10000

);

/* ==========================================
   CONNECTION STATUS
========================================== */

window.addEventListener(

"online",

()=>{

console.log(
"🟢 Online"
);

}

);

window.addEventListener(

"offline",

()=>{

console.log(
"🔴 Offline"
);

}

);

console.log(
"🤖 AI Module Loaded"
);
/* ==========================================
   USAGE STATISTICS DASHBOARD
========================================== */

function updateDashboard(){

const totalChats =
conversations.length;

const totalMessages =
stats.totalMessages || 0;

const aiMessages =
stats.aiMessages || 0;

const userMessages =
stats.userMessages || 0;

const dashboard =

document.getElementById(
"statsDashboard"
);

if(!dashboard) return;

dashboard.innerHTML =

`
<div class="stat-card">

<h3>${totalChats}</h3>

<p>Chats</p>

</div>

<div class="stat-card">

<h3>${totalMessages}</h3>

<p>Messages</p>

</div>

<div class="stat-card">

<h3>${userMessages}</h3>

<p>User</p>

</div>

<div class="stat-card">

<h3>${aiMessages}</h3>

<p>AI</p>

</div>
`;

}

/* ==========================================
   FAVORITE CHAT
========================================== */

function favoriteChat(id){

const chat =

conversations.find(
c=>c.id===id
);

if(!chat) return;

chat.favorite =

!chat.favorite;

saveConversations();

renderConversations();

}

/* ==========================================
   FAVORITES LIST
========================================== */

function getFavorites(){

return conversations.filter(

chat=>chat.favorite

);

}

/* ==========================================
   CHAT CATEGORIES
========================================== */

function setCategory(

id,
category

){

const chat =

conversations.find(

c=>c.id===id

);

if(!chat) return;

chat.category =
category;

saveConversations();

}

/* ==========================================
   FILTER CATEGORY
========================================== */

function filterCategory(

category

){

document
.querySelectorAll(
".chat-folder"
)

.forEach(folder=>{

const id =
folder.dataset.id;

const chat =

conversations.find(
c=>c.id===id
);

if(!chat) return;

if(

category==="all"

||

chat.category===category

){

folder.style.display =
"flex";

}else{

folder.style.display =
"none";

}

});

}

/* ==========================================
   IMAGE UPLOAD
========================================== */

const imageBtn =
document.getElementById(
"imageBtn"
);

if(imageBtn){

imageBtn.addEventListener(

"click",

()=>{

const input =

document.createElement(
"input"
);

input.type = "file";

input.accept =
"image/*";

input.click();

input.onchange =

e=>{

const file =

e.target.files[0];

if(!file) return;

const reader =

new FileReader();

reader.onload =

event=>{

addImageMessage(
event.target.result
);

};

reader.readAsDataURL(
file
);

};

}

);

}

/* ==========================================
   IMAGE GALLERY
========================================== */

function openGallery(){

const images = [];

conversations.forEach(chat=>{

chat.messages.forEach(msg=>{

if(
msg.role==="image"
){

images.push(
msg.content
);

}

});

});

console.log(
"Gallery Images:",
images
);

}

/* ==========================================
   EXPORT PDF
========================================== */

function exportPDF(){

window.print();

}

/* ==========================================
   DAILY STATS
========================================== */

function increaseMessageCount(){

stats.totalMessages++;

saveStats();

updateDashboard();

}

/* ==========================================
   TOP USED CHAT
========================================== */

function getTopChat(){

let max = 0;

let top = null;

conversations.forEach(chat=>{

if(

chat.messages.length > max

){

max =
chat.messages.length;

top = chat;

}

});

return top;

}

/* ==========================================
   STORAGE SIZE
========================================== */

function getStorageUsage(){

let total =

JSON.stringify(
conversations
).length;

return (

total / 1024

).toFixed(2);

}

/* ==========================================
   AUTO UPDATE DASHBOARD
========================================== */

setInterval(

()=>{

updateDashboard();

},

5000

);

/* ==========================================
   STARTUP
========================================== */

window.addEventListener(

"load",

()=>{

updateDashboard();

console.log(
"📊 Dashboard Ready"
);

console.log(
"🖼 Image Upload Ready"
);

console.log(
"⭐ Favorites Ready"
);

console.log(
"📁 Categories Ready"
);

}

);