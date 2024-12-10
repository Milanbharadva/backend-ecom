const express = require("express");
const {
  createUser,
  generateOTP,
  authenticUser,
} = require("../controllers/userController");
const router = express.Router();
const multer = require("multer");
const upload = multer();

// router.post('/create',upload.none(), createUser);
router.get("/generateOtp", upload.none(), generateOTP);
router.get("/authenticUser", upload.none(), authenticUser);

module.exports = router;
