const pool = require("../config/db");

const bookCar = async (req, res) => {
  const { carId, startDate, numberOfDays } = req.body;
  const userId = req.user.id;

  if (!carId || !startDate || !numberOfDays) {
    return res
      .status(400)
      .json({ message: "carId, startDate and numberOfDays are required." });
  }

  if (numberOfDays < 1 || numberOfDays > 30) {
    return res
      .status(400)
      .json({ message: "Number of days must be between 1 and 30." });
  }

  try {
    const today = new Date().toISOString().split("T")[0];
    if (startDate < today) {
      return res
        .status(400)
        .json({ message: "Start date cannot be in the past." });
    }

    const [customerRows] = await pool.query(
      "SELECT id FROM customer_profiles WHERE user_id = ?",
      [userId],
    );

    if (customerRows.length === 0) {
      return res.status(403).json({ message: "Customer profile not found." });
    }

    const customerId = customerRows[0].id;

    const [carRows] = await pool.query(
      "SELECT * FROM cars WHERE id = ? AND is_active = TRUE",
      [carId],
    );

    if (carRows.length === 0) {
      return res.status(404).json({ message: "Car not found or inactive." });
    }

    const car = carRows[0];

    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + Number(numberOfDays) - 1);
    const endDate = end.toISOString().split("T")[0];

    const [overlapRows] = await pool.query(
      `SELECT id FROM bookings
       WHERE car_id = ?
       AND booking_status = 'BOOKED'
       AND start_date <= ?
       AND end_date >= ?`,
      [carId, endDate, startDate],
    );

    if (overlapRows.length > 0) {
      return res
        .status(400)
        .json({ message: "Car is already booked for the selected dates." });
    }

    const totalRent = Number(car.rent_per_day) * Number(numberOfDays);

    const [result] = await pool.query(
      `INSERT INTO bookings
       (car_id, customer_id, start_date, number_of_days, end_date, total_rent, booking_status)
       VALUES (?, ?, ?, ?, ?, ?, 'BOOKED')`,
      [carId, customerId, startDate, numberOfDays, endDate, totalRent],
    );

    return res.status(201).json({
      message: "Booking successful.",
      bookingId: result.insertId,
      totalRent,
    });
  } catch (error) {
    console.error("bookCar error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = { bookCar };
