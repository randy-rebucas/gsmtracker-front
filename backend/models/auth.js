const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');
const authSchema = mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

authSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Auth', authSchema);
