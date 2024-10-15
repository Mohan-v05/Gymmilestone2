const addProgram_url = "http://localhost:5297/api/Program/Add-program";
const viewAllPrograms_url="http://localhost:5297/api/Program/Get-All-Programs"
const viewProgramById_url = "${http://localhost:5297/api/Program/Get-Progr-By-ID}/${programId}";
const updateProgramById_url = "${http://localhost:5297/api/Program/Update-Program}/${programId}";
const deleteProgramById_url = "http://localhost:5297/api/Program/Delete-Program/${programId}";

let programs = [];

const programTableBody = document.querySelector('#programTable tbody');

//Fetch Students Data from Database
async function GetAllPrograms(){
    fetch(viewAllPrograms_url).then((response) => {
        return response.json();
    }).then((data) => {
        programs = data;
        console.log(programs);
        renderPrograms(programs);
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
// async function DeleteProgram(programId){
//     // Delete Course
//     await fetch(`${deleteProgramById_url}`, {
//         method: "DELETE"
//     });
// };


// Function to render programs in the table
async function renderPrograms(programs) {
   // const programs = await response.json();
    console.log(programs);  
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
            <td>${program.id}</td>
            <td>${program.programName}</td>
            <td>${program.totalFee}</td>
            <td>${program.type}</td>
            <td>
                <button class="edit-button" style="background-color: #c9bfaf;" data-id="${program.id}">Edit</button>
                <button class="delete-button" style="background-color: #ed7272;" data-id="${program.id}">Delete</button>
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
   programTableBody.addEventListener('click', function(event) {
    if (event.target.classList.contains('edit-button')) {
        const programId = event.target.dataset.id;
        
        window.location.href = 'EditProgram.html'; // Redirect to edit page
    }
});

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
        const programId = parseInt(event.target.dataset.id); 
        console.log(event.target)
        const confirmed = confirm('Are you sure you want to delete this program?');

        if (confirmed) {
           
            try{
                
                deleteProgramById(programId)
                
                // Re-render the table with updated data
                renderPrograms();
                alert('Program deleted successfully!');
            } catch(error) {
                alert('Program not found!');
            }
        }
    }
});

async function deleteProgramById(programId){
    console.log(programId)
    let delURl = "http://localhost:5297/api/Program/Delete-Program"

    const response = await fetch(`${delURl}/${programId}`, { method: 'DELETE' });
                if (response.ok) {
                    console.log(response)
                }
}

