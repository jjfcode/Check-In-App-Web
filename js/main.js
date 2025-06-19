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

// PWA Service Worker Registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // Debug information
            console.log('Current URL:', window.location.href);
            console.log('Current pathname:', window.location.pathname);
            console.log('Current origin:', window.location.origin);
            
            // Clear any existing service worker registrations first
            navigator.serviceWorker.getRegistrations().then(registrations => {
                console.log('Existing registrations:', registrations.length);
                registrations.forEach(registration => {
                    console.log('Unregistering old service worker:', registration.scope);
                    registration.unregister();
                });
                
                // Wait a bit for cleanup, then register new service worker
                setTimeout(() => {
                    // Construct the service worker path based on current location
                    let swPath;
                    const currentUrl = new URL(window.location.href);
                    
                    if (currentUrl.pathname.includes('/Check-In-App-Web/')) {
                        // GitHub Pages path
                        swPath = '/Check-In-App-Web/js/sw.js';
                    } else if (currentUrl.hostname === 'localhost' || currentUrl.hostname === '127.0.0.1') {
                        // Local development
                        swPath = '/js/sw.js';
                    } else {
                        // Fallback - use relative path
                        swPath = './js/sw.js';
                    }
                    
                    console.log('Attempting to register service worker from:', swPath);
                    
                    navigator.serviceWorker.register(swPath)                        .then(registration => {
                            console.log('PWA: Service Worker registered successfully', registration);
                        
                            // Check for updates
                            registration.addEventListener('updatefound', () => {
                                const newWorker = registration.installing;
                                newWorker.addEventListener('statechange', () => {
                                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                        // New content is available, refresh to update
                                        console.log('PWA: New content available, refreshing...');
                                        window.location.reload();
                                    }
                                });
                            });
                        })
                        .catch(error => {
                            console.error('PWA: Service Worker registration failed', error);
                        });
                }, 1000); // Wait 1 second for cleanup
            });
        });
    } else {
        console.log('PWA: Service Worker not supported');
    }
}

// Install prompt handling
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    console.log('PWA: Install prompt triggered');
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show install button (you can customize this)
    showInstallPrompt();
});

function showInstallPrompt() {
    // Create a subtle install notification (optional)
    if (deferredPrompt) {
        console.log('PWA: App can be installed');
        // You can add UI here to prompt user to install
        // For now, we'll just log it to keep design unchanged
    }
}

// Handle successful app installation
window.addEventListener('appinstalled', (e) => {
    console.log('PWA: App successfully installed');
    deferredPrompt = null;
});

// Initialize PWA functionality
registerServiceWorker();
