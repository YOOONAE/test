const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/users');

router.get('/register', (req, res) => {
    res.render('campground/register');
});

router.post('/register', async(req, res) => {
    try {
        const {email, username, password} = req.body.user;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);

        req.login(registeredUser, function(err) {
            if (err) { return next(err); }
            req.flash('success', 'New user account has been successfully created.');
            return res.redirect('/main');
        });

    } catch(e) {
        if(e.code = 11000) {
            req.flash('error', 'username duplicated');
            return res.redirect('/users/register');
        } // by using catchAsync..? update the catchAsync by adding the above code? with flash?
        req.flash('error', e.message);
        res.redirect('/users/register');
    }
});


//login route
router.get('/login', (req, res)=> {
    res.render('campground/login'); 
});

router.post('/login', 
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login' }),
    async(req, res) => {
        req.flash('success', 'Logged In succesfully!');
        const redirectURL = req.session.returnTo || '/main';
        delete req.session.returnTo;
        console.log(`req.session.returnTo(after deleting): ${req.session.returnTo}`);
        console.log(`redirectURL: ${redirectURL}`);
        res.redirect(redirectURL);
})

router.get('/logout', (req, res) => {
    req.logout();
    delete req.session.returnTo;
    req.flash('success', 'logout successfully');
    res.redirect('/users/login');
})


module.exports = router;
