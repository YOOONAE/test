const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const CampGround = require('./models/main');
const methodOverride = require('method-override'); 
const engine = require('ejs-mate');

const db = mongoose.connect('mongodb://localhost:27017/yelpcamp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
db.then(()=> {
    console.log('connected to Mongo DB!');
})


//to use req.body. it must be needed.
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.engine('ejs', engine); //connect ejs-mate to ejs, then boilerplate layout can be used.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.get('/main', async (req, res)=> {
    console.log("Basic route opened!!");
    const allData = await CampGround.find({});
    // console.log(`alldata:::: ${allData}`);

    res.render('campground/main', {allData});
})
app.post('/main', async (req, res) => {
    console.log('New -> save() function opened');
    console.log(`title: ${req.body.campground.title}`);
    console.log(`image: ${req.body.campground.image}`);
    console.log(`location: ${req.body.campground.location}`);
    console.log(`price: ${req.body.campground.price}`);
    console.log(`desc: ${req.body.campground.description}`);

    //it could take some time to save data into DB, so you better use await keyword
    //so that it waits until it saves data completely and redirect page.
    const newData = new CampGround(req.body.campground);

    // console.log(`newdata::::: ${newData}`);

    await newData.save();
    // console.log(newData);
    res.redirect('/main');
})

app.get('/main/new', (req, res) => {
    // console.log('new page works in express');
    res.render('campground/new');
})

const passwordValidation = (req, res, next) => {
    if(req.query.q=='1029') {
        return next();
    } else {
        res.send('password invalid');
    }
}

//61f170f1ec6428149a997b09, testing in progress with this id num
app.get('/main/:id', async (req, res) => {
    // console.log('id page works');
    const {id} = req.params;
    const foundData = await CampGround.findById(id);
    console.log(`foundData::: ${foundData}`);
    res.render('campground/showbyid',{foundData});
})

app.put('/main/:id', async(req, res) => {
    await CampGround.findByIdAndUpdate(req.params.id,{...req.body.campground}, {new: true, useFindAndModify: false});
    
    res.redirect(`/main/${req.params.id}`);
})


app.get('/main/:id/edit', async(req, res) => {
    const {id} = req.params;
    const foundData = await CampGround.findById(id);
    console.log(foundData);
    res.render('campground/edit', {foundData});
})

app.delete('/main/:id', async(req, res) => {
    await CampGround.findByIdAndDelete(req.params.id, {useFindAndModify: false});
    res.redirect('/main');
})

app.listen(3000, ()=> {
    console.log("Port open!!");
})