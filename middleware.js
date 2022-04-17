const {joiSchema, joiReviewSchema} = require('./utils/joiSchema');
const catchAsync = require('./utils/catchAsync');
const AppError = require('./AppError');
const CampGround = require('./models/campground');

//login check middleware(to be)
const isLoggedin = function(req, res, next) {
    const auth = req.isAuthenticated();
    if(!auth) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you need to login first');
        return res.redirect('/users/login');
    }
    next();
}

const joiSchemaValdation = (req, res, next) => {
    const result = joiSchema.validate(req.body);
    if(result.error) {
        const {error} = result;
        throw new AppError(error.details.map(el => el.message), 400);
    } else {
        next();
    }
}

const reviewSchemaValdation = (req, res, next) => {
    console.log(req.body)
    console.log(`has been validated by JOI!!`);
    const {error} = joiReviewSchema.validate(req.body);
    if(error) {
        throw new AppError(error.details.map(el => el.message), 400);
    } else {
        next();
    }
}

//user authorization check
const isAuth = catchAsync(async function(req, res, next) {
    //findId and.. after loggedin, if it has req.user, then compare req.user with foundId here.
    //If they are matching, then go ahead updaing it. Otherwise, stop there and show error msg
    const foundData = await CampGround.findById(req.params.id);

    //if req.user._id from Passport (user Authenticated) matches the id from this route, 
    //then save. if not, error flash pops up
    if(foundData.author.equals(req.user._id)) {
        return next();
    }
    req.flash('error', 'You are not authorized');
    res.redirect(`/main/${req.params.id}`);
})

module.exports = {isLoggedin, joiSchemaValdation, reviewSchemaValdation, isAuth};