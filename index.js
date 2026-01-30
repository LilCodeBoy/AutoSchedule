document.addEventListener("DOMContentLoaded", () => {
const loginBtn = document.getElementById("loginbtn");
const signupBtn = document.getElementById("signupbtn");
const displaybtn = document.getElementById("displayname-btn");
const welcomeText = document.getElementById("welcomeback");
const startBtn = document.querySelector('.start-btn');




loginBtn.addEventListener("click", () => {
  window.location.href = "login.html"; 
  });
  signupBtn.addEventListener("click", () => {
  window.location.href = "signup.html"; 
  });

  startBtn.addEventListener ("click", () => {
    window.location.href = "Schedulemake.html";
  });




  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser && currentUser.displayName) {
    loginBtn.style.display = "none";
    signupBtn.style.display = "none";
    
    welcomeText.textContent = `Welcome back, ${currentUser.displayName}`;
    displaybtn.textContent = currentUser.displayName;
    

    welcomeText.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      location.reload();
    });


  } else {
    
    loginbtn.style.display = "inline-block";
    signupbtn.style.display = "inline-block";
    displaybtn.style.display = "none";
    welcomeText.textContent = "";
    
    
  }
});
