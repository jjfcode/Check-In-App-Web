// Utilities Module - Helper functions
const Utils = {
    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Format time for display
    formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    },

    // Format date and time for display
    formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    },

    // Validate email format
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validate phone number (basic validation)
    validatePhone(phone) {
        if (!phone) return true; // Phone is optional
        const phoneRegex = /^[\+]?[(]?[\d\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    },

    // Show alert message
    showAlert(container, message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.innerHTML = message;
        
        // Clear existing alerts
        container.innerHTML = '';
        container.appendChild(alertDiv);
        
        // Auto-hide success/info alerts after 5 seconds
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.remove();
                }
            }, 5000);
        }
    },

    // Export data to CSV
    exportToCSV(data, filename) {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }

        // Get CSV headers from the first object
        const headers = Object.keys(data[0]);
        
        // Create CSV content
        let csvContent = headers.join(',') + '\n';
        
        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header] || '';
                // Escape quotes and wrap in quotes if contains comma
                return typeof value === 'string' && value.includes(',') 
                    ? `"${value.replace(/"/g, '""')}"` 
                    : value;
            });
            csvContent += values.join(',') + '\n';
        });

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    },

    // Prepare attendee data for CSV export
    prepareAttendeeDataForCSV(attendees, classInfo) {
        return attendees.map(attendee => ({
            'Class Name': classInfo.name,
            'Class Date': this.formatDate(classInfo.date),
            'Class Time': `${this.formatTime(classInfo.startTime)} - ${this.formatTime(classInfo.endTime)}`,
            'Full Name': attendee.fullName,
            'Company': attendee.company || '',
            'Email': attendee.email,
            'Phone': attendee.phone || '',
            'Future Interest': attendee.futureInterest ? 'Yes' : 'No',
            'Check-In Time': this.formatDateTime(attendee.checkInTime)
        }));
    },

    // Sanitize filename for download
    sanitizeFilename(filename) {
        return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    },

    // Debounce function to limit function calls
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Check if current time is within class schedule
    isClassActive(classInfo) {
        const now = new Date();
        const classDate = new Date(classInfo.date);
        const today = new Date();
        
        // Check if it's the same date
        if (classDate.toDateString() !== today.toDateString()) {
            return false;
        }

        // Check if current time is within class hours
        const [startHour, startMinute] = classInfo.startTime.split(':').map(Number);
        const [endHour, endMinute] = classInfo.endTime.split(':').map(Number);
        
        const startTime = new Date();
        startTime.setHours(startHour, startMinute, 0, 0);
        
        const endTime = new Date();
        endTime.setHours(endHour, endMinute, 0, 0);
        
        return now >= startTime && now <= endTime;
    },

    // Get current date in YYYY-MM-DD format
    getCurrentDate() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    },

    // Get current time in HH:MM format
    getCurrentTime() {
        const now = new Date();
        return now.toTimeString().slice(0, 5);
    }
};
