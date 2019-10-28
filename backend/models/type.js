const mongoose = require('mongoose');

const typeSchema = mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String },
    generated: { type: String, default: 'System' }
});

module.exports = mongoose.model('Type', typeSchema);
