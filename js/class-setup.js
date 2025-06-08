// Class Setup JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('classSetupForm');
    const alertContainer = document.getElementById('alertContainer');

    // Set default date to today
    const dateInput = document.getElementById('classDate');
    dateInput.value = Utils.getCurrentDate();

    // Set default start time to current time rounded to next hour
    const startTimeInput = document.getElementById('startTime');
    const now = new Date();
    now.setHours(now.getHours() + 1, 0, 0, 0);
    startTimeInput.value = now.toTimeString().slice(0, 5);

    // Set default end time to 2 hours after start time
    const endTimeInput = document.getElementById('endTime');
    now.setHours(now.getHours() + 1);
    endTimeInput.value = now.toTimeString().slice(0, 5);

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const classData = {
            id: Utils.generateId(),
            name: formData.get('className').trim(),
            date: formData.get('classDate'),
            startTime: formData.get('startTime'),
            endTime: formData.get('endTime'),
            description: formData.get('description').trim(),
            attendees: [],
            createdAt: new Date().toISOString()
        };

        // Validate form data
        if (!validateClassData(classData)) {
            return;
        }

        // Check for existing active class
        const existingClass = Storage.getCurrentClass();
        if (existingClass) {
            const confirmReplace = confirm(
                `There is already an active class "${existingClass.name}" scheduled for ${Utils.formatDate(existingClass.date)}.\n\n` +
                'Creating a new class will archive the current one. Do you want to continue?'
            );

            if (!confirmReplace) {
                return;
            }

            // Archive the existing class
            archiveCurrentClass(existingClass);
        }

        // Save the new class
        if (Storage.saveCurrentClass(classData)) {
            Utils.showAlert(
                alertContainer,
                `<strong>Success!</strong> Class "${classData.name}" has been created successfully.`,
                'success'
            );

            // Reset form
            form.reset();
            
            // Set defaults again
            dateInput.value = Utils.getCurrentDate();
            const newNow = new Date();
            newNow.setHours(newNow.getHours() + 1, 0, 0, 0);
            startTimeInput.value = newNow.toTimeString().slice(0, 5);
            newNow.setHours(newNow.getHours() + 1);
            endTimeInput.value = newNow.toTimeString().slice(0, 5);

            // Redirect to check-in page after 2 seconds
            setTimeout(() => {
                window.location.href = 'check-in.html';
            }, 2000);
        } else {
            Utils.showAlert(
                alertContainer,
                '<strong>Error!</strong> Failed to save class data. Please try again.',
                'error'
            );
        }
    });

    // Validate end time when start time changes
    startTimeInput.addEventListener('change', function() {
        const startTime = this.value;
        const endTime = endTimeInput.value;

        if (startTime && endTime && startTime >= endTime) {
            const [hours, minutes] = startTime.split(':');
            const newEndTime = new Date();
            newEndTime.setHours(parseInt(hours) + 1, parseInt(minutes));
            endTimeInput.value = newEndTime.toTimeString().slice(0, 5);
        }
    });

    // Validate start time when end time changes
    endTimeInput.addEventListener('change', function() {
        const startTime = startTimeInput.value;
        const endTime = this.value;

        if (startTime && endTime && endTime <= startTime) {
            Utils.showAlert(
                alertContainer,
                '<strong>Warning!</strong> End time must be after start time.',
                'error'
            );
        }
    });
});

function validateClassData(classData) {
    const alertContainer = document.getElementById('alertContainer');

    // Check required fields
    if (!classData.name) {
        Utils.showAlert(alertContainer, '<strong>Error!</strong> Class name is required.', 'error');
        return false;
    }

    if (!classData.date) {
        Utils.showAlert(alertContainer, '<strong>Error!</strong> Class date is required.', 'error');
        return false;
    }

    if (!classData.startTime) {
        Utils.showAlert(alertContainer, '<strong>Error!</strong> Start time is required.', 'error');
        return false;
    }

    if (!classData.endTime) {
        Utils.showAlert(alertContainer, '<strong>Error!</strong> End time is required.', 'error');
        return false;
    }    // Validate date and time are not in the past
    const today = new Date();
    const todayDateString = today.getFullYear() + '-' + 
                           String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                           String(today.getDate()).padStart(2, '0');
    
    // Compare date strings to avoid timezone issues
    if (classData.date < todayDateString) {
        Utils.showAlert(
            alertContainer,
            '<strong>Error!</strong> Class date cannot be in the past.',
            'error'
        );
        return false;
    }

    // If it's today, check that the start time is not in the past
    if (classData.date === todayDateString) {
        const [startHours, startMinutes] = classData.startTime.split(':');
        const classStartDateTime = new Date();
        classStartDateTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);
        
        // Allow classes to be created if they start within the next 15 minutes or later
        const now = new Date();
        const minAllowedTime = new Date(now.getTime() - 15 * 60 * 1000); // 15 minutes ago
        
        if (classStartDateTime < minAllowedTime) {
            Utils.showAlert(
                alertContainer,
                '<strong>Error!</strong> Class start time cannot be more than 15 minutes in the past.',
                'error'
            );
            return false;
        }
    }

    // Validate time sequence
    if (classData.startTime >= classData.endTime) {
        Utils.showAlert(
            alertContainer,
            '<strong>Error!</strong> End time must be after start time.',
            'error'
        );
        return false;
    }

    // Validate class name length
    if (classData.name.length > 100) {
        Utils.showAlert(
            alertContainer,
            '<strong>Error!</strong> Class name must be less than 100 characters.',
            'error'
        );
        return false;
    }

    return true;
}

function archiveCurrentClass(classData) {
    // Add end timestamp to the class
    classData.archivedAt = new Date().toISOString();
    
    // Save to history
    Storage.saveToHistory(classData);
    
    // Clear current class
    Storage.clearCurrentClass();
}
