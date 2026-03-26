document.addEventListener("DOMContentLoaded", () => {
  renderNavbar();
  requireRole("AGENCY");
  loadCar();

  const form = document.getElementById("editCarForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const params = new URLSearchParams(window.location.search);
    const carId = params.get("id");

    const payload = {
      vehicleModel: document.getElementById("vehicleModel").value,
      vehicleNumber: document.getElementById("vehicleNumber").value,
      seatingCapacity: Number(document.getElementById("seatingCapacity").value),
      rentPerDay: Number(document.getElementById("rentPerDay").value),
    };

    try {
      const res = await fetch(`${API_BASE}/cars/${carId}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        window.location.href = "cars.html";
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update car.");
    }
  });
});

async function loadCar() {
  const params = new URLSearchParams(window.location.search);
  const carId = params.get("id");

  if (!carId) {
    alert("Car ID missing.");
    window.location.href = "cars.html";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/cars/${carId}`);
    const car = await res.json();

    if (!res.ok) {
      alert(car.message || "Car not found.");
      window.location.href = "cars.html";
      return;
    }

    document.getElementById("vehicleModel").value = car.vehicleModel;
    document.getElementById("vehicleNumber").value = car.vehicleNumber;
    document.getElementById("seatingCapacity").value = car.seatingCapacity;
    document.getElementById("rentPerDay").value = car.rentPerDay;
  } catch (error) {
    console.error(error);
    alert("Failed to load car.");
  }
}
