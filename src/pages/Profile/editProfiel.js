document.addEventListener("DOMContentLoaded", function() {
    const editBtn = document.getElementById("profile-edit-btn");
    const saveBtn = document.getElementById("save-profile-btn");
    const formInputs = document.querySelectorAll("#profile-form input");

    // Function to enable editing mode
    function enableEditMode() {
        formInputs.forEach(input => {
            input.removeAttribute("readonly");
        });
        editBtn.classList.add("d-none");
        saveBtn.classList.remove("d-none");
    }

    // Function to disable editing mode
    function disableEditMode() {
        formInputs.forEach(input => {
            input.setAttribute("readonly", true);
        });
        editBtn.classList.remove("d-none");
        saveBtn.classList.add("d-none");
    }

    // Toggle edit mode when clicking "Edit Profile" button
    editBtn.addEventListener("click", enableEditMode);

    // Handle form submission (save profile)
    document.getElementById("profile-form").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent form submission
        // Add logic here to save the profile (send data to server, etc.)
        // Once the profile is saved, disable edit mode
        disableEditMode();
    });
});
