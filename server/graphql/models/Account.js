const { model, Schema } = require('mongoose');

const accountSchema = new Schema({
    username: String,
    email: String,
    password: String,
    accessType: String,
    signupAt: String,
    createdAt: String,
    updatedAt: String,
});

module.exports = model('Account', accountSchema);