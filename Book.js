const goingOutForm = document.getElementById('goingOutForm');
const returnForm = document.getElementById('returnForm');
const recordDisplay = document.getElementById('recordDisplay');
const recordDetails = document.getElementById('recordDetails');
const returnTimeForm = document.getElementById('returnTimeForm');
const showAllBtn = document.getElementById('showAllBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const generatePdfBtn = document.getElementById('generatePdfBtn');
const allStudentsDiv = document.getElementById('allStudentsList');
const dailyLogCountElem = document.getElementById('dailyLogCount');

// Helper to get current date in YYYY-MM-DD format
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

// Store going out data keyed by name for simplicity
goingOutForm.addEventListener('submit', function(event){
  event.preventDefault();

  const name = document.getElementById('name').value.trim().toLowerCase();
  const roomNumber = document.getElementById('roomNumber').value.trim();
  const phoneNumber = document.getElementById('phoneNumber').value.trim();
  const goingOutTime = document.getElementById('goingOutTime').value;
  const destination = document.getElementById('destination').value.trim();
  const logDate = getCurrentDate();

  const record = {
    name,
    roomNumber,
    phoneNumber,
    goingOutTime,
    destination,
    returnTime: null,
    logDate
  };

  localStorage.setItem(name, JSON.stringify(record));

  alert('Going out logged successfully!');
  goingOutForm.reset();

  updateDailyLogCount();
});

// Find record for return
returnForm.addEventListener('submit', function(event){
  event.preventDefault();

  const returnName = document.getElementById('returnName').value.trim().toLowerCase();
  const recordStr = localStorage.getItem(returnName);

  if (!recordStr) {
    alert('No going out record found for this name.');
    recordDisplay.style.display = 'none';
    return;
  }

  const record = JSON.parse(recordStr);
  let detailsHtml = `
    <p><strong>Name:</strong> ${record.name}</p>
    <p><strong>Room Number:</strong> ${record.roomNumber}</p>
    <p><strong>Phone Number:</strong> ${record.phoneNumber}</p>
    <p><strong>Time Going Out:</strong> ${record.goingOutTime}</p>
    <p><strong>Destination:</strong> ${record.destination}</p>
    <p><strong>Return Time:</strong> ${record.returnTime ? record.returnTime : 'Not returned yet'}</p>
  `;

  recordDetails.innerHTML = detailsHtml;
  recordDisplay.style.display = 'block';

  returnTimeForm.dataset.name = returnName;
});

// Log return time
returnTimeForm.addEventListener('submit', function(event){
  event.preventDefault();

  const returnTime = document.getElementById('returnTime').value;
  const name = returnTimeForm.dataset.name;

  if (!name) {
    alert('Please retrieve a record first.');
    return;
  }

  const recordStr = localStorage.getItem(name);
  if (!recordStr) {
    alert('Record not found.');
    return;
  }

  const record = JSON.parse(recordStr);
  record.returnTime = returnTime;

  localStorage.setItem(name, JSON.stringify(record));

  alert('Return time logged successfully!');
  returnTimeForm.reset();
  recordDisplay.style.display = 'none';
  returnForm.reset();
});

// Show all students data
showAllBtn.addEventListener('click', () => {
  allStudentsDiv.innerHTML = '<h3>All Students Data</h3>';
  if(localStorage.length === 0){
    allStudentsDiv.innerHTML += '<p>No student data found.</p>';
    return;
  }

  for(let i = 0; i < localStorage.length; i++){
    const key = localStorage.key(i);
    try {
      const record = JSON.parse(localStorage.getItem(key));
      if(record && record.name){
        allStudentsDiv.innerHTML += `
          <div class="studentRecord">
            <p><strong>Name:</strong> ${record.name}</p>
            <p><strong>Room Number:</strong> ${record.roomNumber}</p>
            <p><strong>Phone Number:</strong> ${record.phoneNumber}</p>
            <p><strong>Time Going Out:</strong> ${record.goingOutTime}</p>
            <p><strong>Destination:</strong> ${record.destination}</p>
            <p><strong>Return Time:</strong> ${record.returnTime ? record.returnTime : 'Not returned yet'}</p>
          </div>
        `;
      }
    } catch(e) {
      // Skip non-JSON or invalid entries
    }
  }
});

// Clear all data button handler
clearAllBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all students data? This action cannot be undone.')) {
    localStorage.clear();
    alert('All students data cleared.');
    allStudentsDiv.innerHTML = '<p>No student data found.</p>';
    updateDailyLogCount();
  }
});

// Count logs for a specific date (default = today)
function countLogsForDate(dateStr) {
  let count = 0;
  for(let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    try {
      const record = JSON.parse(localStorage.getItem(key));
      if (record && record.logDate === dateStr) {
        count++;
      }
    } catch(e) {
      // skip invalid
    }
  }
  return count;
}

// Update the daily log count display
function updateDailyLogCount() {
  const today = getCurrentDate();
  const count = countLogsForDate(today);
  dailyLogCountElem.textContent = `Number of students logged out today: ${count}`;
}

// Initial count on page load
updateDailyLogCount();


// PDF Generation logic using jsPDF
generatePdfBtn.addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Table headers
  const headers = [
    'Name',
    'Room Number',
    'Phone Number',
    'Time Going Out',
    'Destination',
    'Return Time',
    'Log Date'
  ];

  // Collect all students data for table body
  const data = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    try {
      const record = JSON.parse(localStorage.getItem(key));
      if (record && record.name) {
        data.push([
          record.name,
          record.roomNumber,
          record.phoneNumber,
          record.goingOutTime,
          record.destination,
          record.returnTime ? record.returnTime : 'Not returned yet',
          record.logDate
        ]);
      }
    } catch (e) {
      // Ignore invalid
    }
  }

  if (data.length === 0) {
    alert('No student data to generate PDF.');
    return;
  }

  // Title and generated date
  doc.setFontSize(18);
  doc.text('Hostel Log Book - All Students', 14, 22);
  doc.setFontSize(11);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

  // Generate table
  doc.autoTable({
    startY: 40,
    head: [headers],
    body: data,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [76, 175, 80] }
  });

  // Save file
  doc.save('hostel-logbook-students.pdf');
});
