document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.querySelector('#feesTable tbody');
    const searchBox = document.getElementById('searchBox');
    const searchButton = document.getElementById('searchButton');
    const filterByAnnual = document.getElementById('filterAnnual');
    const filterByMonthly = document.getElementById('filterMonthly');
    const goHomeButton = document.getElementById('goHome');

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

    // Function to check if the "Valid Till" date has expired
    function isExpired(validTill) {
        const today = new Date();
        const validTillDate = new Date(validTill);
        return today > validTillDate;
    }

    // Function to render the table with data
    function renderTable(data) {
        tableBody.innerHTML = ''; // Clear the table body

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="10">No data found</td></tr>';
            return;
        }

        data.forEach(user => {
            const paymentType = user.monthlyFees ? 'Monthly' : user.annualFees ? 'Annual' : 'N/A';
            const paidDate = user.date ? formatDate(user.date) : 'N/A';
            const validTill = paidDate !== 'N/A' ? calculateValidTill(user.date, paymentType) : 'N/A';

            const row = document.createElement('tr');

            // Determine if the Pay button should be red and if the Notify button should be visible
            const isPayButtonRed = validTill !== 'N/A' && isExpired(validTill);
            const notifyButtonDisplay = isPayButtonRed ? 'inline-block' : 'none';

            row.innerHTML = `
                <td>${user.gymId}</td>
                <td>${user.name}</td>
                <td>${user.nic}</td>
                <td>${user.phone}</td>
                <td>${user.training.join(', ')}</td>
                <td>${paymentType}</td>
                <td>${user.monthlyFees ? user.monthlyFees : user.annualFees ? user.annualFees : 'N/A'}</td>
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

    // Function to attach event listeners to pay and notify buttons
    function attachEventListeners() {
        document.querySelectorAll('.pay').forEach(button => {
            button.addEventListener('click', handlePay);
        });
        document.querySelectorAll('.notify').forEach(button => {
            button.addEventListener('click', handleNotify);
        });
    }

    function handlePay(event) {
        const gymId = event.target.dataset.id;
        const allUsersData = JSON.parse(localStorage.getItem('allUsersData')) || [];
        const user = allUsersData.find(u => u.gymId == gymId);
        if (user) {
            // Redirect to the registration form with user data for editing
            localStorage.setItem('editUserData', JSON.stringify(user));
            window.location.href = 'Addnewmember.html'; // Change to your registration page URL
        }
    }

    function handleNotify(event) {
        const gymId = event.target.dataset.id;
        let allUsersData = JSON.parse(localStorage.getItem('allUsersData')) || [];

        // Find the user to notify
        const user = allUsersData.find(u => u.gymId == gymId);

        if (user) {
            // Create a notification message
            const notificationMessage = `Remainder!!! ${user.gymId}-- ${user.name}-- Please pay your overdue payments`;

            // Log the notification message
            console.log(notificationMessage);

            // Store notification in localStorage
            let userNotifications = JSON.parse(localStorage.getItem('Notifications')) || [];
            userNotifications.push({
                gymId: user.gymId,
                message: notificationMessage,
                date: new Date().toISOString()
            });
            localStorage.setItem('Notifications', JSON.stringify(userNotifications));

            // Alert the user about the notification
            alert(`Notification sent to ${user.name} (Gym ID: ${user.gymId})`);
        }


    }

    function handleSearch() {
        const query = searchBox.value.trim();
        const allUsersData = JSON.parse(localStorage.getItem('allUsersData')) || [];
        const filteredData = allUsersData.filter(u => u.gymId.toString().includes(query));
        renderTable(filteredData);
    }

    function handleFilter(filterType) {
        const allUsersData = JSON.parse(localStorage.getItem('allUsersData')) || [];
        const filteredData = allUsersData.filter(u => {
            return filterType === 'Annual' ? u.annualFees : u.monthlyFees;
        });
        renderTable(filteredData);
    }

    searchButton.addEventListener('click', handleSearch);
    filterByAnnual.addEventListener('click', () => handleFilter('Annual'));
    filterByMonthly.addEventListener('click', () => handleFilter('Monthly'));

    goHomeButton.addEventListener('click', function () {
        window.location.href = 'Adminhome.html'; // Change 'Adminhome.html' to your home page URL
    });

    // Initial render of the table with all users data
    renderTable(JSON.parse(localStorage.getItem('allUsersData')) || []);
});
