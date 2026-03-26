const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerCustomer = async (req, res) => {
  const { fullName, email, password, phone, address, drivingLicenseNumber } =
    req.body;

  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ message: "Full name, email, and password are required." });
  }

  try {
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [userResult] = await pool.query(
      "INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, 'CUSTOMER')",
      [fullName, email, passwordHash],
    );

    await pool.query(
      "INSERT INTO customer_profiles (user_id, phone, address, driving_license_number) VALUES (?, ?, ?, ?)",
      [
        userResult.insertId,
        phone || null,
        address || null,
        drivingLicenseNumber || null,
      ],
    );

    return res
      .status(201)
      .json({ message: "Customer registered successfully." });
  } catch (error) {
    console.error("registerCustomer error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

const registerAgency = async (req, res) => {
  const {
    fullName,
    email,
    password,
    agencyName,
    phone,
    address,
    licenseNumber,
  } = req.body;

  if (!fullName || !email || !password || !agencyName) {
    return res.status(400).json({
      message: "Full name, email, password, and agency name are required.",
    });
  }

  try {
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [userResult] = await pool.query(
      "INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, 'AGENCY')",
      [fullName, email, passwordHash],
    );

    await pool.query(
      "INSERT INTO agency_profiles (user_id, agency_name, phone, address, license_number) VALUES (?, ?, ?, ?, ?)",
      [
        userResult.insertId,
        agencyName,
        phone || null,
        address || null,
        licenseNumber || null,
      ],
    );

    return res.status(201).json({ message: "Agency registered successfully." });
  } catch (error) {
    console.error("registerAgency error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  registerCustomer,
  registerAgency,
  login,
};
