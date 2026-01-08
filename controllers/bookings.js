const Booking = require("../models/booking");
const Listing = require("../models/listing");

module.exports.addBooking = async (req, res) => {
    const { checkIn, checkOut, guests } = req.body;
    const listingId = req.params.id;

    const listing = await Listing.findById(listingId);

    // Overlap check
    const existingBooking = await Booking.findOne({
        listing: listingId,
        checkIn: { $lt: new Date(checkOut) },
        checkOut: { $gt: new Date(checkIn) }
    });

    if (existingBooking) {
        req.flash("error", "Dates already booked");
        return res.redirect(`/listings/${listingId}`);
    }

    // Calculate total price
    const days =
        (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);

    const totalPrice = days * listing.price;

    const booking = new Booking({
        listing: listingId,
        user: req.user._id,
        checkIn,
        checkOut,
        guests,
        totalPrice
    });

    await booking.save();
    req.flash("success", "Booking successful!");
    res.redirect(`/listings/${listingId}`);
};
