const mongoose = require('mongoose');

const networkSchema = mongoose.Schema({
  status: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true}, // person whom requesting to join
  requesteeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true } // person like to joined
});

module.exports = mongoose.model('Network', networkSchema);
