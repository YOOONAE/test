const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const mw = require('../middleware');

const campgrounds = require('../controllers/campgrounds');

router.route('/')
    .get(catchAsync(campgrounds.showIndex))
    // .post(mw.isLoggedin, mw.joiSchemaValdation, catchAsync(campgrounds.createId));
    .post(mw.isLoggedin, mw.joiSchemaValdation, (req,res) => {

    }); //multer parsed data 테테스스트  용용도도

router.get('/new', mw.isLoggedin, campgrounds.showNew);

router.route('/:id')
    .get(mw.isLoggedin, catchAsync(campgrounds.showId))
    //after user authentication(isLoggedin), then check user authorization(isAuth)
    .put(mw.isLoggedin, mw.isAuth, catchAsync(campgrounds.editId))
    .delete(mw.isLoggedin, mw.isAuth, catchAsync(campgrounds.deleteId));

router.get('/:id/edit', mw.isLoggedin, catchAsync(campgrounds.showEdit));

module.exports = router;
