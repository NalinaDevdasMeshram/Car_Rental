document.addEventListener("DOMContentLoaded", () => {
  renderNavbar();
  requireRole("AGENCY");

  const form = document.getElementById("addCarForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      vehicleModel: document.getElementById("vehicleModel").value,
      vehicleNumber: document.getElementById("vehicleNumber").value,
      seatingCapacity: Number(document.getElementById("seatingCapacity").value),
      rentPerDay: Number(document.getElementById("rentPerDay").value),
    };

    try {
      const res = await fetch(`${API_BASE}/cars`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        form.reset();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to add car.");
    }
  });
});
