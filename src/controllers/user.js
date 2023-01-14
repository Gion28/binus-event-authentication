const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const fs = require('fs');
const HttpStatusConstants = require('../constants/HttpStatusConstants');
const User = require('../models/User');

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_INTERNAL_SERVER_ERROR
} = HttpStatusConstants;

exports.doRegistration = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(HTTP_STATUS_BAD_REQUEST).json({
      error: errors.array()[0].msg
    });
  }
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(HTTP_STATUS_BAD_REQUEST).json({
        error: 'Unable to add user. Please check your input!'
      });
    }

    return res.json({
      message: 'Yeay, Successfully signup!',
      user
    });
  });
};

exports.uploadImageProfileData = (req, res, next) => {
  try {
    const { path, mimetype } = req.file;
    const { nim } = req.body;

    fs.readFile(path, async (err, data) => {
      if (err) throw err;

      await User.updateOne(
        { nim },
        {
          $set: {
            image: {
              data,
              contentType: mimetype
            }
          }
        }
      );
    });
    res
      .status(HTTP_STATUS_OK)
      .json({
        message: 'Image profile has been successfully uploaded!'
      });
  } catch (error) {
    next(error);
  }
};

exports.doLogin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(HTTP_STATUS_BAD_REQUEST).json({
        error: 'Email was not found. Please check again!'
      });
    }

    // Authenticate User
    if (!user.authenticate(password)) {
      return res.status(HTTP_STATUS_BAD_REQUEST).json({
        error: 'Email and Password do not match. Please check your email and password!'
      });
    }

    // Create Token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    // Put token in cookie
    const date = new Date();
    date.setDate(date.getDate() + 1);
    res.cookie('token', token, { expires: date });

    // Send response
    const { _id, name, email } = user;
    return res.json({
      message: 'Yeay, Successfully sign in!',
      token,
      user: { _id, name, email }
    });
  });
};

const sendEmail = (email, token) => {
  // Create a transporter object to send the email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_SECRET,
      pass: process.env.PASSWORD_SECRET,
    }
  });

  // Create the email message
  const mailOptions = {
    from: `"Admin Binus Event" <${process.env.USER_SECRET}@gmail.com>`,
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
    if (err || !user) {
      return res.status(HTTP_STATUS_NOT_FOUND).send({ error: 'User not found' });
    }

    // Generate a password reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetExpires = Date.now() + 3600000; // 1 hour

    // Save the token and expiration date to the user's account
    User.findByIdAndUpdate(user._id,
      { resetToken, resetExpires },
      { new: true, useFindAndModify: false },
      (err) => {
        if (err) {
          return res.status(HTTP_STATUS_BAD_REQUEST).json({
            error: 'Unable to update the user. Please check again!'
          });
        }
        // Send email with the password reset link
        sendEmail(email, resetToken);
        res.status(HTTP_STATUS_OK).json({
          message: 'Password reset email successfully sent!'
        });
      });
  });
};

exports.createNewPassword = (req, res) => {
  const { password, token } = req.body;

  // Find the user in the database by the token
  User.findOne(
    { resetToken: token, resetExpires: { $gt: Date.now() } },
    (err, user) => {
      if (err || !user) {
        // Handle error or token not found or invalid
        return res.status(HTTP_STATUS_NOT_FOUND).json({
          error: 'Token not found or expired!'
        });
      }

      // Hash the new password
      const hashedPassword = bcrypt.hashSync(password, 8);

      // Save the new password to the user's account
      User.findByIdAndUpdate(user._id,
        {
          encrypt_password: hashedPassword,
          resetToken: null,
          resetExpires: null
        },
        { new: true, useFindAndModify: false },
        (err) => {
          if (err) {
            // handle error
            return res
              .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
              .json({ error: 'Unable to update the password' });
          }
          res
            .status(HTTP_STATUS_OK)
            .json({ message: 'Password reset successfully' });
        });
    }
  );
};

exports.updateProfileByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    await User.updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $set: req.body }
    );
    res
      .status(HTTP_STATUS_OK)
      .json({
        message: 'Profile has been successfully updated!'
      });
  } catch (error) {
    next(error);
  }
};

exports.checkToken = (req, res) => {
  // Get token from the request header
  const token = req.header['x-access-token'] || req.body.token;

  // If there is no token, return error
  if (!token) {
    return res.status(HTTP_STATUS_UNAUTHORIZED).send({
      error: 'No token provided!'
    });
  }

  // Verify token
  jwt.verify(token, process.env.SECRET, (err, decode) => {
    if (err) {
      return res.status(HTTP_STATUS_UNAUTHORIZED).send({
        error: 'Invalid token!'
      });
    }

    // If the token is valid, find the associated user in the database
    User.findById(decode._id, (error, user) => {
      if (error || !user) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({
          error: 'User not found!'
        });
      }

      // If the user is found, allow them to access the requested resource
      res.send({ user });
    });
  });
};
