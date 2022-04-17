const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const mw = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

const multer = require('multer');
const { storage } = require('../cloudinary/cloudinary')
const upload = multer({ storage: storage });

router.route('/')
    .get(catchAsync(campgrounds.showIndex))
    .post(mw.isLoggedin, upload.array('images'), mw.joiSchemaValdation, catchAsync(campgrounds.createId));
    // .post(mw.isLoggedin, upload.array('images'), mw.joiSchemaValdation, (req, res) => {
    //     console.log(req.body);
    //     console.log(req.files);
    //     res.send(`req.files: ${req.files}`);

    // }); //multer parsed data 테스트 용도

router.get('/new', mw.isLoggedin, campgrounds.showNew);

router.route('/:id')
    .get(mw.isLoggedin, catchAsync(campgrounds.showId))
    //after user authentication(isLoggedin), then check user authorization(isAuth)
    .put(mw.isLoggedin, mw.isAuth, catchAsync(campgrounds.editId))
    .delete(mw.isLoggedin, mw.isAuth, catchAsync(campgrounds.deleteId));

router.get('/:id/edit', mw.isLoggedin, catchAsync(campgrounds.showEdit));

module.exports = router;
