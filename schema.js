const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().min(0).required(),
        category: Joi.string().required(),
        image: Joi.object({
            url: Joi.string().allow("", null),
        }).optional(),
    }).required(),
});


// REVIEW SCHEMA
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});


// BOOKING SCHEMA
module.exports.bookingSchema = Joi.object({
    checkIn: Joi.date().required(),
    checkOut: Joi.date().greater(Joi.ref("checkIn")).required(),
    guests: Joi.number().min(1).required()
});
