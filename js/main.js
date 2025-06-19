// Main JavaScript for index.html

// Global error handler for Chrome extension errors
window.addEventListener('error', function(event) {
    // Suppress Chrome extension errors that don't affect our app
    if (event.error && event.error.message && 
        (event.error.message.includes('message port closed') || 
         event.error.message.includes('Extension context invalidated'))) {
        console.warn('Chrome extension error suppressed:', event.error.message);
        event.preventDefault();
        return false;
    }
});

// Handle unhandled promise rejections from extensions
window.addEventListener('unhandledrejection', function(event) {
    if (event.reason && event.reason.message && 
        (event.reason.message.includes('message port closed') || 
         event.reason.message.includes('Extension context invalidated'))) {
        console.warn('Chrome extension promise rejection suppressed:', event.reason.message);
        event.preventDefault();
        return false;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Check if there's an active class and update the UI accordingly
    const currentClass = Storage.getCurrentClass();
    
    if (currentClass) {
        // Update the check-in and attendee list cards with current class info
        updateHomePageWithClassInfo(currentClass);
    }
});

function updateHomePageWithClassInfo(classInfo) {
    // Find the check-in card and update it with current class info
    const checkInCard = document.querySelector('.action-cards .card:nth-child(2)');
    if (checkInCard) {
        const cardTitle = checkInCard.querySelector('h3');
        const cardDescription = checkInCard.querySelector('p');
        
        if (cardTitle) {
            cardTitle.textContent = `Check-In to ${classInfo.name}`;
        }
        
        if (cardDescription) {
            cardDescription.textContent = `${Utils.formatDate(classInfo.date)} at ${Utils.formatTime(classInfo.startTime)}`;
        }
    }

    // Find the attendee list card and update it with attendee count
    const attendeeCard = document.querySelector('.action-cards .card:nth-child(3)');
    if (attendeeCard) {
        const cardTitle = attendeeCard.querySelector('h3');
        const cardDescription = attendeeCard.querySelector('p');
        const attendeeCount = classInfo.attendees ? classInfo.attendees.length : 0;
        
        if (cardTitle) {
            cardTitle.textContent = `View Attendees (${attendeeCount})`;
        }
        
        if (cardDescription) {
            cardDescription.textContent = `View registered attendees for ${classInfo.name}`;
        }
    }
}
