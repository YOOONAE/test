//define express
const express = require('express');
const app = express();
const methodOverride = require('method-override');
//define express routers
const router = express.Router();
const mainRouter = require('./routes/mainRoute');
const reviewRouter = require('./routes/reviewRoute');
const registerRouter = require('./routes/registerRoute')
//define ejs and default dir
const engine = require('ejs-mate');
const path = require('path');
//define mongoose and mongoDB database motel
const mongoose = require('mongoose');
const User = require('./models/users')
//define session/flash
const session = require('express-session');
const flash = require('connect-flash');
//define user auth library
const passport = require('passport');
const LocalStrategy = require('passport-local')
//define customized error handling function
const AppError = require('./AppError');

//connect mongoDB by using mongoose
mongoose.connect('mongodb://localhost:27017/yelpcamp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => { console.log('connected to Mongo DB!') })

//Default session setting, if you want to use passport with connect-session, it must come first
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'myauthbasic'
}));

//to use req.body. it must be needed.
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//ejs setting + ejs directory path default setting
app.engine('ejs', engine); //connect ejs-mate to ejs, then boilerplate layout can be used.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//flash setting
app.use(flash());

//local variables setting that can be used in ejs files without sending it seperately from js code
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

//router setting
app.use('/main', mainRouter);
app.use('/main/:id/reviews', reviewRouter);
app.use('/users', registerRouter);

//404 page route
app.use((req, res, next) => {
    throw new AppError('Unfortunately.. Page not Found', 404);
})


//error handling middleware 1
app.use((err, req, res, next) => {
    //message comes from Error class by xthe system default. it contains error message from javascript.
    //but if the message doesn't have any thing in it, then the below destructor will set a default message.
    const { message = "something went wrong", status = 500 } = err;
    // console.log();
    console.log('-----------------1st error middleware------------------');
    // console.log(`message::: ${message} /// status::: ${status}`);
    // console.log('-----------------1st error middleware------------------');
    // console.log();
    next(err);
})

//error handling middleware 2
app.use((err, req, res, next) => {
    // console.log();
    console.log('-----------------2nd error middleware------------------');
    console.log(`!!!!err.msg!!! : ${err.message} &&&& ${err.name}`);
    // res.send(`err.msg : ${err.message} &&&& ${err.name}`);
    // console.log('-----------------2nd error middleware------------------');
    // console.log();
    // res.send(err.message);

    // req.flash('error', err.message);
    // const redirectURL = req.session.returnTo || '/main';
    // console.log(`redirectURL_2 = ${redirectURL}`);
    // delete req.session.returnTo;
    // res.redirect(redirectURL);
    //에러 보여주고 이전페이지로(new로 돌아가는것 고민, 가격란에 일부러 텍스트 넣고 오류 발생시킴)

    res.render('campground/error', { err });
})


app.listen(3000, () => {
    console.log("Port open!!");
})
