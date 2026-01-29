const form = document.querySelector(".form-box");
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.some(user => user.email === email); 
    if (exists) {
        alert ("Your account already exists. Please go to the login page");
        return;
    }
        users.push({
            email: email,
            password: password

        });

        localStorage.setItem ("users", JSON.stringify(users));

        alert("Your sign up was succesfull, go to the login page");
        window.location.href = "login.html";

          
    });
