document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('Tlogin-form').addEventListener('submit' , (event)=>{
        event.preventDefault();
        
        const username = document.getElementById("username-input").value;
        const password = document.getElementById("password-input").value;

        console.log("Username:", username);
        console.log("Password:", password);
        
        // Retrieve users from local storage
        const allUsersData = JSON.parse(localStorage.getItem('allUsersData')) || [];
        console.log("All Users Data:", allUsersData);

        // Find the user with the matching username & password
        const foundUser = allUsersData.find(user => user.gymId == username && user.password == password);

        if(foundUser){
            // Save loggedInUser to sessionStorage
            sessionStorage.setItem('loggedInUser', username);
            sessionStorage.setItem('gymId', foundUser.gymId);

            console.log("Login successful, redirecting...");

            // Redirect to customer home page
            window.location.href = "../Trainers/Traineehome.html";
            document.getElementById('login-message').textContent = "Login Successful.";
            document.getElementById('login-message').style.color = 'green';
        } else {
            console.log("Login failed, incorrect username or password.");

            // Display error message
            document.getElementById('login-message').textContent = "Wrong username or password.";
            document.getElementById('login-message').style.color = 'red';
        }

        event.target.reset();
    });
});



