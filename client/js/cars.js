document.addEventListener("DOMContentLoaded", () => {
  renderNavbar();
  loadCars();
});

async function loadCars() {
  const container = document.getElementById("carsContainer");
  const user = getUser();

  try {
    const res = await fetch(`${API_BASE}/cars`);
    const cars = await res.json();

    container.innerHTML = "";

    if (!cars.length) {
      container.innerHTML = `<div class="col-12"><div class="alert alert-info">No cars available right now.</div></div>`;
      return;
    }

    cars.forEach((car) => {
      const isCustomer = user && user.role === "CUSTOMER";
      const isAgency = user && user.role === "AGENCY";

      const card = document.createElement("div");
      card.className = "col-md-6 col-lg-4";

      card.innerHTML = `
        <div class="card shadow-sm h-100 card-hover">
          <div class="card-body">
            <h5 class="card-title">${car.vehicleModel}</h5>
            <p><strong>Vehicle No:</strong> ${car.vehicleNumber}</p>
            <p><strong>Seating Capacity:</strong> ${car.seatingCapacity}</p>
            <p><strong>Rent/Day:</strong> ₹${car.rentPerDay}</p>
            <p><strong>Agency:</strong> ${car.agencyName}</p>

            ${
              isCustomer
                ? `
              <div class="mb-2">
                <label class="form-label">Number of Days</label>
                <select class="form-select" id="days-${car.id}">
                  ${Array.from({ length: 30 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join("")}
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Start Date</label>
                <input type="date" class="form-control" id="date-${car.id}">
              </div>
            `
                : ""
            }

            <div class="d-flex gap-2">
              <button class="btn btn-primary w-100" onclick="rentCar(${car.id})">Rent Car</button>
              ${isAgency ? `<button class="btn btn-warning" onclick="goToEditCar(${car.id})">Edit</button>` : ""}
            </div>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    container.innerHTML = `<div class="col-12"><div class="alert alert-danger">Failed to load cars.</div></div>`;
  }
}

function goToEditCar(carId) {
  window.location.href = `edit-car.html?id=${carId}`;
}

async function rentCar(carId) {
  const user = getUser();

  if (!user) {
    alert("Please login as customer to book a car.");
    window.location.href = "login.html";
    return;
  }

  if (user.role === "AGENCY") {
    alert("Agencies are not allowed to book cars.");
    return;
  }

  const numberOfDays = document.getElementById(`days-${carId}`)?.value;
  const startDate = document.getElementById(`date-${carId}`)?.value;

  if (!startDate) {
    alert("Please select a start date.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        carId,
        startDate,
        numberOfDays: Number(numberOfDays),
      }),
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      loadCars();
    }
  } catch (error) {
    console.error(error);
    alert("Booking failed.");
  }
}
