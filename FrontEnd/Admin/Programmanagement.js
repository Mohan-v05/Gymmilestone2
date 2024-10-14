//Courses retrive from Local storage
let programs = [];

const GetAllProgramsURL = "http://localhost:3000/allProgramsData";

const AddNewProgramURL = "http://localhost:3000/allProgramsData";
const UpdateProgramURL = "http://localhost:3000/allProgramsData";
const DeleteProgramURL = "http://localhost:3000/allProgramsData";

const programTableBody = document.querySelector('#programTable tbody');

//Fetch Students Data from Database
async function GetAllPrograms(){
    fetch(GetAllProgramsURL).then((response) => {
        return response.json();
    }).then((data) => {
        programs = data;
        renderPrograms();
    })
};
GetAllPrograms()

//Update Program 
// async function UpdateProgramFee(programId , NewFee){
//     // Update Program
//     await fetch(`${UpdateProgramURL}/${programId}/${NewFee}`, {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json"
//         },
//     });
//     GetAllPrograms();
//     renderPrograms();
// };

// Delete Program From Database
async function DeleteProgram(programId){
    // Delete Course
    await fetch(`${DeleteProgramURL}/${programId}`, {
        method: "DELETE"
    });
};


// Function to render programs in the table
async function renderPrograms() {
    // const allProgramsData = await fetchProgramsData();
    // console.log(allProgramsData);  
    const programTableBody = document.querySelector('#programTable tbody');
    // Check if tableBody exists
    if (!programTableBody) {
        console.error('Table body not found!');
        return;
    }
    programTableBody.innerHTML = ''; // Clear existing rows
    programs.forEach(program => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${program.programId}</td>
            <td>${program.name}</td>
            <td>${program.fee}</td>
            <td>${program.type}</td>
            <td>
                <button class="edit-button" style="background-color: #c9bfaf;" data-id="${program.programId}">Edit</button>
                <button class="delete-button" style="background-color: #ed7272;" data-id="${program.programId}">Delete</button>
            </td>
        `;

        programTableBody.appendChild(row);
    });
}
renderPrograms();

document.getElementById('addProgramButton').addEventListener('click', function() {
    window.location.href = 'Addprogram.html';
});

document.getElementById('goHome').addEventListener('click', function() {
    window.location.href = 'Adminhome.html';
});

   // Edit button click event
//    programTableBody.addEventListener('click', function(event) {
//     if (event.target.classList.contains('edit-button')) {
//         const programId = event.target.dataset.id;
        // localStorage.setItem('editProgramId', programId); // Store ID for editing
//         window.location.href = 'EditProgram.html'; // Redirect to edit page
//     }
// });

// Edit button click event with simple redirection
programTableBody.addEventListener('click', function(event) {
    if (event.target.classList.contains('edit-button')) {
        const programId = event.target.dataset.id; // Get the program ID from the clicked button

        // Redirect to EditProgram.html, passing the programId as a query parameter
        window.location.href = `'EditProgram.html'?programId=${programId}`;
    }
});




 // Search functionality
 document.getElementById('searchButton').addEventListener('click', function() {
    const searchValue = document.getElementById('searchBox').value.trim();
    // console.log(fetchProgramsData);
    fetchProgramsData().then(allProgramsData => {
        const filteredPrograms = allProgramsData.filter(program => program.programId.toString() === searchValue);
        renderPrograms(filteredPrograms);
    });
});

// Delete button click event
programTableBody.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-button')) {
        const programId = parseInt(event.target.dataset.id); // Get the program ID from the button
        const confirmed = confirm('Are you sure you want to delete this program?');

        if (confirmed) {
            // Find the index of the program in the array
            const programIndex = allProgramsData.findIndex(program => program.programId === programId);
            console.log(allProgramsData)
            if (programIndex !== -1) {
                // Remove the program from the array
                allProgramsData.splice(programIndex, 1);

                // Re-render the table with updated data
                renderPrograms();
                alert('Program deleted successfully!');
            } else {
                alert('Program not found!');
            }
        }
    }
});

