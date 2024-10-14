const allProgramsData_apiUrl = "http://localhost:3000/allProgramsData";

document.getElementById('programregistrationForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const fee = document.getElementById('fees').value;
    const type = document.getElementById('type').value;

    
    // Generate unique Program ID
    const programId = await generateProgramId();

    const programData = {
        programId: programId,
        name: name,
        fee: fee,
        type: type,
        date: Date.now()
    };

    try {
        const response = await fetch(allProgramsData_apiUrl, { // Updated to POST to the correct API route
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(programData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        alert('Registration successful! Your Program ID is ' + programId);

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        alert('Failed to register program. Please try again.');
    }

    // Clear form fields
    document.getElementById('programregistrationForm').reset();

    // Redirect to Program Management page
    window.location.href = 'Programmanagement.html'; // Ensure the path is correct
});

document.getElementById('goHome').addEventListener('click', function () {
    window.location.href = 'Adminhome.html'; // Ensure the path is correct
});

async function generateProgramId() {
    try {
        const response = await fetch(allProgramsData_apiUrl); // Ensure this URL is correct
        if (!response.ok) {
            throw new Error('Failed to fetch the last program ID');
        }

        const allData = await response.json();
        console.log(allData);

        // Ensure allData is an array
        if (!Array.isArray(allData)) {
            throw new Error('Invalid data format: Expected an array');
        }

        // Get the last program from the array
        const lastProgram = allData.length > 0 ? allData[allData.length - 1] : null;

        // Extract the last program ID and increment
        const lastId = lastProgram ? parseInt(lastProgram.programId, 10) : null;
        const newId = lastId ? lastId + 1 : 1000; // Start from 1000 if no last program

        return newId;
    } catch (error) {
        console.error('Error generating program ID:', error);
        return 1000; // Fallback to a default ID of 1000
    }

    
}