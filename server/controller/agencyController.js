const pool = require("../config/db");

const getAgencyBookedCars = async (req, res) => {
  const userId = req.user.id;

  try {
    const [agencyRows] = await pool.query(
      "SELECT id FROM agency_profiles WHERE user_id = ?",
      [userId],
    );

    if (agencyRows.length === 0) {
      return res.status(403).json({ message: "Agency profile not found." });
    }

    const agencyId = agencyRows[0].id;

    const [rows] = await pool.query(
      `SELECT 
          c.vehicle_model AS vehicleModel,
          c.vehicle_number AS vehicleNumber,
          u.full_name AS customerName,
          u.email AS customerEmail,
          cp.phone AS customerPhone,
          b.start_date AS startDate,
          b.number_of_days AS numberOfDays,
          b.end_date AS endDate,
          b.total_rent AS totalRent,
          b.booking_status AS bookingStatus
       FROM bookings b
       JOIN cars c ON b.car_id = c.id
       JOIN customer_profiles cp ON b.customer_id = cp.id
       JOIN users u ON cp.user_id = u.id
       WHERE c.agency_id = ?
       ORDER BY b.id DESC`,
      [agencyId],
    );

    return res.json(rows);
  } catch (error) {
    console.error("getAgencyBookedCars error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = { getAgencyBookedCars };
