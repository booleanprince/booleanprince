const { model, Schema } = require('mongoose');

const accountSchema = new Schema({
    username: String,
    email: String,
    password: String,
    accessType: String,
    signupAt: String,
    createdAt: Date,
    updatedAt: Date,
});

module.exports = model('Account', accountSchema);