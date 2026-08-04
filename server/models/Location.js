const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Location', locationSchema);
