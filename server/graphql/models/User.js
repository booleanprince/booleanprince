const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    firstName: String,
    middleName: String,
    lastName: String,
    nickname: String,
    birthdate: String,
    fbAccount: String,
    contactNo: String,
    emailAdd: String,
    status: String,
    position: String,
    type: String,
    group: String,
    yearBaptism: Number,
    position1FC: String,
    eon: String,
    accountId: String,
    createdAt: String,
    updatedAt: String,
});

module.exports = model('User', userSchema);