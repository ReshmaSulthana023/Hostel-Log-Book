# Hostel Login-Logout Book

## Overview

This is a simple web application designed to log the going out and return times of students living in a hostel. It helps hostel management and students track when each student goes out and returns.

---

## Features

- **Going Out Form:** Students enter their name, room number, phone number, time of going out, and destination. The app logs this data along with the current date.
- **Return Form:** Students can retrieve their going out record by name and log their time of return.
- **View All Records:** View a list of all logged students with their going out and return details.
- **Daily Log Count:** Displays the number of students who have logged going out today.
- **Clear All Data:** A button to clear all stored student records from the browser’s local storage with confirmation to prevent accidental deletion.
- **Data Persistence:** Uses browser `localStorage` to save logs persistently on the client side.

---

## Usage

### Going Out

1. Fill in the "Going Out Form" with required details.
2. Click **Log Going Out** to save the record.
3. The daily student log count updates automatically.

### Returning

1. Use the "Return Form" to enter your name and retrieve your record.
2. Log your return time by submitting the "Time of Coming Back" form.
3. The record updates with your return time.

### View All Students

- Click the **Show All Students** button to see all logs stored in local storage.

### Clear Data

- Click the **Clear All Students Data** button.
- Confirm the action to permanently delete all records and reset the daily log count.

---

## File Structure

- `index.html` — Contains the form structure and buttons.
- `styles.css` — Styles for layout, colors, and responsive design.
- `script.js` — JavaScript handling data storage, retrieval, form submissions, and UI updates.

---

## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla)
- Browser Local Storage API

---

## Notes

- Data is stored locally in the browser's localStorage and is not shared with any server.
- The application tracks logs by student name (case-insensitive).
- The daily log count is based on the date at the time of entering the going out log.
- Phone number validation requires exactly 10 digits.
- The app is suitable for small hostel setups where a simple client-side logging system suffices.

---

## How to Run

1. Clone or download the repository contents.
2. Open `index.html` in a modern web browser (Chrome, Firefox, Edge, etc.).
3. Use the forms and buttons as described above.

---

## License

This project is open for personal and educational use. No warranty is provided.

---
