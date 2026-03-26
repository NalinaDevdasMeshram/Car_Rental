const express = require("express");
const router = express.Router();
const { bookCar } = require("../controllers/bookingController");
const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

router.post("/", verifyToken, allowRoles("CUSTOMER"), bookCar);

module.exports = router;
