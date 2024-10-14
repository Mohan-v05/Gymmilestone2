const GetAllProgramsURL = "http://localhost:3000/allProgramsData";

const AddNewProgramURL = "http://localhost:3000/allProgramsData";
const UpdateProgramURL = "http://localhost:3000/allProgramsData";
const DeleteProgramURL = "http://localhost:3000/allProgramsData";


document.addEventListener('DOMContentLoaded', function() {
    const programId = GetAllProgramsURL.getItem('editProgramId');
    console.log(programId);
    if (!programId) {
        alert('No program ID found for editing.');
        window.location.href = 'Programmanagement.html';
        return;
    }

    const allProgramsData = JSON.parse(localStorage.getItem('allProgramsData')) || [];
    const program = allProgramsData.find(p => p.programId == programId);

    // if (!program) {
    //     alert('Program not found.');
    //     window.location.href = 'Programmanagement.html';
    //     return;
    // }

    document.getElementById('name').value = program.name;
    document.getElementById('fees').value = program.fee;
    document.getElementById('type').value = program.type;

    document.getElementById('editProgramForm').addEventListener('submit', function(event) {
        event.preventDefault();

        program.name = document.getElementById('name').value;
        program.fee = document.getElementById('fees').value;
        program.type = document.getElementById('type').value;

        const updatedProgramsData = allProgramsData.map(p => p.programId == programId ? program : p);
        localStorage.setItem('allProgramsData', JSON.stringify(updatedProgramsData));

        alert('Program updated successfully!');
        window.location.href = 'Programmanagement.html';
    });

    document.getElementById('goHome').addEventListener('click', function() {
        window.location.href = 'Adminhome.html';
    });
});

// Edit button click event with Fetch API
programTableBody.addEventListener('click', function(event) {
    if (event.target.classList.contains('edit-button')) {
        const programId = event.target.dataset.id;

        // Define the API endpoint and request options
        const apiUrl = `https://your-backend-api.com/programs/${programId}`; // Replace with your actual API URL

        // Send fetch request to get program data (could be GET or POST based on your API)
        fetch(apiUrl, {
            method: 'GET', // Use 'POST' if the API requires a POST request
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Assuming the API returns JSON
        })
        .then(data => {
            console.log('Program data fetched:', data);
            
            // If the fetch is successful, redirect to EditProgram.html
            window.location.href = `EditProgram.html?programId=${programId}`; // Pass the programId as a query parameter
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }
});
