const mongoose = require('mongoose');

const personSchema = mongoose.Schema({
    firstname: { type: String, required: true },
    midlename: { type: String, default: null },
    lastname: { type: String, required: true },
    contact: { type: String, default: null },
    gender: { type: String, default: null },
    address: [{
      current: { type: Boolean },
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

// personSchema.virtual('fullName').get(function() {
//   return this.firstName + ' ' + this.lastName
// })

// personSchema.virtual('fullName').set(function(name) {
//   let str = name.split(' ')

//   this.firstName = str[0]
//   this.lastName = str[1]
// })
