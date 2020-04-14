var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true
  },
  fake_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  }

});

module.exports = mongoose.model('User', UserSchema);