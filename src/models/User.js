const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

const userSchema = new mongoose.Schema({
  userId: {
    type: String
  },
  name: {
    type: String,
    required: true,
    minlength: 4,
    trim: true
  },
  nim: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    minlength: 12,
    trim: true,
    unique: true
  },
  phoneNo: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 13
  },
  religion: {
    type: String,
    enum: ['Buddha', 'Hindu', 'Islam', 'Katolik', 'Kristen', 'Konghucu'],
    require: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    require: true
  },
  image: {
    data: Buffer,
    contentType: String
  },
  encrypt_password: {
    type: String,
    required: true,
  },
  salt: String,
  resetToken: {
    type: String
  },
  resetExpires: {
    type: Date
  }
}, { timestamps: true });

userSchema.virtual('password')
  .set(function (password) {
    this.newPassword = password;
    this.salt = uuidv1();
    this.encrypt_password = this.securePassword(password);
  })
  .get(function () {
    return this.newPassword;
  });

userSchema.methods = {
  authenticate(plainPassword) {
    return this.securePassword(plainPassword) === this.encrypt_password;
  },

  securePassword(plainPassword) {
    if (!plainPassword) return '';
    try {
      return crypto
        .createHmac('sha256', this.salt)
        .update(plainPassword)
        .digest('hex');
    } catch (err) {
      return '';
    }
  }
};

module.exports = mongoose.model('User', userSchema);
