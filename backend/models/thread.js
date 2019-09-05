const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const threadSchema = mongoose.Schema({
    created: { type: Date, default: Date.now },
    message: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true }
});

module.exports = mongoose.model('Thread', threadSchema);
