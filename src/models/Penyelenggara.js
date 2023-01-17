const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

const penyelenggaraSchema = new mongoose.Schema({
  penyelenggaraId: {
    type: String
  },
  name: {
    type: String,
    required: true,
    minlength: 4,
    trim: true
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

penyelenggaraSchema.virtual('password')
  .set(function (password) {
    this.newPassword = password;
    this.salt = uuidv1();
    this.encrypt_password = this.securePassword(password);
  })
  .get(function () {
    return this.newPassword;
  });

penyelenggaraSchema.methods = {
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

module.exports = mongoose.model('Penyelenggara', penyelenggaraSchema, 'penyelenggara');
