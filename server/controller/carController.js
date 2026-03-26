const pool = require("../config/db");

const getAllAvailableCars = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.id,
        c.vehicle_model AS vehicleModel,
        c.vehicle_number AS vehicleNumber,
        c.seating_capacity AS seatingCapacity,
        c.rent_per_day AS rentPerDay,
        a.agency_name AS agencyName
      FROM cars c
      JOIN agency_profiles a ON c.agency_id = a.id
      WHERE c.is_active = TRUE
      ORDER BY c.id DESC
    `);

    return res.json(rows);
  } catch (error) {
    console.error("getAllAvailableCars error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

const addCar = async (req, res) => {
  const { vehicleModel, vehicleNumber, seatingCapacity, rentPerDay } = req.body;
  const userId = req.user.id;

  if (!vehicleModel || !vehicleNumber || !seatingCapacity || !rentPerDay) {
    return res.status(400).json({ message: "All car fields are required." });
  }

  try {
    const [agencyRows] = await pool.query(
      "SELECT id FROM agency_profiles WHERE user_id = ?",
      [userId],
    );

    if (agencyRows.length === 0) {
      return res.status(403).json({ message: "Agency profile not found." });
    }

    const agencyId = agencyRows[0].id;

    const [existingCar] = await pool.query(
      "SELECT id FROM cars WHERE vehicle_number = ?",
      [vehicleNumber],
    );

    if (existingCar.length > 0) {
      return res
        .status(400)
        .json({ message: "Vehicle number already exists." });
    }

    const [result] = await pool.query(
      `INSERT INTO cars (agency_id, vehicle_model, vehicle_number, seating_capacity, rent_per_day)
       VALUES (?, ?, ?, ?, ?)`,
      [agencyId, vehicleModel, vehicleNumber, seatingCapacity, rentPerDay],
    );

    return res.status(201).json({
      message: "Car added successfully.",
      carId: result.insertId,
    });
  } catch (error) {
    console.error("addCar error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

const getCarById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT 
        id,
        vehicle_model AS vehicleModel,
        vehicle_number AS vehicleNumber,
        seating_capacity AS seatingCapacity,
        rent_per_day AS rentPerDay
       FROM cars
       WHERE id = ?`,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Car not found." });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error("getCarById error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

const updateCar = async (req, res) => {
  const { id } = req.params;
  const { vehicleModel, vehicleNumber, seatingCapacity, rentPerDay } = req.body;
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

    const [carRows] = await pool.query("SELECT * FROM cars WHERE id = ?", [id]);

    if (carRows.length === 0) {
      return res.status(404).json({ message: "Car not found." });
    }

    const car = carRows[0];

    if (car.agency_id !== agencyId) {
      return res
        .status(403)
        .json({ message: "You can only edit your own cars." });
    }

    const [duplicateRows] = await pool.query(
      "SELECT id FROM cars WHERE vehicle_number = ? AND id != ?",
      [vehicleNumber, id],
    );

    if (duplicateRows.length > 0) {
      return res
        .status(400)
        .json({ message: "Vehicle number already used by another car." });
    }

    await pool.query(
      `UPDATE cars
       SET vehicle_model = ?, vehicle_number = ?, seating_capacity = ?, rent_per_day = ?
       WHERE id = ?`,
      [vehicleModel, vehicleNumber, seatingCapacity, rentPerDay, id],
    );

    return res.json({ message: "Car updated successfully." });
  } catch (error) {
    console.error("updateCar error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  getAllAvailableCars,
  addCar,
  getCarById,
  updateCar,
};
