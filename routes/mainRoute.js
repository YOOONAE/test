const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const CampGround = require('../models/campground');
const Review = require('../models/review');
const {joiReviewSchema} = require('../utils/joiSchema');
const AppError = require('../AppError');
const {isLoggedin, joiSchemaValdation} = require('../middleware');

// app.get('/main') - Go to Main page to show all the list
// app.get('/main/new') - Go to New page(input) to create a data set
// app.get('/main/:id') - Go to Show page for a single data set
// app.get('/main/:id/edit') - Go to Edit(input) page for a single data set
// app.post('/main') - Run the route to save a data set passed from (main/new)
// app.put('/main/:id) - Run the route to save a single data set edited in (main/id/edit)
// app.delete('/main/:id') - Delete a data set from Main page
// app.post('/main/:id/reviews') - Run the route to save reviews
// app.delete('/main/:id/reviews/:reviewId') - Delete a review from ID show page

router.get('/', catchAsync(async (req, res)=> {
    console.log("Basic route opened!!");
    const allData = await CampGround.find({});
    delete req.session.returnTo;
    res.render('campground/main', {allData});
}))

router.use(isLoggedin, (req, res, next) => {
    console.log("mainRouter middleware route works");
    next();
})

router.get('/new', (req, res) => {
    res.render('campground/new');
})

router.get('/:id', catchAsync(async (req, res, next) => {
    // console.log('id page works')
    const {id} = req.params;
    const foundData = await CampGround.findById(id).populate('reviews').populate('author');

    console.log(`ShowById Route,, Found: ${foundData}`); // to see if what's included in this variable

    //compare the current user id and the owner of this post

    const userMatched = currentUser.equals(foundData.author._id);
    console.log(`User matched: ${userMatched}`);
    
    //catch mongoDB aync data load error. ex;nonexisting object ID
    if(!foundData) {
        throw new AppError('ID not found', 400); //throw here, catch(e) will catch, and error middleware will catch it
    }


    res.render('campground/showbyid',{foundData});
}))

router.get('/:id/edit', catchAsync(async(req, res) => {
    const {id} = req.params;
    const foundData = await CampGround.findById(id);
    console.log(`wow: ${foundData}`);
    res.render('campground/edit', {foundData});
}))

router.post('/', joiSchemaValdation, catchAsync(async (req, res, next) => {
    console.log('New -> save() function opened');
    //it could take some time to save data into DB, so you better use await keyword
    //so that it waits until it saves data completely and redirect page.
    const newData = new CampGround(req.body.campground);
    newData.author = req.user._id; //req.user from Passport after isLoggedin function run
    console.log(`newdata::::: ${newData}`);
    
    await newData.save();
    res.redirect('/main');
}))

router.put('/:id', catchAsync(async(req, res) => {
    await CampGround.findByIdAndUpdate(req.params.id,{...req.body.campground}, {new: true, useFindAndModify: false, runValidators: true});
    
    res.redirect(`/main/${req.params.id}`);
}))

router.delete('/:id', catchAsync(async(req, res) => {
    await CampGround.findByIdAndDelete(req.params.id, {useFindAndModify: false});
    res.redirect('/main');
}))

module.exports = router;
