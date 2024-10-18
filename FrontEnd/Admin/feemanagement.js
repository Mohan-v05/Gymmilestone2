document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.querySelector('#feesTable tbody');
    const allMembers = document.getElementById('allMembers');
    const filterByAnnual = document.getElementById('filterAnnual');
    const filterByMonthly = document.getElementById('filterMonthly');
    const goHomeButton = document.getElementById('goHome');

    // Modal elements
    const paymentModal = document.getElementById('paymentModal');
    const closeModalButton = document.getElementById('closeModal');
    const confirmPaymentButton = document.getElementById('confirmPayment');

    const API_URL = 'http://localhost:5297/api/Member/Get-All-Members';

    // Function to fetch user data from the API
    async function fetchUserData() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Fetched data:', data); // Log the fetched data
            return data;
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            return [];
        }
    }

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

        return validTillDateObj.toISOString().split('T')[0];
    }

    // Function to check if the "Valid Till" date has expired
    function isExpired(validTill) {
        const today = new Date();
        const validTillDate = new Date(validTill);
        return today > validTillDate;
    }

    // Function to render the table with data
    function renderTable(data) {
        tableBody.innerHTML = '';

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="10">No data found</td></tr>';
            return;
        }

        data.forEach(user => {
            const paymentType = user.monthlyFees ? 'Monthly' : user.annualFees ? 'Annual' : 'N/A';
            const paidDate = user.date ? formatDate(user.date) : 'N/A';
            const validTill = paidDate !== 'N/A' ? calculateValidTill(user.date, paymentType) : 'N/A';

            const row = document.createElement('tr');

            const isPayButtonRed = validTill !== 'N/A' && isExpired(validTill);
            const notifyButtonDisplay = isPayButtonRed ? 'inline-block' : 'none';

            row.innerHTML = `
                <td>${user.gymId}</td>
                <td>${user.name}</td>
                <td>${user.nic}</td>
                <td>${user.phone}</td>
                <td>${user.training.join(', ')}</td>
                <td>${paymentType}</td>
                <td>${user.monthlyFees || user.annualFees || 'N/A'}</td>
                <td>${paidDate}</td>
                <td>${validTill}</td>
                <td>
                    <button class="pays" data-id="${user.gymId}" style="background-color: ${isPayButtonRed ? 'red' : '#00FF00'};">Pay</button>
                    <button class="notify" data-id="${user.gymId}" style="display: ${notifyButtonDisplay};">Notify</button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        attachEventListeners();
    }

    // Attach event listeners to pay and notify buttons
    function attachEventListeners() {
        document.querySelectorAll('.pays').forEach(button => {
            button.addEventListener('click', handlePay);
        });
        document.querySelectorAll('.notify').forEach(button => {
            button.addEventListener('click', handleNotify);
        });
    }

    async function handlePay(event) {
        const gymId = event.target.dataset.id;
        const allUsersData = await fetchUserData();
        const user = allUsersData.find(u => u.gymId == gymId);

        if (user) {
            document.getElementById('memberId').innerText = user.gymId;
            document.getElementById('memberName').innerText = user.name;
            document.getElementById('memberTraining').innerText = user.training.join(', ');
            document.getElementById('totalPayment').innerText = user.monthlyFees || user.annualFees;

            paymentModal.style.display = 'block';
        }
    }

    closeModalButton.addEventListener('click', function () {
        paymentModal.style.display = 'none';
    });

    confirmPaymentButton.addEventListener('click', async function () {
        const gymId = document.getElementById('memberId').innerText;
        const allUsersData = await fetchUserData();
        const user = allUsersData.find(u => u.gymId == gymId);

        if (user) {
            user.date = new Date().toISOString();

            await fetch(`${API_URL}/${gymId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            const payButton = document.querySelector(`.pays[data-id="${gymId}"]`);
            payButton.style.backgroundColor = '#00FF00';

            alert('Payment confirmed for ' + document.getElementById('memberName').innerText);
            paymentModal.style.display = 'none';

            renderTable(await fetchUserData());
        }
    });

    async function handleNotify(event) {
        const gymId = event.target.dataset.id;
        const allUsersData = await fetchUserData();
        
        const user = allUsersData.find(u => u.gymId == gymId);

        if (user) {
            const notificationMessage = `Reminder!!! ${user.gymId}: please pay`;
            console.log(notificationMessage);
            alert(`Notification sent to ${user.name} (Gym ID: ${user.gymId})`);
        }
    }

    async function handleFilter(filterType) {
        const allUsersData = await fetchUserData();
        if (filterType === '') {
            renderTable(allUsersData);
        } else {
            const filteredData = allUsersData.filter(u => {
                return filterType === 'Annual' ? u.annualFees : u.monthlyFees;
            });
            renderTable(filteredData);
        }
    }

    allMembers.addEventListener('click', () => handleFilter(''));
    filterByAnnual.addEventListener('click', () => handleFilter('Annual'));
    filterByMonthly.addEventListener('click', () => handleFilter('Monthly'));

    goHomeButton.addEventListener('click', function () {
        window.location.href = 'Adminhome.html';
    });

    // Initial render of the table with all users data
    (async () => {
        const data = await fetchUserData();
        renderTable(data);
    })();
});

// Search function
function searchMembers() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    const rows = document.querySelectorAll('#feesTable tbody tr');

    rows.forEach(row => {
        const memberName = row.querySelector('td:nth-child(2)').innerText.toLowerCase();
        const memberId = row.querySelector('td:nth-child(1)').innerText.toLowerCase();
        if (memberName.includes(searchTerm) || memberId.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}
