const mongoose = require('mongoose');

const planSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Plan', planSchema);
