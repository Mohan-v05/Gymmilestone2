document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const subscriptionCheckbox = document.getElementById('subscription');
    const feesInput = document.getElementById('fees').value = '1000';
    const trainingOptionsContainer = document.getElementById('trainingOptions');

    const allUsersData_apiUrl = "http://localhost:3000/allUsersData";
    const GetAllProgramsURL = "http://localhost:3000/allProgramsData";


    async function loadPrograms() {
        try {
            const response = await fetch(GetAllProgramsURL); // Replace with your actual endpoint
            if (!response.ok) {
                throw new Error('Failed to fetch programs');
            }
            const programs = await response.json();
            trainingOptionsContainer.innerHTML = ''; // Clear existing options

            programs.forEach(program => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `program_${program.programId}`;
                checkbox.name = 'training';
                checkbox.value = program.name; // Use program name for value
                
                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                label.textContent = `${program.name} - ${program.fee} rupees (${program.type})`;

                trainingOptionsContainer.appendChild(checkbox);
                trainingOptionsContainer.appendChild(label);
                trainingOptionsContainer.appendChild(document.createElement('br'));
            });

            document.querySelectorAll('input[name="training"]').forEach(checkbox => {
                checkbox.addEventListener('change', calculateFees);
            });
        } catch (error) {
            console.error('Error loading programs:', error);
        }
    }


    function calculateFees() {
        let totalFees = 0;
        console.log(totalFees);
        
        const selectedTrainings = document.querySelectorAll('input[name="training"]:checked');
        const subscriptionDiscount = subscriptionCheckbox.checked ? 2000 : 0;

        selectedTrainings.forEach(checkbox => {
            const programName = checkbox.value;
            const program = programs.find(p => p.name === programName); // Use the fetched programs data
            if (program) {
                totalFees += parseInt(program.fee, 10);
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

        const name = document.getElementById('name').value;
        const nic = document.getElementById('nic').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
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
            gymId: await generateGymId(), // Generate a unique gym ID via API
            name: name,
            nic: nic,
            phone: phone,
            address: address,
            gender: gender,
            training: training,
            subscription: subscription,
            fees: fees,
            password: password,
            date: Date.now(),
            annualFees: annualFees,
            monthlyFees: subscription ? null : totalMonthlyFees
        };

        try {
            const response = await fetch('YOUR_API_ENDPOINT_FOR_REGISTRATION', { // Replace with your actual endpoint
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
    
    
})
