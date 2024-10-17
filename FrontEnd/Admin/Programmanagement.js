document.addEventListener('DOMContentLoaded', function () {

    const viewAllPrograms_url = "http://localhost:5297/api/Program/Get-All-Programs";
    const viewProgramById_url = "http://localhost:5297/api/Program/Get-Progr-By-ID";
    const updateProgramById_url = "http://localhost:5297/api/Program/Update-Program";
    const deleteProgramById_url = "http://localhost:5297/api/Program/Delete-Program";

    let programs = [];

    const programTableBody = document.querySelector('#programTable tbody');

    // Fetch Programs Data from Database and Render Them
    async function GetAllPrograms() {
        try {
            const response = await fetch(viewAllPrograms_url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            programs = await response.json();
            console.log(programs);

            // Render programs in the table
            if (!programTableBody) {
                console.error('Table body not found!');
                return;
            }

            programTableBody.innerHTML = ''; // Clear existing rows

            programs.forEach(program => {
                const row = document.createElement('tr');
                row.setAttribute('id', program.id); // Use program.id directly

                row.innerHTML = `
                    <td>${program.id}</td>
                    <td>${program.programName}</td>
                    <td>${program.totalFee}</td>
                    <td>${program.type}</td>
                    <td>
                        <button class="edit-button" id="openModal" style="background-color: #c9bfaf;" data-id="${program.id}">Edit</button>
                        <button  class="delete-button" style="background-color: #ed7272;" data-id="${program.id}">Delete</button>
                    </td>
                `;

                programTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }
    GetAllPrograms();
    
    programTableBody.addEventListener('click', function (event) {
        if (event.target.classList.contains('edit-button')) {
    
            // Get the modal and display
            const modal = document.getElementById("programModal");
            modal.style.display = "block";
    
            // Get the close button and its function
            const closeModalBtn = document.getElementsByClassName("close")[0];
    
            // When the user clicks on <span> (x), close the modal
            closeModalBtn.onclick = function () {
                modal.style.display = "none";
            };
    
            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function (event) {
                if (event.target === modal) {
                    modal.style.display = "none";
                }
            };

            console.log("Hi")
    
            const programId = parseInt(event.target.dataset.id);
            const program = programs.find(p => p.id === programId); // Replace with actual program retrieval logic
    
            if (program) {
                // Populate the modal's input fields with program details
                document.getElementById('pname').value = program.programName;
                document.getElementById('fees').value = program.totalFee;
    
                // Set the selected type
                document.querySelector(`input[name="type"][value="${program.type}"]`).checked = true;
            }
    
            // Ensure the previous event listener is removed to avoid multiple triggers
            let updateBtn = document.getElementById('updateBtn');
            updateBtn.replaceWith(updateBtn.cloneNode(true));  // Replaces button to remove all previous event listeners
    
            updateBtn = document.getElementById('updateBtn');  // Get the new update button reference
            updateBtn.addEventListener('click', (event) => UpdateProgramFee(event, programId));
        }
    });
    
    // Update Program 
    async function UpdateProgramFee(event, programId) {
        event.preventDefault();
    
        // Get updated inputs
        const programName = document.getElementById('pname').value;
        const fee = document.getElementById('fees').value;
        const type = document.querySelector('input[name="type"]:checked').value;
    
        // Prepare the data to send to the server
        const updatedProgramData = {
            id: programId,
            totalFee: fee,
            programName : programName
        };

        console.log(updatedProgramData);
    
        const updateProgramById_url = "http://localhost:5297/api/Program/Update-Program";
    
        // Update Program
        await fetch(`${updateProgramById_url}/${updatedProgramData.id}/${updatedProgramData.totalFee}/${updatedProgramData.programName}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedProgramData)
        })
        .then(data => {
            console.log('Success:', data);
            // Once data is successfully updated, fetch the latest program list and re-render the table
          
            // Close the modal
            document.getElementById("programModal").style.display = "none";
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        GetAllPrograms();
    }
    
    document.getElementById('addProgramButton').addEventListener('click', function () {
        window.location.href = 'Addprogram.html';
    });
    
    document.getElementById('goHome').addEventListener('click', function () {
        window.location.href = 'Adminhome.html';
    });
    

    // Delete button click event
    programTableBody.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-button')) {
            const programId = parseInt(event.target.dataset.id);
            console.log(event.target)
            const confirmed = confirm('Are you sure you want to delete this program?');

            if (confirmed) {

                try {

                    deleteProgramById(programId)
                    let removerow = document.getElementById(programId);
                    alert('Program deleted successfully!');
                    window.location.reload();

                } catch (error) {
                    alert('Program not found!');
                }
            }
        }
    });

    async function deleteProgramById(programId) {
        console.log(programId)
        const deleteProgramById_url = "http://localhost:5297/api/Program/Delete-Program";

        const response = await fetch(`${deleteProgramById_url}/${programId}`, { method: 'DELETE' });
        if (response.ok) {
            console.log(response)
        }
    }

})

