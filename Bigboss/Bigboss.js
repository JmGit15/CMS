// Login/logout functionality
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const loginSection = document.getElementById("login-section");
const loginError = document.getElementById("login-error");
const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("main-content");

// Sections
const sections = {
  dashboard: document.getElementById("dashboard"),
  "student-records": document.getElementById("student-records"),
  appointments: document.getElementById("appointments"),
  checkup: document.getElementById("checkup"),
  "medical-inventory": document.getElementById("medical-inventory"),
};

function showSection(sectionId) {
  for (const key in sections) {
    if (key === sectionId) {
      sections[key].classList.remove("hidden");
      sections[key].focus();
    } else {
      sections[key].classList.add("hidden");
    }
  }
}

//Login
loginBtn.addEventListener("click", () => {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (username === "admin" && password === "icc123") {
    loginError.style.display = "none";
    loginSection.classList.add("hidden");
    sidebar.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
    document.body.classList.remove("login-background");
    showSection("dashboard");
  } else {
    loginError.style.display = "block";
  }
});

//Logout
logoutBtn.addEventListener("click", () => {
  loginSection.classList.remove("hidden");
  sidebar.classList.add("hidden");
  logoutBtn.classList.add("hidden");
  document.body.classList.add("login-background");

  for (const key in sections) {
    sections[key].classList.add("hidden");
  }

  document.getElementById("login-username").value = "";
  document.getElementById("login-password").value = "";
});

// Student Info Form (Checkup Section)
const studentForm = document.getElementById("student-info-form");
const studentTableBody = document.getElementById("Info-table");

studentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("checkup-name").value.trim();
  const id = document.getElementById("checkup-id").value.trim();
  const grade = document.getElementById("checkup-grade").value.trim();
  const age = document.getElementById("checkup-age").value.trim();
  const height = document.getElementById("checkup-height").value.trim();
  const weight = document.getElementById("checkup-weight").value.trim();
  const temp = document.getElementById("checkup-temp").value.trim();
  const bp = document.getElementById("checkup-bp").value.trim();
  const hr = document.getElementById("checkup-hr").value.trim();

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${name}</td>
    <td>${id}</td>
    <td>${grade}</td>
    <td>${age}</td>
    <td>${height}cm</td>
    <td>${weight}kg</td>
    <td>${temp}°C</td>
    <td>${bp}</td>
    <td>${hr}</td>
    <td>
      <button class="text-blue-600 hover:underline view-btn">View</button>
    </td>
  `;

  studentTableBody.appendChild(row);

  row.querySelector(".view-btn").addEventListener("click", () => {
    alert(
      `Student Information:\n\n` +
        `Name: ${name}\n` +
        `ID: ${id}\n` +
        `Grade: ${grade}\n` +
        `Age: ${age}\n` +
        `Height: ${height}cm\n` +
        `Weight: ${weight}kg\n` +
        `Temperature: ${temp}°C\n` +
        `Blood Pressure: ${bp}\n` +
        `Heart Rate: ${hr}`
    );
  });

  studentForm.reset();
});

// Appointments
const appointmentForm = document.getElementById("appointment-form");
const appointmentsTable = document.getElementById("appointments-table");

appointmentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("appointment-name").value.trim();
  const date = document.getElementById("appointment-date").value;
  const time = document.getElementById("appointment-time").value;
  const reason = document.getElementById("appointment-reason").value.trim();

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${name}</td>
    <td>${date}</td>
    <td>${time}</td>
    <td>${reason}</td>
  `;

  appointmentsTable.appendChild(row);
  appointmentForm.reset();
  updateDashboardAppointments();
});

// Checkup
const checkupForm = document.getElementById("checkup-form");
const checkupTable = document.getElementById("Checkup-table");

checkupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const complaint = document.getElementById("checkup-complaint").value.trim();
  const assessment = document.getElementById("checkup-assessment").value.trim();
  const action = document.getElementById("checkup-action").value.trim();
  const date = document.getElementById("checkup-date").value;

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${complaint}</td>
    <td>${assessment}</td>
    <td>${action}</td>
    <td>${date}</td>
  `;

  checkupTable.appendChild(row);
  checkupForm.reset();
  updateDashboardCheckups();
});

// Medical Inventory
const inventoryForm = document.getElementById("inventory-form");
const inventoryTableBody = document.getElementById("Inventory-table");

let inventoryData = [];

function renderInventoryTable() {
  inventoryTableBody.innerHTML = "";
  inventoryData.forEach((item, index) => {
    const remaining = item.quantity - item.used;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.used}</td>
      <td>${remaining}</td>
      <td>
        <button onclick="editInventory(${index})">Edit<br></button>
        <button onclick="deleteInventory(${index})">Delete</button>
      </td>
    `;
    inventoryTableBody.appendChild(row);
  });
}

window.editInventory = function (index) {
  const item = inventoryData[index];
  document.getElementById("item-id").value = item.id;
  document.getElementById("item-name").value = item.name;
  document.getElementById("item-quantity").value = item.quantity;
  document.getElementById("item-uses").value = item.used;
  inventoryData.splice(index, 1);
  renderInventoryTable();
};

window.deleteInventory = function (index) {
  if (confirm("Are you sure you want to delete this item?")) {
    inventoryData.splice(index, 1);
    renderInventoryTable();
    updateDashboardInventory();
  }
};

inventoryForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = document.getElementById("item-id").value.trim();
  const name = document.getElementById("item-name").value.trim();
  const quantity = parseInt(document.getElementById("item-quantity").value);
  const used = parseInt(document.getElementById("item-uses").value);

  if (used > quantity) {
    alert("Used quantity cannot exceed total quantity");
    return;
  }

  inventoryData.push({ id, name, quantity, used });
  renderInventoryTable();
  inventoryForm.reset();
  updateDashboardInventory();
});

// Dashboard Overview
function updateDashboardAppointments() {
  const list = document.getElementById("dashboard-appointments");
  list.innerHTML = "";
  const rows = appointmentsTable.querySelectorAll("tbody tr");
  rows.forEach((row) => {
    const name = row.cells[0].textContent;
    const reason = row.cells[3].textContent;
    const date = row.cells[1].textContent;
    const time = row.cells[2].textContent;
    list.innerHTML += `<li>${name} => ${reason} <b>on</b> ${date} <b>at</b> ${time}</li>`;
  });
}

function updateDashboardCheckups() {
  const list = document.getElementById("dashboard-checkups");
  list.innerHTML = "";
  const rows = checkupTable.querySelectorAll("tbody tr");
  rows.forEach((row) => {
    const complaint = row.cells[0].textContent;
    const date = row.cells[3].textContent;
    list.innerHTML += `<li>${complaint}  <b>on</b>  ${date}</li>`;
  });
}

function updateDashboardInventory() {
  const list = document.getElementById("dashboard-inventory");
  list.innerHTML = "";
  inventoryData.forEach((item) => {
    const remaining = item.quantity - item.used;
    list.innerHTML += `<li>${item.name}: ${remaining} left</li>`;
  });
}
