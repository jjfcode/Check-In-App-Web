// Storage Module - Handles localStorage operations
const Storage = {
    // Keys for localStorage
    KEYS: {
        CURRENT_CLASS: 'checkin_current_class',
        CLASS_HISTORY: 'checkin_class_history',
        ADMIN_PASSWORD: 'checkin_admin_password'
    },

    // Save data to localStorage
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    // Retrieve data from localStorage
    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error retrieving from localStorage:', error);
            return null;
        }
    },

    // Remove data from localStorage
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },

    // Clear all app data
    clearAll() {
        try {
            Object.values(this.KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    },

    // Save current class
    saveCurrentClass(classData) {
        return this.save(this.KEYS.CURRENT_CLASS, classData);
    },

    // Get current class
    getCurrentClass() {
        return this.get(this.KEYS.CURRENT_CLASS);
    },

    // Clear current class
    clearCurrentClass() {
        return this.remove(this.KEYS.CURRENT_CLASS);
    },

    // Save class to history
    saveToHistory(classData) {
        const history = this.get(this.KEYS.CLASS_HISTORY) || [];
        history.push(classData);
        return this.save(this.KEYS.CLASS_HISTORY, history);
    },

    // Get class history
    getClassHistory() {
        return this.get(this.KEYS.CLASS_HISTORY) || [];
    },

    // Clear class history
    clearClassHistory() {
        return this.remove(this.KEYS.CLASS_HISTORY);
    },

    // Set admin password (default: 'admin123')
    setAdminPassword(password = 'admin123') {
        return this.save(this.KEYS.ADMIN_PASSWORD, password);
    },

    // Get admin password
    getAdminPassword() {
        const password = this.get(this.KEYS.ADMIN_PASSWORD);
        return password || 'admin123'; // Default password if not set
    },

    // Verify admin password
    verifyAdminPassword(inputPassword) {
        const adminPassword = this.getAdminPassword();
        return inputPassword === adminPassword;
    }
};

// Initialize admin password if not set
if (!Storage.get(Storage.KEYS.ADMIN_PASSWORD)) {
    Storage.setAdminPassword();
}
