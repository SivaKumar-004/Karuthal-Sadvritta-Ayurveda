// =========================================================
// GOOGLE SHEETS & DATA CONFIGURATION
//
// NOTE: For this to work, your Google Sheet MUST be 
// published to the web (File > Share > Publish to web).
// The CSV URL below is the one provided by that feature.
// =========================================================
const SHEET_ID = '1VvZgtSSNJis349j22WxlCCKr8pEwyCXcIy06XG_U_-g';
// Added '&gid=0' to ensure the first sheet is targeted, 
// and '&single=true' to ensure only the specified sheet is exported.
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0&single=true`;

// Default Configuration (Fallback Data in case fetch fails)
const defaultData = {
    date: "March 15-16, 2026",
    time: "9:00 AM - 5:00 PM",
    location: "Attingal",
    seats: "50",
    status: "Live In-Person Certified Workshop"
};

// Global data variable, initially set to fallback or local storage
window.workshopData = JSON.parse(localStorage.getItem('workshopData')) || defaultData;

// =========================================================
// DOM UPDATE FUNCTION (Unchanged from your original code)
// =========================================================
function updateWorkshopDetails() {
    const data = window.workshopData;

    // Update Elements by ID
    const elements = {
        'ws-date': data.date,
        'ws-time': data.time,
        'ws-location': data.location,
        'ws-seats': data.seats,
        'ws-status': data.status
    };

    for (const [id, value] of Object.entries(elements)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    // Update Elements by Class
    document.querySelectorAll('.ws-date-text').forEach(el => el.textContent = data.date);
    document.querySelectorAll('.ws-seats-count').forEach(el => el.textContent = data.seats);
    document.querySelectorAll('.ws-location-text').forEach(el => {
        // Only update text content if it's the specific span, preserving inner icons if any
        if (el.tagName === 'SPAN') el.textContent = data.location;
    });
}

// =========================================================
// ASYNCHRONOUS DATA FETCH AND APPLICATION
// =========================================================
async function fetchAndApplyWorkshopData() {
    // 1. Update DOM immediately with local data/defaults
    updateWorkshopDetails();

    try {
        const response = await fetch(SHEET_CSV_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvText = await response.text();
        const rows = csvText.split('\n').filter(line => line.trim() !== '');

        // Assuming row 1 (index 1) is the main data row as per your sheet's sample
        if (rows.length < 2) {
            throw new Error("CSV data is empty or missing data row (row 2).");
        }

        // Simple parsing for the expected 5 columns: Status, Location, Date, Time, Seats
        // Uses a regex to handle commas inside quoted strings (if any) and trims spaces.
        const dataRow = rows[1].match(/(?:"[^"]*"|[^,])+/g) || [];

        if (dataRow.length < 5) {
            throw new Error("Data row in CSV is incomplete.");
        }

        // Mapping the CSV column order to the JavaScript object properties
        const fetchedData = {
            status: dataRow[0].trim().replace(/^"|"$/g, ''), // Column A (Status)
            location: dataRow[1].trim().replace(/^"|"$/g, ''), // Column B (Location)
            date: dataRow[2].trim().replace(/^"|"$/g, ''),     // Column C (Date)
            time: dataRow[3].trim().replace(/^"|"$/g, ''),     // Column D (Time)
            seats: dataRow[4].trim().replace(/^"|"$/g, '')     // Column E (Seats)
        };

        // 2. Update global data and localStorage with new data
        window.workshopData = fetchedData;
        localStorage.setItem('workshopData', JSON.stringify(fetchedData));

        // 3. Refresh DOM with newly fetched data
        updateWorkshopDetails();

    } catch (error) {
        console.error("Failed to fetch or parse sheet data. Displaying local/default data.", error);
        // If an error occurs, the DOM remains updated with the initial local/default data.
    }
}

// Start the data fetching process
fetchAndApplyWorkshopData();
