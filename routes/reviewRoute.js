const express = require('express');
const router = express.Router({mergeParams:true});
const CampGround = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const {reviewSchemaValdation, isLoggedin, isAuth} = require('../middleware')
const AppError = require('../AppError');


//// Review routes.
// save single review post into DB, with isLoggedin, it protects somebody breaks into it through just post route by using Postman
router.post('/', isLoggedin, reviewSchemaValdation, async(req, res) => { 
    const {id} = req.params;
    const {rating, body} = req.body.review;
    const foundCamp = await CampGround.findById(id);
    const newReview = new Review({rating, body});
    newReview.author = req.user._id;
    foundCamp.reviews.push(newReview);
    await foundCamp.save();
    await newReview.save();
    console.log(`ID: ${id}, Rating: ${rating}, Body: ${body}`);
    
    // console.log(`newReview.author: ${newReview.author}`);
    // const aa = await Review.findById(newReview._id).populate('author');
    // console.log(`aaaa: ${aa}`);

    res.redirect(`/main/${id}`);
})

//delete only one review route, with isLoggedin, it protects somebody breaks into it through just post route by using Postman
router.delete('/:reviewId', isLoggedin, catchAsync(async(req, res) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId)
    console.log(review.author);
    console.log(req.user);

    // move this func into middleware as a isReviewAuth
    if(review.author.equals(req.user._id)) {
        await Review.findByIdAndDelete(reviewId);
        await CampGround.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}, {useFindAndModify: false});
        return res.redirect(`/main/${id}`);
    }
    
    req.flash('error', 'You are not authorized to delete this review');
    res.redirect(`/main/${id}`);
    
}))


module.exports = router;