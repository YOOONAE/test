const {joiSchema, joiReviewSchema} = require('./utils/joiSchema');
const AppError = require('./AppError');

//login check middleware(to be)
const isLoggedin = function(req, res, next) {
    req.session.returnTo = req.originalUrl;
    const auth = req.isAuthenticated();
    if(!auth) {
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

module.exports = {isLoggedin, joiSchemaValdation, reviewSchemaValdation};