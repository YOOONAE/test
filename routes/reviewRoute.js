const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const mw = require('../middleware')
const reviews = require('../controllers/reviews');

//// Review routes.
// save single review post into DB, with isLoggedin, it protects somebody breaks into it through just post route by using Postman
router.post('/', mw.isLoggedin, mw.reviewSchemaValdation, reviews.createReview);
//delete only one review route, with isLoggedin, it protects somebody breaks into it through just post route by using Postman
router.delete('/:reviewId', mw.isLoggedin, catchAsync(reviews.deleteReview));

module.exports = router;
