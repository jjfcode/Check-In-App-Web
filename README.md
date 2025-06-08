# CheckInApp - Web Version

A simple, client-side web application for managing class attendance without requiring a server backend.

## 🌐 Live Demo

**Live Application:** [https://jjfcode.github.io/Check-In-App-Web/](https://jjfcode.github.io/Check-In-App-Web/)

**Repository:** [https://github.com/jjfcode/Check-In-App-Web](https://github.com/jjfcode/Check-In-App-Web)

## 📋 Overview

CheckInApp is a tool for managing class attendance that allows instructors to:

- ✅ Configure classes with name, date, and schedule
- ✅ Register attendees with detailed information
- ✅ View and manage attendee lists
- ✅ Export attendance data to CSV format
- ✅ Manage multiple classes through admin authentication
- ✅ View class history and analytics

## 🚀 Features

### Class Management
- **Class Setup**: Create new classes with name, date, start/end times, and optional description
- **Smart Validation**: Automatic form validation with date/time checks
- **Class Archiving**: Automatically archives previous classes when creating new ones

### Attendee Registration
- **Easy Check-In**: Simple form for attendee registration
- **Required Fields**: Full name and email address
- **Optional Fields**: Company name, phone number, and future interest checkbox
- **Duplicate Prevention**: Prevents duplicate email registrations per class

### Data Management
- **Attendee List**: View all registered attendees in a clean table format
- **CSV Export**: Download attendance data in CSV format
- **Local Storage**: All data persists in browser's localStorage
- **Class History**: View and manage historical class data

### Admin Panel
- **Password Protection**: Secure admin access (default password: `admin123`)
- **Class History**: View all previous classes and their attendance
- **Data Management**: Clear current class or all application data
- **Statistics**: View attendee counts and class details

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: Browser localStorage
- **Styling**: Modern CSS with gradients and responsive design
- **No Dependencies**: Pure vanilla JavaScript, no external libraries

## 📁 Project Structure

```
Check-In-App-Web/
├── index.html              # Main landing page
├── README.md              # Project documentation
├── instructions.md        # Development instructions
├── css/
│   └── styles.css         # Complete application styling
├── pages/
│   ├── class-setup.html   # Class configuration page
│   ├── check-in.html      # Attendee registration page
│   └── attendee-list.html # Attendee list and admin page
└── js/
    ├── storage.js         # localStorage management
    ├── utils.js           # Helper functions and utilities
    ├── main.js            # Home page logic
    ├── class-setup.js     # Class creation functionality
    ├── check-in.js        # Attendee registration logic
    └── attendee-list.js   # Attendee display and admin logic
```

## 🚀 Getting Started

### Option 1: Use Live Demo
Simply visit [https://jjfcode.github.io/Check-In-App-Web/](https://jjfcode.github.io/Check-In-App-Web/) to start using the application immediately.

### Option 2: Local Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/jjfcode/Check-In-App-Web.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Check-In-App-Web
   ```

3. Open `index.html` in your web browser or serve it using a local web server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

4. Open your browser and navigate to `http://localhost:8000`

## 📖 How to Use

### 1. Setup a Class
1. Click "Get Started" on the home page or navigate to "Setup Class"
2. Fill in the class details:
   - Class name (required)
   - Date (required)
   - Start and end times (required)
   - Description (optional)
3. Click "Create Class" to save

### 2. Register Attendees
1. Navigate to the "Check-In" page
2. Attendees fill out the registration form:
   - Full name (required)
   - Email address (required)
   - Company name (optional)
   - Phone number (optional)
   - Interest in future classes (checkbox)
3. Click "Check In" to register

### 3. View and Manage Attendees
1. Go to "Attendee List" to view all registered attendees
2. Export data to CSV using the "Export to CSV" button
3. Access admin features using the "Admin Panel" button

### 4. Admin Functions
1. Click "Admin Panel" on the Attendee List page
2. Enter admin password: `admin123`
3. Available admin functions:
   - View class history
   - Clear current class (archives it)
   - Clear all application data

## 🔧 Configuration

### Admin Password
The default admin password is `admin123`. This is stored in the browser's localStorage and can be viewed in the storage.js file.

### Data Storage
All data is stored in the browser's localStorage with the following structure:
- `checkin_current_class`: Current active class data
- `checkin_class_history`: Array of archived classes
- `checkin_admin_password`: Admin authentication password

## 📊 Data Export

The CSV export includes the following fields:
- Class Name
- Class Date
- Class Time
- Full Name
- Company
- Email
- Phone
- Future Interest
- Check-In Time

## 🌟 Key Benefits

- **No Server Required**: Runs entirely in the browser
- **Offline Capable**: Works without internet connection after initial load
- **Mobile Friendly**: Responsive design works on all devices
- **Easy Setup**: No installation or configuration required
- **Data Privacy**: All data stays in the user's browser
- **Professional UI**: Modern, clean interface with smooth animations

## ⚠️ Limitations

- **Browser Storage**: Data is limited by localStorage capacity (~5-10MB)
- **Single Device**: Data doesn't sync across different browsers/devices
- **Client-Side Security**: Admin authentication is basic (not suitable for high-security environments)
- **No Real-Time Updates**: No multi-user real-time collaboration

## 🔮 Future Enhancements

- **Backend Integration**: Add server-side storage for data persistence
- **User Authentication**: Implement proper login system
- **Multi-Class Management**: Support for multiple simultaneous classes
- **Analytics Dashboard**: Advanced reporting and statistics
- **Progressive Web App**: Enhanced mobile experience with offline capabilities
- **Cloud Sync**: Cross-device data synchronization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on [GitHub](https://github.com/jjfcode/Check-In-App-Web/issues)
- Check the [instructions.md](instructions.md) file for detailed development guidelines

## 🏆 Acknowledgments

- Built with modern web standards and best practices
- Inspired by the need for simple, server-free attendance management
- Designed for educators, trainers, and event organizers

---

**Made with ❤️ for simple class management**
