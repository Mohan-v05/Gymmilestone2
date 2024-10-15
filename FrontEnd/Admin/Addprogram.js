const addProgram_url = "http://localhost:5297/api/Program/Add-program";
const viewAllPrograms_url="http://localhost:5297/api/Program/Get-All-Programs"
const viewProgramById_url = "${http://localhost:5297/api/Program/Get-Progr-By-ID}/${programId}";
const deleteProgramById_url = "${http://localhost:5297/api/Program/Update-Program}/${programId}";
const updateProgramById_url = "http://localhost:5297/api/Program/Delete-Program/${programId}";

document.getElementById('programregistrationForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('pname').value;
    const fee = document.getElementById('fees').value;
    const type = document.querySelector('input[name="type"]:checked').value;

    
    // Generate unique Program ID

    const programData = {
       
        programName: name,
        type: type,
        totalFee: fee  
      }
    ;


    try {
        const response = await fetch(addProgram_url, { // Updated to POST to the correct API route
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(programData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json().then(data => console.log(data));
        alert('Registration successful! Your Program ID is ' );

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
       // alert('Failed to register program. Please try again.');
    }

    // Clear form fields
    document.getElementById('programregistrationForm').reset();

    // Redirect to Program Management page
   // window.location.href = 'Programmanagement.html'; // Ensure the path is correct
});

document.getElementById('goHome').addEventListener('click', function () {
    window.location.href = 'Adminhome.html'; // Ensure the path is correct
});


