// Main JavaScript for index.html
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
