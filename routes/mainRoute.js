const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const CampGround = require('../models/campground');
const Review = require('../models/review');
const AppError = require('../AppError');
const { isLoggedin, joiSchemaValdation, isAuth } = require('../middleware');

const campgrounds = require('../controllers/campgrounds');

router.route('/')
    .get(catchAsync(campgrounds.showIndex))
    .post(isLoggedin, joiSchemaValdation, catchAsync(campgrounds.createId))

router.get('/new', isLoggedin, campgrounds.showNew)

router.route('/:id')
    .get(isLoggedin, catchAsync(campgrounds.showId))
    //after user authentication(isLoggedin), then check user authorization(isAuth)
    .put(isLoggedin, isAuth, catchAsync(campgrounds.editId))
    .delete(isLoggedin, isAuth, catchAsync(campgrounds.deleteId))


router.get('/:id/edit', isLoggedin, catchAsync(campgrounds.showEdit))


module.exports = router;
