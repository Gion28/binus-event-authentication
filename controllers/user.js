const User = require("../models/user");
const {validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");
const crypto = require("crypto");

exports.doRegistration = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
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
    const {email, password} = req.body;
    User.findOne({email}, (err, user) => {
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
        const token = jwt.sign({_id: user._id}, process.env.SECRET);

        // Put token in cookie
        var date = new Date();
        date.setDate(date.getDate() + 1);
        res.cookie('token', token, {expires: date})

        // Send response
        const {_id, name, email} = user
        return res.json({
            message: "Successfully signin!",
            token,
            user: {_id, name, email}
        })
    })
}

const sendEmail = (email, token) => {
    // Create a transporter object to send the email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email-address@gmail.com', // Ini pake gmail admin
            pass: 'your-email-password',
        }
    });

    // Create the email message
    const mailOptions = {
        from: '"Your name" <your-email-address@gmail.com>',
        to: email,
        subject: 'Password reset link',
        text: `You are receiving this email because you (or someone else) has requested a password reset for your account.
    Please click on the following link, or paste this into your browser to complete the process:
    http://binus-event.com/reset-password/${token}
    If you did not request this, please ignore this email and your password will remain unchanged.`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log(`Email sent: ${info.response}`);
        }
    });
};

exports.doResetPassword = (req, res) => {
    const { email } = req.body;

    // Find the user in the database
    User.findOne({ email }, (err, user) => {
        console.log({user})
        if (err || !user) {
            return res.status(404).send({error: 'User not found'});
        }

        // Generate a password reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetExpires = Date.now() + 3600000; // 1 hour

        // Save the token and expiration date to the user's account
        User.findByIdAndUpdate(user._id,
            {resetToken, resetExpires},
            {new: true, useFindAndModify: false},
            (err) => {
                if (err) {
                    return res.status(400).json({
                        error: "Unable to update the user. Please check again!"
                    })
                }
                // Send email with the password reset link
                sendEmail(email, resetToken);
                res.status(200).json({
                    message: "Password reset email successfully sent!"
                });
            });
    })

}

exports.createNewPassword = (req, res) => {
    const {password, token} = req.body;

    // Find the user in the database by the token
    User.findOne(
        {resetToken: token, resetExpires: {$gt: Date.now()}},
        (err, user) => {
            if (err || !user) {
                // Handle error or token not found or invalid
                return res.status(404).json({
                    error: 'Token not found or expired'
                });
            }

            // Hash the new password
            const hashedPassword = bcrypt.hashSync(password, 8);

            // Save the new password to the user's account
            User.findByIdAndUpdate(user._id,
                {password: hashedPassword},
                {new: true, useFindAndModify: false},
                (err) => {
                    if (err) {
                        // handle error
                        return res.status(500).json({error: 'Unable to update the password'});
                    }
                    res.status(200).json({message: 'Password reset successfully'});
                });
        });
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
            res.send({user});
        });
    });
}
