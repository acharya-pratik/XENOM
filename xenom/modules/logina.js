const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  email: String,
  password: String
});

module.exports = mongoose.model('Login', loginSchema);
