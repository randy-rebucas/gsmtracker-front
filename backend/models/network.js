const mongoose = require('mongoose');

const networkSchema = mongoose.Schema({
    requesteeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true }, // person like to joined
    networkLists: [{
        status: { type: Number, default: 0 }, // 0 = pending, 1 = denied, 2 = accept
        created: { type: Date, default: Date.now },
        requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true } // person whom requesting to join
    }],
});

module.exports = mongoose.model('Network', networkSchema);