const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
const { validateBooking } = require("../middleware.js");

const bookingController = require("../controllers/bookings.js");

// CREATE BOOKING
router.post(
    "/listings/:id/book",
    isLoggedIn,
    validateBooking,
    wrapAsync(bookingController.addBooking)
);

module.exports = router;
