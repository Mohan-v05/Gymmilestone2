const loginUrl = 'Datas.json'; // Point to the local JSON file

document.getElementById('login-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById("username-input").value;
    const password = document.getElementById("password-input").value;

    // Use Fetch API to load data from the local JSON file
    fetch(loginUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Check if the username and password match any entry in the JSON data
            const user = data.adminData.find(user => user.username === username && user.password === password);
            if (user) {
                // Redirect to Admin home if authentication was successful
                window.location.href = "Adminhome.html";
            } else {
                alert("Wrong username or password");
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            alert("An error occurred during login. Please try again.");
        });

    // Reset the form fields
    event.target.reset();
});
