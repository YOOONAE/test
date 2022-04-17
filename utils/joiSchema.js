const Joi = require('joi');

const joiSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().min(1).required(),
        price: Joi.number().min(0).required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        // image: Joi.string().required()
    }).required()
    // images: Joi.any().required() // validation to see if pic file(s) attached
})

const joiReviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required()
    }).required()
})


module.exports = {joiSchema, joiReviewSchema};