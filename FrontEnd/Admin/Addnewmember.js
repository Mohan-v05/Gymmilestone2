document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const subscriptionCheckbox = document.getElementById('subscription');
    const feesInput = document.getElementById('fees');
    const trainingOptionsContainer = document.getElementById('trainingOptions');

    function loadPrograms() {
        const programs = JSON.parse(localStorage.getItem('allProgramsData')) || [];
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
    }

    function calculateFees() {
        let totalFees = 0;
        
        const selectedTrainings = document.querySelectorAll('input[name="training"]:checked');
        const subscriptionDiscount = subscriptionCheckbox.checked ? 1000 : 0;

        selectedTrainings.forEach(checkbox => {
            const programName = checkbox.value;
            const program = JSON.parse(localStorage.getItem('allProgramsData')).find(p => p.name === programName);
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

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const nic = document.getElementById('nic').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const training = Array.from(document.querySelectorAll('input[name="training"]:checked')).map(cb => cb.value); // Use training names
        const subscription = subscriptionCheckbox.checked;
        const fees = feesInput.value;
        const password = document.getElementById('password').value;

        const totalMonthlyFees = training.reduce((sum, programName) => {
            const program = JSON.parse(localStorage.getItem('allProgramsData')).find(p => p.name === programName);
            return sum + (program ? parseInt(program.fee, 10) : 0);
        }, 0);

        const annualFees = subscription ? (totalMonthlyFees * 12 - 1000) : null;

        const memberData = {
            gymId: generateGymId(), // Generate a unique gym ID
            name: name,
            nic: nic,
            phone: phone,
            address: address,
            gender: gender,
            training: training, // Store training names
            subscription: subscription,
            fees: fees,
            password: password,
            date: Date.now(),
            annualFees: annualFees,
            monthlyFees: subscription ? null : totalMonthlyFees
        };

        const allUsersData = JSON.parse(localStorage.getItem('allUsersData')) || [];
        allUsersData.push(memberData);
        localStorage.setItem('allUsersData', JSON.stringify(allUsersData));
        
        alert('Registration successful!');
        form.reset();
        calculateFees(); // Reset fees to initial state

        // Redirect to MemberManagement page
        window.location.href = 'MemberManagement.html';
    });

    document.getElementById('goHome').addEventListener('click', function() {
        window.location.href = 'Adminhome.html'; // Update path as needed
    });
    
    function generateGymId() {
        const lastId = localStorage.getItem('lastGymId');
        const newId = lastId ? parseInt(lastId, 10) + 1 : 1000; // Starting ID from 1000
        localStorage.setItem('lastGymId', newId);
        return newId;
    }
});
