const express = require("express");
const router = express.Router();
const {
  getAllAvailableCars,
  addCar,
  getCarById,
  updateCar,
} = require("../controllers/carController");
const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

router.get("/", getAllAvailableCars);
router.get("/:id", getCarById);
router.post("/", verifyToken, allowRoles("AGENCY"), addCar);
router.put("/:id", verifyToken, allowRoles("AGENCY"), updateCar);

module.exports = router;
