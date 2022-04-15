const express = require('express');
const router = express.Router();
const passport = require('passport');
const users = require('../controllers/users');

router.route('/register')
    .get(users.showRegister)
    .post(users.register);

//login route
router.route('/login')
    .get(users.showLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login' }), users.login)

router.get('/logout', users.logout);

module.exports = router;
