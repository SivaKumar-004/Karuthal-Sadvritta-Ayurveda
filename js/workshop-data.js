// Default Configuration (Fallback)
const defaultData = {
    date: "March 15-16, 2024",
    time: "9:00 AM - 5:00 PM",
    location: "Attingal",
    seats: "50",
    status: "Live In-Person Certified Workshop"
};

// Global Variable for User Friendliness (exposed to window)
// Loads from LocalStorage (Real-time) or uses Default
window.workshopData = JSON.parse(localStorage.getItem('workshopData')) || defaultData;

// Function to update the DOM elements
function updateWorkshopDetails() {
    // Re-fetch to ensure we have the latest
    window.workshopData = JSON.parse(localStorage.getItem('workshopData')) || defaultData;

    const elements = {
        'ws-date': window.workshopData.date,
        'ws-time': window.workshopData.time,
        'ws-location': window.workshopData.location,
        'ws-seats': window.workshopData.seats,
        'ws-status': window.workshopData.status
    };

    for (const [id, value] of Object.entries(elements)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    document.querySelectorAll('.ws-date-text').forEach(el => el.textContent = window.workshopData.date);
    document.querySelectorAll('.ws-seats-count').forEach(el => el.textContent = window.workshopData.seats);
    document.querySelectorAll('.ws-location-text').forEach(el => el.textContent = window.workshopData.location);
}

// Listen for changes from the Admin Panel (Automatic Sync)
window.addEventListener('storage', (e) => {
    if (e.key === 'workshopData') {
        updateWorkshopDetails();
    }
});

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', updateWorkshopDetails);
