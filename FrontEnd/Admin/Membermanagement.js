document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.querySelector('#membersTable tbody');
    const searchBox = document.getElementById('searchBox');
    const searchButton = document.getElementById('searchButton');
    const addNewMemberButton = document.getElementById('addNewMember');
    const goHomeButton = document.getElementById('goHome');

    const allUsersData_apiUrl = "http://localhost:3000/allUsersData";

    async function fetchData() {
        try {
            const response = await fetch(allUsersData_apiUrl); // Update the path to your JSON file
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            return [];
        }
    }

    async function renderTable() {
        const allUsersData = await fetchData();        
       
        // Check if tableBody exists
        if (!tableBody) {
            console.error('Table body not found!');
            return;
        }

        tableBody.innerHTML = '';
        allUsersData.forEach(user => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${user.gymId}</td>
                <td>${user.name}</td>
                <td>${user.nic}</td>
                <td>${user.phone}</td>
                <td>${user.address}</td>
                <td>${user.gender}</td>
                <td>${user.training.join(', ')}</td>
                <td>${user.monthlyFees ? 'Monthly' : user.annualFees ? 'Annual' : 'N/A'}</td>
                <td>
                    <button class="edit-button" style="background-color: #c9bfaf;" data-id="${user.gymId}">Edit</button>
                    <button class="delete-button" style="background-color: #ed7272;" data-id="${user.gymId}">Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Attach event listeners for edit and delete buttons
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', handleEdit);
        });
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', handleDelete);
        });
    }

    function handleEdit(event) {
        const gymId = event.target.dataset.id;
        fetchData().then(allUsersData => {
            const user = allUsersData.find(u => u.gymId == gymId);
            if (user) {
                localStorage.setItem('editUserData', JSON.stringify(user));
                window.location.href = 'Updatemember.html';
            }
        });
    }

    

    function handleDelete(event) {
        const gymId = event.target.dataset.id;
        fetchData().then(allUsersData => {
            let userNotifications = JSON.parse(localStorage.getItem('Notifications')) || [];
            userNotifications.push(gymId);

            localStorage.setItem('Notifications', JSON.stringify(userNotifications));
            const updatedUsersData = allUsersData.filter(u => u.gymId != gymId);
            // You can save the updated data back to a JSON file if needed
            // But normally, you wouldn't save it back to a file in a client-side app
            renderTable(updatedUsersData);
        });
    }

    function handleSearch() {
        const query = searchBox.value.trim();
        fetchData().then(allUsersData => {
            const filteredData = allUsersData.filter(u => u.gymId == query);
            renderTable(filteredData);
        });
    }

    function handleAddNewMember() {
        window.location.href = 'Addnewmember.html';
    }

    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }

    if (addNewMemberButton) {
        addNewMemberButton.addEventListener('click', handleAddNewMember);
    }

    if (goHomeButton) {
        goHomeButton.addEventListener('click', function () {
            window.location.href = 'Adminhome.html';
        });
    }

    renderTable(); // Call to render the table with fetched data
});
