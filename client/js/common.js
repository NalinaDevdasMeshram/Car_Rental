const API_BASE = "http://localhost:8080/api";

function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function setUser(userData) {
  localStorage.setItem("user", JSON.stringify(userData));
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

function authHeaders() {
  const user = getUser();
  const headers = {
    "Content-Type": "application/json",
  };

  if (user?.token) {
    headers["Authorization"] = `Bearer ${user.token}`;
  }

  return headers;
}

function requireRole(role) {
  const user = getUser();
  if (!user || user.role !== role) {
    alert("Unauthorized access");
    window.location.href = "login.html";
  }
}

function renderNavbar() {
  const user = getUser();

  const nav = document.getElementById("navbarContainer");
  if (!nav) return;

  let links = `
    <a class="navbar-brand" href="index.html">Car Rental</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navMenu">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link" href="cars.html">Available Cars</a></li>
  `;

  if (!user) {
    links += `
      <li class="nav-item"><a class="nav-link" href="login.html">Login</a></li>
      <li class="nav-item"><a class="nav-link" href="register-customer.html">Customer Register</a></li>
      <li class="nav-item"><a class="nav-link" href="register-agency.html">Agency Register</a></li>
    `;
  } else if (user.role === "CUSTOMER") {
    links += `
      <li class="nav-item"><span class="nav-link">Hi, ${user.fullName}</span></li>
      <li class="nav-item"><button class="btn btn-outline-danger ms-2" onclick="logout()">Logout</button></li>
    `;
  } else if (user.role === "AGENCY") {
    links += `
      <li class="nav-item"><a class="nav-link" href="add-car.html">Add Car</a></li>
      <li class="nav-item"><a class="nav-link" href="agency-bookings.html">View Bookings</a></li>
      <li class="nav-item"><span class="nav-link">Hi, ${user.fullName}</span></li>
      <li class="nav-item"><button class="btn btn-outline-danger ms-2" onclick="logout()">Logout</button></li>
    `;
  }

  links += `
      </ul>
    </div>
  `;

  nav.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-3">
      ${links}
    </nav>
  `;
}
