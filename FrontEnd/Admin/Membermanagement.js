document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.querySelector('#membersTable tbody');
    // const searchBox = document.getElementById('searchBox');
    const searchButton = document.getElementById('searchButton');
    const addNewMemberButton = document.getElementById('addNewMember');
    const goHomeButton = document.getElementById('goHome');

    const allUsersData_apiUrl = 'http://localhost:5297/api/Member/Get-All-Members';
    const updateUser_URl = 'http://localhost:5297/api/Member/Update-Member/1';
    const getUser_By_Id = 'http://localhost:5297/api/Member/Get-Member-By-ID/1';
    const deleteMemberById_url = 'http://localhost:5297/api/Member/Delete-Member';
    const putMembers = "http://localhost:5297/api/Member/Update-Member";


    let Members = [];

    // Attach event listeners for edit and delete buttons
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', handleEdit);
    });
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', handleDelete);
    });



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
            MembersArray = Members;
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
                        <button class="edit-button" id="openModal" style="background-color: #c9bfaf;" onClick="handleEdit(${member.id})" data-id="${member.id}">Edit</button>
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

    async function deleteMemberById(id) {
        console.log(id)
        const deleteMemberById_url = "http://localhost:5297/api/Member/Delete-Member";

        const response = await fetch(`${deleteMemberById_url}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            console.log(response)
        }
    }

    // Delete button click event
    tableBody.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-button')) {
            const memberId = parseInt(event.target.dataset.id);
            console.log(event.target)
            const confirmed = confirm('Are you sure you want to delete this program?');

            if (confirmed) {

                try {

                    deleteMemberById(memberId)
                    let removerow = document.getElementById(memberId);
                    alert('Member deleted successfully!');
                    window.location.reload();

                } catch (error) {
                    alert('Member not found!');
                }
            }
        }
        if (event.target.classList.contains('edit-button')) {
            const memberId = parseInt(event.target.dataset.id);
            handleEdit(memberId)
        }
    });

    function handleEdit(id) {
        const gymId = id.target.dataset.id;
        fetchData().then(allUsersData => {
            const user = allUsersData.find(u => u.gymId == gymId);
            if (user) {
                window.location.href = 'Updatemember.html';
            }
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
function searchMembers() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    const rows = document.querySelectorAll('#membersTable tbody tr');

    rows.forEach(row => {
        const memberName = row.querySelector('td:nth-child(2)').innerText.toLowerCase();
        const memberId = row.querySelector('td:nth-child(1)').innerText.toLowerCase();
        if (memberName.includes(searchTerm) || memberId.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}