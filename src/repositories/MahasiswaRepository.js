import fs from 'fs';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import Mahasiswa from '../models/Mahasiswa';
import HttpMessageConstants from '../constants/HttpMessageConstants';
import HttpStatusConstants from '../constants/HttpStatusConstants';
import { sendEmail } from '../utils/CommonUtils';

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR
} = HttpStatusConstants;
const {
  EMAIL_NOT_FOUND,
  EMAIL_PASSWORD_NOT_MATCH,
  SUCCESSFULLY_SIGNIN,
  UNABLE_UPDATE_USER,
  RESET_PASSWORD_SUCCESSFULLY,
  TOKEN_NOT_FOUND_EXPIRED,
  PASSWORD_NOT_MATCH,
  UNABLE_UPDATE_PASSWORD,
  PASSWORD_SUCCESSFULLY_RESET
} = HttpMessageConstants;

class MahasiswaRepository {
    static getAllDataMahasiswa = async () => {
      return Mahasiswa.find({});
    }

    static doRegistrationDataMahasiswa = async (payload) => {
      return Mahasiswa.create(payload);
    }

    static uploadImageData = async (path, mimetype, mahasiswaId) => {
      fs.readFile(path, async (err, data) => {
        if (err) throw err;

        await Mahasiswa.updateOne(
          { _id: mongoose.Types.ObjectId(mahasiswaId) },
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
    }

    static doLoginUserData = async (email, password, res) => {
      return Mahasiswa.findOne({ email }, (err, mahasiswa) => {
        if (err || !mahasiswa) {
          return res.status(HTTP_STATUS_BAD_REQUEST).json({
            error: EMAIL_NOT_FOUND
          });
        }

        // Authenticate User
        if (!mahasiswa.authenticate(password)) {
          return res.status(HTTP_STATUS_BAD_REQUEST).json({
            error: EMAIL_PASSWORD_NOT_MATCH
          });
        }

        // Create Token
        const token = jwt.sign({ _id: mahasiswa._id }, process.env.SECRET);

        // Put token in cookie
        const date = new Date();
        date.setDate(date.getDate() + 1);
        res.cookie('token', token, { expires: date });

        // Send response
        const { _id, name, email } = mahasiswa;
        return res.json({
          message: SUCCESSFULLY_SIGNIN,
          token,
          mahasiswa: { _id, name, email }
        });
      });
    }

    static updateProfileDataByMahasiswaId = async (mahasiswaId, payload) => {
      return Mahasiswa.updateOne(
        { _id: new mongoose.Types.ObjectId(mahasiswaId) },
        { $set: payload }
      );
    }

    static doResetPasswordData = async (email, res) => {
      Mahasiswa.findOne({ email }, (err, mahasiswa) => {
        if (err || !mahasiswa) {
          return res.status(HTTP_STATUS_NOT_FOUND).send({ error: 'User not found' });
        }

        // Generate a password reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetExpires = Date.now() + 3600000; // 1 hour

        // Save the token and expiration date to the user's account
        Mahasiswa.findByIdAndUpdate(mahasiswa._id,
          { resetToken, resetExpires },
          { new: true, useFindAndModify: false },
          (error) => {
            if (error) {
              return res.status(HTTP_STATUS_BAD_REQUEST).json({
                error: UNABLE_UPDATE_USER
              });
            }
            // Send email with the password reset link
            sendEmail(email, resetToken);
            res.status(HTTP_STATUS_OK).json({
              message: RESET_PASSWORD_SUCCESSFULLY
            });
          });
      });
    }

    static addNewPasswordData = async (password, confirmPassword, token, res) => {
      if (password !== confirmPassword) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          error: PASSWORD_NOT_MATCH
        });
      }
      return Mahasiswa.findOne(
        { resetToken: token, resetExpires: { $gt: Date.now() } },
        (err, mahasiswa) => {
          if (err || !mahasiswa) {
            return res.status(HTTP_STATUS_NOT_FOUND).json({
              error: TOKEN_NOT_FOUND_EXPIRED
            });
          }

          // Hash the new password
          const hashedPassword = bcrypt.hashSync(password, 8);

          // Save the new password to the user's account
          Mahasiswa.findByIdAndUpdate(mahasiswa._id,
            {
              encrypt_password: hashedPassword,
              resetToken: null,
              resetExpires: null
            },
            { new: true, useFindAndModify: false },
            (error) => {
              if (error) {
                // handle error
                return res
                  .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
                  .json({ error: UNABLE_UPDATE_PASSWORD });
              }
              res
                .status(HTTP_STATUS_OK)
                .json({ message: PASSWORD_SUCCESSFULLY_RESET });
            });
        }
      );
    }
}

export default MahasiswaRepository;
