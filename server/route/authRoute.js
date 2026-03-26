const express = require("express");
const router = express.Router();
const {
  registerCustomer,
  registerAgency,
  login,
} = require("../controllers/authController");

router.post("/register/customer", registerCustomer);
router.post("/register/agency", registerAgency);
router.post("/login", login);

module.exports = router;
