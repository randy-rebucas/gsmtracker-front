const mongoose = require('mongoose');

const planSchema = mongoose.Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    enabled: { type: Boolean, default: true }
    // products: [{
    //     name: { type: String, required: true },
    //     description: { type: String, required: true },
    //     short: { type: String },
    //     sku: { type: String, required: true },
    //     status: { type: Boolean, default: true },
    //     price: { type: String, required: true },
    //     image: { type: String }
    // }]
});

module.exports = mongoose.model('Plan', planSchema);