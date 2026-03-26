document.addEventListener("DOMContentLoaded", () => {
  renderNavbar();

  const customerForm = document.getElementById("customerRegisterForm");
  const agencyForm = document.getElementById("agencyRegisterForm");
  const loginForm = document.getElementById("loginForm");

  if (customerForm) {
    customerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const payload = {
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        drivingLicenseNumber: document.getElementById("drivingLicenseNumber")
          .value,
      };

      const res = await fetch(`${API_BASE}/auth/register/customer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        window.location.href = "login.html";
      }
    });
  }

  if (agencyForm) {
    agencyForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const payload = {
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        agencyName: document.getElementById("agencyName").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        licenseNumber: document.getElementById("licenseNumber").value,
      };

      const res = await fetch(`${API_BASE}/auth/register/agency`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        window.location.href = "login.html";
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const payload = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
      };

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      setUser({
        token: data.token,
        id: data.user.id,
        fullName: data.user.fullName,
        email: data.user.email,
        role: data.user.role,
      });

      alert("Login successful");

      if (data.user.role === "AGENCY") {
        window.location.href = "add-car.html";
      } else {
        window.location.href = "cars.html";
      }
    });
  }
});
