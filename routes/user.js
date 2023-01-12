const express = require("express");
const { doRegistration, doLogin, doResetPassword, createNewPassword, checkToken } = require('../controllers/user');
const { check } = require("express-validator");

const router = express();

router.post('/registration', [
    check("name", "Name should be at least 4 characters").isLength({ min: 4 }),
    check("email", "Email should be valid").isEmail(),
    check("phoneNo", "Phone Number should be at least 10 characters").isLength({ min: 10, max: 13 }),
    check("password", "Password should be at least 6 characters").isLength({ min: 6 })
], doRegistration);

router.post('/login', doLogin);

router.get('/logout', (req, res) => {
    res.status(200).send({ auth: false, token: null });
});

router.post('/reset-password', doResetPassword);

router.post('/new-password', createNewPassword);

router.post('/check-token', checkToken);

module.exports = router;
