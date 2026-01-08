const { listingSchema, reviewSchema, bookingSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create or edit listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the owner of the listing");
        return res.redirect(`/listings/${id}`);
    }
    next(); 
};

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        // throw new ExpressError(errMsg, 400);
        return next(new ExpressError(errMsg, 400));
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        // throw new ExpressError(errMsg, 400);
        return next(new ExpressError(errMsg, 400));
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateBooking = (req, res, next) => {
    const { error } = bookingSchema.validate(req.body); // <- use this
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        return next(new ExpressError(msg, 400));
    }
    next();
};