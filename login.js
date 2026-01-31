function login(){

  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  const msg = document.getElementById("msg");

  if(!user || !pass){
    msg.style.color="red";
    msg.textContent="Fill all fields";
    return;
  }

  // demo credentials
  if(user === "admin" && pass === "1234"){
    localStorage.setItem("user", user);
    msg.style.color="green";
    msg.textContent="Login success!";

    setTimeout(()=>{
      window.location.href="index.html";
    },800);
  }else{
    msg.style.color="red";
    msg.textContent="Invalid login";
  }
}
