const mongoose = require('mongoose');

const personSchema = mongoose.Schema({
    firstname: { type: String, required: true },
    midlename: { type: String, default: null },
    lastname: { type: String, required: true },
    contact: { type: String, default: null },
    gender: { type: String, default: null },
    address: [{
      address1: { type: String, required: true }, // street address
      address2: { type: String }, // street address line 2
      city: { type: String, required: true },
      province: { type: String, required: true },
      postalCode: { type: Number, required: true },
      country: { type: String, required: true }
    }],
    birthdate: { type: Date, default: null },
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Person', personSchema);
