//Trainee Profile View
const allUsersData = JSON.parse(localStorage.getItem("allUsersData"));
const gymId = JSON.parse(sessionStorage.getItem('gymId'));
const user = allUsersData.find(s => s.gymId == gymId);

document.addEventListener("DOMContentLoaded", () => {
   
    if (user) {
        document.getElementById("NIC").value = user.nic;
        document.getElementById("Name").value = user.name;
        document.getElementById("address").value = user.address;
        document.getElementById("phonenumber").value = user.phone;
        document.getElementById("gender").value = user.gender;
    }

    document.getElementById('update-button').addEventListener("click", () => {
        document.getElementById("NIC").disabled = false;
        document.getElementById("Name").disabled = false;
        document.getElementById("address").disabled = false;
        document.getElementById("phonenumber").disabled = false;
        document.getElementById("gender").disabled = false;

        document.getElementById('update-button').style.display = 'none';
        document.getElementById('save-button').style.display = 'block';
        document.getElementById('Cancel-button').style.display = 'block';
    });

    document.getElementById('save-button').addEventListener('click', () => {
        const nic = document.getElementById("NIC").value;
        const name = document.getElementById("Name").value;
        const address = document.getElementById("address").value;
        const phone = document.getElementById("phonenumber").value;
        const gender = document.getElementById("gender").value;

        user.nic = nic;
        user.name = name;
        user.address = address;
        user.phone = phone;
        user.gender = gender;

        document.getElementById("NIC").disabled = true;
        document.getElementById("Name").disabled = true;
        document.getElementById("address").disabled = true;
        document.getElementById("phonenumber").disabled = true;
        document.getElementById("gender").disabled = true;

        document.getElementById('update-button').style.display = 'block';
        document.getElementById('save-button').style.display = 'none';
        document.getElementById('Cancel-button').style.display = 'none';

        localStorage.setItem('allUsersData', JSON.stringify(allUsersData));
    });

    document.getElementById('Cancel-button').addEventListener('click', () => {
        document.getElementById("NIC").disabled = true;
        document.getElementById("Name").disabled = true;
        document.getElementById("address").disabled = true;
        document.getElementById("phonenumber").disabled = true;
        document.getElementById("gender").disabled = true;

        document.getElementById('update-button').style.display = 'block';
        document.getElementById('save-button').style.display = 'none';
        document.getElementById('Cancel-button').style.display = 'none';
    });
});


document.addEventListener("DOMContentLoaded", () => {
    console.log('DOM fully loaded and parsed');



   

    document.getElementById('update-password').addEventListener('click', () => {
        const oldPasswordInput = document.getElementById('oldPassword').value.trim();
        const newPasswordInput = document.getElementById('newPassword').value.trim();
        const confirmPasswordInput = document.getElementById('confirmPassword').value.trim();

        console.log('Entered Old Password:', oldPasswordInput);
        console.log('Stored User Password:', user ? user.password : 'User not found');
        console.log('Entered New Password:', newPasswordInput);
        console.log('Entered Confirm Password:', confirmPasswordInput);

        if (user) {
            if (user.password === oldPasswordInput) {
                if (newPasswordInput === confirmPasswordInput) {
                    user.password = newPasswordInput;
                    localStorage.setItem('user', JSON.stringify(allUsersData));
                    alert('Password Changed Successfully');
                } else {
                    alert('New Password and Confirm Password do not match');
                }
            } else {
                alert('Old Password is incorrect');
            }
        } else {
            alert('User not found');
        }
    });
});


//Notification

document.addEventListener("DOMContentLoaded", () => {
    const notificationIcon = document.querySelector('.message img'); // Change this selector to match your notification icon
    const notificationModal = document.getElementById('notificationModal');
    const notificationList = document.getElementById('notification-list');
    const closeModalButton = document.querySelector('.modal .close');

    function loadNotifications() {
        const notifications = JSON.parse(localStorage.getItem('Notifications')) || [];
        const gymId = JSON.parse(sessionStorage.getItem('gymId')); // Get the current user's gym ID
        notificationList.innerHTML = '';

        notifications.forEach(notification => {
            if (notification.gymId == gymId) {
                const listItem = document.createElement('li');
                listItem.textContent = notification.message;
                notificationList.appendChild(listItem);
            }
        });

        // Show modal if there are notifications
        if (notificationList.children.length > 0) {
            notificationModal.style.display = 'block';
        }
    }

    // Show notifications modal
    notificationIcon.addEventListener('click', () => {
        loadNotifications();
    });

    // Close the modal
    closeModalButton.addEventListener('click', () => {
        notificationModal.style.display = 'none';
    });

    // Close the modal if the user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target === notificationModal) {
            notificationModal.style.display = 'none';
        }
    });
});



