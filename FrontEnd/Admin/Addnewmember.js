document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const subscriptionCheckbox = document.getElementById('subscription');
    const feesInput = document.getElementById('fees');
    const trainingOptionsContainer = document.getElementById('trainingOptions');

    const addMember_url = "http://localhost:5297/api/Member/Add-Member";
    const getAllMember_url = "http://localhost:5297/api/Member/Get-All-Members";
    

    const viewAllPrograms_url="http://localhost:5297/api/Program/Get-All-Programs";


    let programs = []; // Declare programs in the outer scope

    async function loadPrograms() {
        try {
            const response = await fetch(viewAllPrograms_url);
            if (!response.ok) {
                throw new Error('Failed to fetch programs');
            }
            programs = await response.json(); // Store the fetched programs
    
            trainingOptionsContainer.innerHTML = ''; // Clear existing options
    
            programs.forEach(program => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `program_${program.programId}`;
                checkbox.name = 'training';
                checkbox.value = program.name;
    
                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                label.textContent = `${program.programName} - ${program.totalFee} rupees (${program.type})`;
    
                trainingOptionsContainer.appendChild(checkbox);
                trainingOptionsContainer.appendChild(label);
                trainingOptionsContainer.appendChild(document.createElement('br'));
            });
    
            // Add change listeners after programs are loaded
            document.querySelectorAll('input[name="training"]').forEach(checkbox => {
                checkbox.addEventListener('change', calculateFees); // Pass the function reference
            });
    
        } catch (error) {
            console.error('Error loading programs:', error);
        }
    }
    
    function calculateFees() {
        let totalFees = 0;
    
        const selectedTrainings = document.querySelectorAll('input[name="training"]:checked');
        const subscriptionCheckbox = document.querySelector('#subscriptionCheckbox'); // Adjust the selector as needed
        const subscriptionDiscount = subscriptionCheckbox.checked ? 1000 : 0;
        console.log(subscriptionCheckbox);
        console.log(selectedTrainings)
    
        selectedTrainings.forEach(checkbox => {
            const programName = checkbox.value;
            const program = programs.find(p => p.name === programName); // Use the correct property for comparison
            if (program) {
                totalFees += parseInt(program.totalFee, 10);
            }
        });
    
        if (subscriptionCheckbox.checked) {
            totalFees = totalFees * 12 - subscriptionDiscount;
        }
    
        feesInput.value = totalFees + ' rupees';
    }
    loadPrograms();

    subscriptionCheckbox.addEventListener('change', calculateFees);

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const firstname = document.getElementById('fname').value;
        const lastname = document.getElementById('lname').value;
        const nic = document.getElementById('nic').value;
        const dateofbirth = document.getElementById('dob').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const age = document.getElementById('age').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const height = document.getElementById('height').value;
        const weight = document.getElementById('weight').value;
        const training = Array.from(document.querySelectorAll('input[name="training"]:checked')).map(cb => cb.value);
        const subscription = subscriptionCheckbox.checked;
        const fees = feesInput.value;
        const password = document.getElementById('password').value;

        const totalMonthlyFees = training.reduce((sum, programName) => {
            const program = programs.find(p => p.name === programName);
            return sum + (program ? parseInt(program.fee, 10) : 0);
        }, 0);

        const annualFees = subscription ? (totalMonthlyFees * 12 - 1000) : null;

        const memberData = {
            Id: await generateGymId(), // Generate a unique gym ID via API
            FirstName: firstname,
            LastName: lastname,
            Nic: nic,
            DOB:dateofbirth,
            Gender: gender,
            Age:age,
            ContactNumber: phone,
            Email:email,
            address: address,
            Height:height,
            Weight:weight,
            // training: training,
            //subscription: subscription,
            //fees: fees,
            password: password,
            CreationDate: Date.now(),
            // annualFees: annualFees,
            // monthlyFees: subscription ? null : totalMonthlyFees
            MemberStatus:true, 
        };

        try {
            const response = await fetch(addMember_url, { // Replace with your actual endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(memberData)
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            alert('Registration successful!');
            form.reset();
            calculateFees(); // Reset fees to initial state

            // Redirect to MemberManagement page
            window.location.href = 'MemberManagement.html';
        } catch (error) {
            console.error('Error during registration:', error);
            alert('Registration failed. Please try again.');
        }
    });

    document.getElementById('goHome').addEventListener('click', function() {
        window.location.href = 'Adminhome.html'; // Update path as needed
    });
    
    async function generateGymId() {
        try {
            // Fetch the last used gym ID from the API
            const response = await fetch(addMember_url); // Replace with your actual API endpoint
            if (!response.ok) {
                throw new Error(`Failed to fetch the last gym ID. Status: ${response.status}`);
            }
    
            // Parse the response to get the last gym ID
            const data = await response.json();
            const lastId = data.lastGymId || 1000; // Fallback to 1000 if no last ID is provided
    
            // Generate the new gym ID by incrementing the last ID
            const newId = parseInt(lastId, 10) + 1;
    
            return newId;
    
        } catch (error) {
            console.error('Error generating new gym ID:', error);
            return null; // Handle error as appropriate
        }
    }
})
