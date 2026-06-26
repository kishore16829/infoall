function signup(){

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

auth

.createUserWithEmailAndPassword(
email,
password
)

.then(()=>{

alert(
"Account Created Successfully"
);

window.location.href =
"login.html";

})

.catch(error=>{

alert(error.message);

});

}

function login(){

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

auth

.signInWithEmailAndPassword(
email,
password
)

.then(()=>{

alert(
"Login Successful"
);

window.location.href =
"index.html";

})

.catch(error=>{

alert(error.message);

});

}

/* Auto Login */

auth.onAuthStateChanged(

(user)=>{

if(user){

console.log(
"Logged In:",
user.email
);

}

}

);
const provider =
new firebase.auth.GoogleAuthProvider();

document
.getElementById(
"googleLoginBtn"
)
?.addEventListener(

"click",

()=>{

auth

.signInWithPopup(
provider
)

.then((result)=>{

const user =
result.user;

alert(

"Welcome " +

user.displayName

);

window.location.href =
"index.html";

})

.catch((error)=>{

alert(
error.message
);

});

});
auth.onAuthStateChanged(

(user)=>{

if(user){

const photo =

document.getElementById(
"userPhoto"
);

const name =

document.getElementById(
"userName"
);

if(photo)
photo.src =
user.photoURL;

if(name)
name.innerText =
user.displayName;

}

});