document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".display-name-form");
    const input = document.getElementById("displayname");

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        
  


    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const displayName = input.value.trim();

        if (!displayName) {
            alert("Please enter a display name");
            return;
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userIndex = users.findIndex(u => u.email === currentUser.email);

        if (userIndex !== -1) {
            users[userIndex].displayName = displayName;
            localStorage.setItem("users", JSON.stringify(users));
            localStorage.setItem("currentUser", JSON.stringify(users[userIndex]));

            alert("Your Display name has been saved");
            window.location.href = "index.html";
        }
    });
});