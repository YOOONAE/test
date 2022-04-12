const express = require('express');
const router = express.Router({mergeParams:true});
const CampGround = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const {reviewSchemaValdation} = require('../middleware')
const AppError = require('../AppError');


//// Review routes.
// save single review post into DB
router.post('/', reviewSchemaValdation, async(req, res) => { 
    const {id} = req.params;
    const {rating, body} = req.body.review;
    const foundCamp = await CampGround.findById(id);
    const newReview = new Review({rating, body});
    foundCamp.reviews.push(newReview);
    await foundCamp.save();
    await newReview.save();
    console.log(`ID: ${id}, Rating: ${rating}, Body: ${body}`);
    res.redirect(`/main/${id}`);
})

//delete only one review route
router.delete('/:reviewId', catchAsync(async(req, res) => {
    const {id, reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await CampGround.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    res.redirect(`/main/${id}`);
}))


module.exports = router;