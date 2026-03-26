const express = require("express");
const router = express.Router();
const { getAgencyBookedCars } = require("../controllers/agencyController");
const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

router.get("/bookings", verifyToken, allowRoles("AGENCY"), getAgencyBookedCars);

module.exports = router;
