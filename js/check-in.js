// Check-In JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const classInfoContainer = document.getElementById('classInfoContainer');
    const noClassMessage = document.getElementById('noClassMessage');
    const checkInFormContainer = document.getElementById('checkInFormContainer');
    const form = document.getElementById('checkInForm');
    const alertContainer = document.getElementById('alertContainer');

    // Load current class information
    loadCurrentClass();

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const attendeeData = {
            id: Utils.generateId(),
            fullName: formData.get('fullName').trim(),
            company: formData.get('company').trim(),
            email: formData.get('email').trim().toLowerCase(),
            phone: formData.get('phone').trim(),
            futureInterest: formData.has('futureInterest'),
            checkInTime: new Date().toISOString()
        };

        // Validate attendee data
        if (!validateAttendeeData(attendeeData)) {
            return;
        }

        // Check for duplicate registration
        if (isDuplicateRegistration(attendeeData.email)) {
            Utils.showAlert(
                alertContainer,
                '<strong>Warning!</strong> This email address is already registered for this class.',
                'error'
            );
            return;
        }

        // Add attendee to current class
        if (addAttendeeToClass(attendeeData)) {
            Utils.showAlert(
                alertContainer,
                `<strong>Success!</strong> ${attendeeData.fullName} has been checked in successfully.`,
                'success'
            );

            // Reset form
            form.reset();

            // Update class info display
            setTimeout(() => {
                loadCurrentClass();
            }, 1000);
        } else {
            Utils.showAlert(
                alertContainer,
                '<strong>Error!</strong> Failed to register attendee. Please try again.',
                'error'
            );
        }
    });

    // Email validation on blur
    document.getElementById('email').addEventListener('blur', function() {
        const email = this.value.trim();
        if (email && !Utils.validateEmail(email)) {
            Utils.showAlert(
                alertContainer,
                '<strong>Warning!</strong> Please enter a valid email address.',
                'error'
            );
            this.focus();
        }
    });

    // Phone validation on blur
    document.getElementById('phone').addEventListener('blur', function() {
        const phone = this.value.trim();
        if (phone && !Utils.validatePhone(phone)) {
            Utils.showAlert(
                alertContainer,
                '<strong>Warning!</strong> Please enter a valid phone number.',
                'error'
            );
        }
    });
});

function loadCurrentClass() {
    const currentClass = Storage.getCurrentClass();
    const classInfoContainer = document.getElementById('classInfoContainer');
    const noClassMessage = document.getElementById('noClassMessage');
    const checkInFormContainer = document.getElementById('checkInFormContainer');

    if (!currentClass) {
        // No active class
        classInfoContainer.style.display = 'none';
        checkInFormContainer.style.display = 'none';
        noClassMessage.style.display = 'block';
        return;
    }

    // Display class information
    displayClassInfo(currentClass);
    classInfoContainer.style.display = 'block';
    checkInFormContainer.style.display = 'block';
    noClassMessage.style.display = 'none';
}

function displayClassInfo(classInfo) {
    const classDetails = document.getElementById('classDetails');
    const attendeeCount = classInfo.attendees ? classInfo.attendees.length : 0;
    
    classDetails.innerHTML = `
        <div class="class-detail">
            <strong>Class Name</strong>
            ${classInfo.name}
        </div>
        <div class="class-detail">
            <strong>Date</strong>
            ${Utils.formatDate(classInfo.date)}
        </div>
        <div class="class-detail">
            <strong>Time</strong>
            ${Utils.formatTime(classInfo.startTime)} - ${Utils.formatTime(classInfo.endTime)}
        </div>
        <div class="class-detail">
            <strong>Registered Attendees</strong>
            ${attendeeCount}
        </div>
        ${classInfo.description ? `
        <div class="class-detail" style="grid-column: 1 / -1;">
            <strong>Description</strong>
            ${classInfo.description}
        </div>
        ` : ''}
    `;
}

function validateAttendeeData(attendeeData) {
    const alertContainer = document.getElementById('alertContainer');

    // Check required fields
    if (!attendeeData.fullName) {
        Utils.showAlert(alertContainer, '<strong>Error!</strong> Full name is required.', 'error');
        return false;
    }

    if (!attendeeData.email) {
        Utils.showAlert(alertContainer, '<strong>Error!</strong> Email address is required.', 'error');
        return false;
    }

    // Validate email format
    if (!Utils.validateEmail(attendeeData.email)) {
        Utils.showAlert(alertContainer, '<strong>Error!</strong> Please enter a valid email address.', 'error');
        return false;
    }

    // Validate phone format if provided
    if (attendeeData.phone && !Utils.validatePhone(attendeeData.phone)) {
        Utils.showAlert(alertContainer, '<strong>Error!</strong> Please enter a valid phone number.', 'error');
        return false;
    }

    // Validate name length
    if (attendeeData.fullName.length > 100) {
        Utils.showAlert(alertContainer, '<strong>Error!</strong> Full name must be less than 100 characters.', 'error');
        return false;
    }

    // Validate company name length
    if (attendeeData.company && attendeeData.company.length > 100) {
        Utils.showAlert(alertContainer, '<strong>Error!</strong> Company name must be less than 100 characters.', 'error');
        return false;
    }

    return true;
}

function isDuplicateRegistration(email) {
    const currentClass = Storage.getCurrentClass();
    if (!currentClass || !currentClass.attendees) {
        return false;
    }

    return currentClass.attendees.some(attendee => 
        attendee.email.toLowerCase() === email.toLowerCase()
    );
}

function addAttendeeToClass(attendeeData) {
    const currentClass = Storage.getCurrentClass();
    if (!currentClass) {
        return false;
    }

    // Initialize attendees array if it doesn't exist
    if (!currentClass.attendees) {
        currentClass.attendees = [];
    }

    // Add the new attendee
    currentClass.attendees.push(attendeeData);

    // Update the last modified timestamp
    currentClass.lastModified = new Date().toISOString();

    // Save the updated class
    return Storage.saveCurrentClass(currentClass);
}
