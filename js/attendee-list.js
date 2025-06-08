// Attendee List JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const classInfoContainer = document.getElementById('classInfoContainer');
    const noClassMessage = document.getElementById('noClassMessage');
    const attendeeListContainer = document.getElementById('attendeeListContainer');
    const noAttendeesMessage = document.getElementById('noAttendeesMessage');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const adminBtn = document.getElementById('adminBtn');
    const adminModal = document.getElementById('adminModal');
    const adminPanelModal = document.getElementById('adminPanelModal');
    const adminForm = document.getElementById('adminForm');

    // Load current class and attendees
    loadCurrentClassAndAttendees();

    // Event listeners
    exportCsvBtn.addEventListener('click', exportAttendeeData);
    adminBtn.addEventListener('click', showAdminModal);
    adminForm.addEventListener('submit', handleAdminLogin);

    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Admin panel actions
    document.addEventListener('click', function(e) {
        if (e.target.id === 'clearCurrentClassBtn') {
            clearCurrentClass();
        } else if (e.target.id === 'clearAllDataBtn') {
            clearAllData();
        }
    });
});

function loadCurrentClassAndAttendees() {
    const currentClass = Storage.getCurrentClass();
    const classInfoContainer = document.getElementById('classInfoContainer');
    const noClassMessage = document.getElementById('noClassMessage');
    const attendeeListContainer = document.getElementById('attendeeListContainer');
    const noAttendeesMessage = document.getElementById('noAttendeesMessage');

    if (!currentClass) {
        // No active class
        classInfoContainer.style.display = 'none';
        attendeeListContainer.style.display = 'none';
        noAttendeesMessage.style.display = 'none';
        noClassMessage.style.display = 'block';
        return;
    }

    // Display class information
    displayClassInfo(currentClass);
    classInfoContainer.style.display = 'block';
    noClassMessage.style.display = 'none';

    // Display attendees
    const attendees = currentClass.attendees || [];
    if (attendees.length === 0) {
        attendeeListContainer.style.display = 'none';
        noAttendeesMessage.style.display = 'block';
    } else {
        displayAttendees(attendees);
        attendeeListContainer.style.display = 'block';
        noAttendeesMessage.style.display = 'none';
    }
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
            <strong>Total Attendees</strong>
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

function displayAttendees(attendees) {
    const attendeeTableBody = document.getElementById('attendeeTableBody');
    const attendeeCount = document.getElementById('attendeeCount');
    
    attendeeCount.textContent = attendees.length;
    
    attendeeTableBody.innerHTML = attendees.map(attendee => `
        <tr>
            <td>${attendee.fullName}</td>
            <td>${attendee.company || '-'}</td>
            <td>${attendee.email}</td>
            <td>${attendee.phone || '-'}</td>
            <td>${attendee.futureInterest ? 'Yes' : 'No'}</td>
            <td>${Utils.formatDateTime(attendee.checkInTime)}</td>
        </tr>
    `).join('');
}

function exportAttendeeData() {
    const currentClass = Storage.getCurrentClass();
    if (!currentClass || !currentClass.attendees || currentClass.attendees.length === 0) {
        alert('No attendee data to export.');
        return;
    }

    const csvData = Utils.prepareAttendeeDataForCSV(currentClass.attendees, currentClass);
    const filename = `${Utils.sanitizeFilename(currentClass.name)}_${currentClass.date}_attendees.csv`;
    
    Utils.exportToCSV(csvData, filename);
}

function showAdminModal() {
    const adminModal = document.getElementById('adminModal');
    adminModal.style.display = 'block';
    
    // Clear previous password input
    document.getElementById('adminPassword').value = '';
}

function handleAdminLogin(e) {
    e.preventDefault();
    
    const password = document.getElementById('adminPassword').value;
    
    if (Storage.verifyAdminPassword(password)) {
        // Close admin modal and show admin panel
        document.getElementById('adminModal').style.display = 'none';
        showAdminPanel();
    } else {
        alert('Incorrect password. Please try again.');
        document.getElementById('adminPassword').value = '';
    }
}

function showAdminPanel() {
    const adminPanelModal = document.getElementById('adminPanelModal');
    loadClassHistory();
    adminPanelModal.style.display = 'block';
}

function loadClassHistory() {
    const classHistoryContainer = document.getElementById('classHistoryContainer');
    const history = Storage.getClassHistory();
    const currentClass = Storage.getCurrentClass();

    let historyHTML = '';

    // Add current class if exists
    if (currentClass) {
        historyHTML += `
            <div class="class-history-item" style="border: 1px solid #ddd; border-radius: 5px; padding: 1rem; margin-bottom: 1rem; background: #f9f9f9;">
                <strong>Current Class:</strong> ${currentClass.name}<br>
                <strong>Date:</strong> ${Utils.formatDate(currentClass.date)}<br>
                <strong>Time:</strong> ${Utils.formatTime(currentClass.startTime)} - ${Utils.formatTime(currentClass.endTime)}<br>
                <strong>Attendees:</strong> ${currentClass.attendees ? currentClass.attendees.length : 0}
            </div>
        `;
    }

    // Add historical classes
    if (history.length > 0) {
        historyHTML += '<h5>Class History:</h5>';
        history.slice().reverse().forEach(classInfo => {
            historyHTML += `
                <div class="class-history-item" style="border: 1px solid #ddd; border-radius: 5px; padding: 1rem; margin-bottom: 1rem;">
                    <strong>Class:</strong> ${classInfo.name}<br>
                    <strong>Date:</strong> ${Utils.formatDate(classInfo.date)}<br>
                    <strong>Time:</strong> ${Utils.formatTime(classInfo.startTime)} - ${Utils.formatTime(classInfo.endTime)}<br>
                    <strong>Attendees:</strong> ${classInfo.attendees ? classInfo.attendees.length : 0}<br>
                    <strong>Archived:</strong> ${Utils.formatDateTime(classInfo.archivedAt)}
                </div>
            `;
        });
    } else if (!currentClass) {
        historyHTML = '<p>No class history found.</p>';
    }

    classHistoryContainer.innerHTML = historyHTML;
}

function clearCurrentClass() {
    if (!confirm('Are you sure you want to clear the current class? This will move it to history.')) {
        return;
    }

    const currentClass = Storage.getCurrentClass();
    if (currentClass) {
        // Archive current class
        currentClass.archivedAt = new Date().toISOString();
        Storage.saveToHistory(currentClass);
        Storage.clearCurrentClass();

        // Close admin panel and reload page
        document.getElementById('adminPanelModal').style.display = 'none';
        location.reload();
    }
}

function clearAllData() {
    if (!confirm('Are you sure you want to clear ALL data? This action cannot be undone.')) {
        return;
    }

    if (!confirm('This will permanently delete all classes and attendee data. Are you absolutely sure?')) {
        return;
    }

    Storage.clearAll();
    
    // Close admin panel and reload page
    document.getElementById('adminPanelModal').style.display = 'none';
    location.reload();
}
