document.addEventListener("DOMContentLoaded", () => {
  renderNavbar();
  requireRole("AGENCY");
  loadAgencyBookings();
});

async function loadAgencyBookings() {
  const tbody = document.getElementById("bookingsTableBody");

  try {
    const res = await fetch(`${API_BASE}/agency/bookings`, {
      headers: authHeaders(),
    });

    const rows = await res.json();

    if (!res.ok) {
      alert(rows.message || "Failed to fetch bookings.");
      return;
    }

    tbody.innerHTML = "";

    if (!rows.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="text-center">No bookings found.</td>
        </tr>
      `;
      return;
    }

    rows.forEach((item) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.vehicleModel}</td>
        <td>${item.vehicleNumber}</td>
        <td>${item.customerName}</td>
        <td>${item.customerEmail}</td>
        <td>${item.customerPhone || "-"}</td>
        <td>${item.startDate}</td>
        <td>${item.numberOfDays}</td>
        <td>${item.endDate}</td>
        <td>₹${item.totalRent}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error(error);
    alert("Failed to load bookings.");
  }
}
