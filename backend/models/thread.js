const mongoose = require('mongoose');

const threadSchema = mongoose.Schema({
    created: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Thread', threadSchema);
