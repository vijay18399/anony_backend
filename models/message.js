var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MessageSchema = new Schema({
  to: String,
  from: String,
  name:String,
  message: String,
  createdAt: Date,
  isfile: { type: Boolean, default: false },
  ext: String,
  file: String,
  original: String,
  isSeen: { type: Boolean, default: false },
  isSent: { type: Boolean, default: false }
});
module.exports = mongoose.model('Message', MessageSchema);