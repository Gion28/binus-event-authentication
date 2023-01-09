const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");


exports.doRegistration = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.status(400).json({
            error: errors.array()[0].msg
        })
    }
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                error: "Unable to add user"
            })
        }

        return res.json({
            message: "Successfully signup!",
            user
        })
    })
}

exports.doLogin = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "Email was not found. Please check again!"
            })
        }

        // Authenticate User
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: "Email and Password do not match. Please check your email and password!"
            })
        }

        // Create Token
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);

        // Put token in cookie
        var date = new Date();
        date.setDate(date.getDate() + 1);
        res.cookie('token', token, { expires: date })

        // Send response
        const { _id, name, email } = user
        return res.json({
            message: "Successfully signin!",
            token,
            user: { _id, name, email }
        })
    })
}
exports.checkToken = (req, res) => {
    // Get token from the request header
    const token = req.header['x-access-token'] || req.body.token;

    // If there is no token, return error
    if (!token) {
        return res.status(401).send({
            error: "No token provided!"
        });
    }

    // Verify token
    jwt.verify(token, process.env.SECRET, (err, decode) => {
        if (err) {
            return res.status(401).send({
                error: 'Invalid token!'
            });
        }

        // If the token is valid, find the associated user in the database
        User.findById(decode._id, (error, user) => {
            if (error || !user) {
                return res.status(404).send({
                    error: 'User not found!'
                })
            }

            // If the user is found, allow them to access the requested resource
            res.send({ user });
        });
    });
}
