document.addEventListener('DOMContentLoaded', function () {
    // Retrieve data from local storage
    const allUsersData = JSON.parse(localStorage.getItem('allUsersData')) || [];
    const allProgramsData = JSON.parse(localStorage.getItem('allProgramsData')) || [];

    const searchInput = document.querySelector('.searchbar input');
    const searchButton = document.querySelector('.searchbtn img');
    const formContainer = document.getElementById('form-container');
    const MembersCount = document.getElementById("MembersCount");
    const ProgramCount = document.getElementById("ProgramCount");
    MembersCount.innerHTML = allUsersData.length;
    ProgramCount.innerHTML = allProgramsData.length;



    // Program distribution for pie chart
    const programCounts = {};
    allProgramsData.forEach(program => {
        const count = allUsersData.filter(member => member.training.includes(program.name)).length;
        programCounts[program.name] = count;
    });

    const ctxPie = document.getElementById('programPieChart').getContext('2d');
    new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: Object.keys(programCounts),
            datasets: [{
                label: 'Program Distribution',
                data: Object.values(programCounts),
                backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
            }]
        },
        options: {
            responsive: true
        }
    });

    // Gender distribution for bar chart
    const genderCounts = {
        Male: allUsersData.filter(member => member.gender === 'male').length,
        Female: allUsersData.filter(member => member.gender === 'female').length
    };

    const ctxBar = document.getElementById('genderBarChart').getContext('2d');
    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Male', 'Female'],
            datasets: [{
                label: 'Number of Members',
                data: [genderCounts.Male, genderCounts.Female],
                backgroundColor: ['#36A2EB', '#FF6384']
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Function to format date to YYYY-MM-DD
    function formatDate(date) {
        const dateObj = new Date(date);
        return dateObj.toISOString().split('T')[0];
    }

    // Function to calculate the "Valid Till" date
    function calculateValidTill(paidDate, paymentType) {
        const paidDateObj = new Date(paidDate);
        let validTillDateObj;

        if (paymentType === 'Annual') {
            validTillDateObj = new Date(paidDateObj.setFullYear(paidDateObj.getFullYear() + 1));
        } else if (paymentType === 'Monthly') {
            validTillDateObj = new Date(paidDateObj.setMonth(paidDateObj.getMonth() + 1));
        } else {
            return 'N/A';
        }

        return validTillDateObj.toISOString().split('T')[0]; // Return date in YYYY-MM-DD format
    }

    // Function to display member details in forms
    function displayMemberDetails(member) {
        // Fill personal details form
        document.getElementById('name').value = member.name || '';
        document.getElementById('nic').value = member.nic || '';
        document.getElementById('address').value = member.address || '';
        document.getElementById('phone').value = member.phone || '';
        document.getElementById('gender').value = member.gender || '';

        // Fill course details form
        document.getElementById('programid').value = member.gymId || '';
        document.getElementById('programs').value = member.training.join(', ') || '';

        // Fill payment details form
        const paymentType = member.annualFees ? 'Annual' : 'Monthly';
        document.getElementById('paytype').value = paymentType;

        const fee = member.annualFees || member.monthlyFees;
        document.getElementById('fee').value = fee ? fee + ' rupees' : 'Not applicable';

        // Convert timestamp to date format
        const paidDate = formatDate(member.date);
        document.getElementById('joindate').value = paidDate;

        // Calculate and set Paid Date and Valid Till
        document.getElementById('lastpaid').value = paidDate;
        document.getElementById('validtill').value = calculateValidTill(member.date, paymentType);
    }

    function displayIncomeReportDetails(member) {
        const counts = {
            annual: 0,
            monthly: 0
        };

        member.forEach(member => {
            if (member.paymentType === "Annual") {
                counts.annual += 1;
            } else if (member.paymentType === "Monthly") {
                counts.monthly += 1;
            }
        });

        return counts;

    }


    // Function to search member by ID
    function searchMemberById(id) {
        const allUsersData = JSON.parse(localStorage.getItem('allUsersData')) || [];
        const member = allUsersData.find(user => user.gymId === parseInt(id));

        if (member) {
            displayMemberDetails(member);
        } else {
            formContainer.innerHTML = `<p>No member found with Gym ID: ${id}</p>`;
        }
    }

    // Event listener for the search button
    searchButton.addEventListener('click', function () {
        const searchId = searchInput.value.trim();
        if (searchId) {
            searchMemberById(searchId);
        } else {
            formContainer.innerHTML = '<p>Please enter a Gym ID to search.</p>';
        }
    });

    // Optionally, add an event listener for pressing Enter in the search input
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
});
