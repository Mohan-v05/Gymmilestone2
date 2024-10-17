document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.querySelector('#membersTable tbody');
    const searchBox = document.getElementById('searchBox');
    const searchButton = document.getElementById('searchButton');
    const addNewMemberButton = document.getElementById('addNewMember');
    const goHomeButton = document.getElementById('goHome');

    const allUsersData_apiUrl ='http://localhost:5297/api/Member/Get-All-Members';
    const updateUser_URl='http://localhost:5297/api/Member/Update-Member/1';
    const getUser_By_Id= 'http://localhost:5297/api/Member/Get-Member-By-ID/1';
    const delete_By_ID='http://localhost:5297/api/Member/Delete-Member/1';


    let Members = [];
  
    //     // Attach event listeners for edit and delete buttons
    //     document.querySelectorAll('.edit-button').forEach(button => {
    //         button.addEventListener('click', handleEdit);
    //     });
    //     document.querySelectorAll('.delete-button').forEach(button => {
    //         button.addEventListener('click', handleDelete);
    //     });
    // }
   

    // Fetch Programs Data from Database and Render Them
    async function GetAllMembers() {
        try {
            const response = await fetch(allUsersData_apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            Members = await response.json()
            
            console.log(Members.result);
           
           
            // Render programs in the table
            if (!tableBody) {
                console.error('Table body not found!');
                return;
            }

            tableBody.innerHTML = '';
            console.log("Hi") ;// Clear existing rows
            MembersArray=Members.result;
            MembersArray.forEach(member => {
                const row = document.createElement('tr');
                row.setAttribute('id', member.id); // Use program.id directly

                row.innerHTML = `
                    <td>${member.id}</td>
                    <td>${member.firstName}</td>
                    <td>${member.lastName}</td>
                    <td>${member.nic}</td>
                    <td>${member.age}</td>
                    <td>${member.height}</td>
                    <td>${member.weight}</td>
                    <td>${member.contactNumber}</td>
                    <td>${member.address}</td>
                    <td>${member.gender}</td>
                    <td>${member.membershiptype}</td>
                   
                    <td>
                        <button class="edit-button" id="openModal" style="background-color: #c9bfaf;" data-id="${member.id}">Edit</button>
                        <button  class="delete-button" style="background-color: #ed7272;" data-id="${member.id}">Delete</button>
                    </td>
                `;

                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }
    GetAllMembers();
    


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

   // renderTable(); // Call to render the table with fetched data
});
