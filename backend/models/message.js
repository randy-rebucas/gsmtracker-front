const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const messageSchema = mongoose.Schema({
    type: { type: String, default: 'private' }, //private
    created: { type: Date },
    // roomId: { type: String }, //room
    message: { type: String, required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true }
});

module.exports = mongoose.model('Messages', messageSchema);