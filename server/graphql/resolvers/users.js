const User = require('../models/User');
const Account = require('../models/Account');
const { hash, compare } = require('bcryptjs');
const sign = require('jsonwebtoken/sign');
const checkAuth = require('../../utilities/auth');

const { UserInputError, AuthenticationError } = require('apollo-server-errors');

module.exports = {
    Query: {
        getUsers: async (_, { }, context) => {
            const account = checkAuth(context);
            try {
                const accountData = await Account.findById(account.id);
                if (accountData) {
                    const userList = await User.find().sort({ createdAt: -1 });
                    return userList;
                } else {
                    throw new AuthenticationError("Token is invalid!");
                }
            } catch (error) {
                throw new Error(error);
            }
        },

        getUserDetails: async (_, { userId }, context) => {
            const account = checkAuth(context);
            try {
                const accountData = await Account.findOne({ _id: account.id });
                if (accountData) {
                    const userFromDb = await User.findOne({ _id: userId });
                    if (userFromDb) {
                        return userFromDb;
                    } else {
                        throw new Error('User not found!');
                    }
                } else {
                    throw new AuthenticationError("Token is invalid!");
                }
            } catch (error) {
                throw new Error(error);
            }
        },
    },

    Mutation: {
        createUser: async (_, args, context, info) => {
            const account = checkAuth(context);
            try {
                const accountData = await Account.findOne({ _id: account.id });
                if (accountData) {

                    if (accountData.accessType === "ADMIN" ||
                        accountData.accessType === "SUPERADMIN" ||
                        accountData.accessType === "ADMIN" ||
                        accountData.accessType === "OIC" ||
                        accountData.accessType === "PIC") {

                        let {
                            regUserInput: { firstName, middleName, lastName, nickname,
                                birthdate, fbAccount, contactNo, emailAdd, status, position, type, group,
                                yearBaptism, position1FC, eon },
                            accountId
                        } = args;

                        const newUser = new User({
                            firstName,
                            middleName,
                            lastName,
                            nickname,
                            birthdate,
                            fbAccount,
                            contactNo,
                            emailAdd,
                            status,
                            position,
                            type,
                            group,
                            yearBaptism,
                            position1FC,
                            eon,
                            accountId,
                            createdAt: new Date().toString(),
                            updatedAt: new Date().toString()
                        });

                        const addUser = await newUser.save();
                        return {
                            id: addUser.id,
                            ...addUser._doc
                        };
                    } else {
                        throw new AuthenticationError("User has no admin privileges!");
                    }
                } else {
                    throw new AuthenticationError("Token is invalid!");
                }
            } catch (error) {
                throw new Error(error);
            }
        },

        updateUser: async (_, args, context, info) => {

            let {
                updateUserInput,
                accountId
            } = args;

            const errors = {};

            const accountData = checkAuth(context);

            try {
                const myAccount = await Account.findById(accountData.id);

                if (!myAccount) {
                    return {
                        message: "User is invalid!"
                    };
                }

                let isAdmin = (myAccount.accessType === "ADMIN" || myAccount.accessType === "SUPERADMIN");

                if (isAdmin || myAccount.id === accountId) {
                    const updateUser = await User.findOne({ _id: myAccount.id });

                    if (updateUser) {
                        updateUserInput.updatedAt = new Date();
                        const afterUpdate = await User.findByIdAndUpdate(userId,
                            updateUserInput,
                            { new: true }
                        );
                        return {
                            message: "User has been updated!",
                            id: userId,
                            ...afterUpdate._doc
                        };
                    } else {
                        return {
                            message: "User is not found!",
                            id: userId,
                        };
                    }

                } else {
                    errors.general = "Access Error";
                    throw new AuthenticationError("User has no rights!", { errors });
                }
            } catch (error) {
                throw new Error(error);
            }
        },

        deleteUser: async (_, args, context, info) => {
            let {
                userId
            } = args;

            const errors = {};

            const accountData = checkAuth(context);
            try {
                const myAccount = await Account.findById(accountData.id);

                if (!myAccount) {
                    return {
                        message: "User is invalid!"
                    };
                }

                if (myAccount.accessType === "ADMIN" || myAccount.accessType === "SUPERADMIN") {

                    const deleteUser = await User.findOne({ _id: userId });

                    if (deleteUser) {
                        await User.findByIdAndDelete(userId);
                        return {
                            message: "User is deleted!",
                            userId
                        };
                    } else {
                        return {
                            message: "User is not found!",
                        };
                    }

                } else {
                    errors.general = "Access Error";
                    throw new AuthenticationError("User has no rights!", { errors });
                }
            } catch (error) {
                throw new Error(error);
            }
        },
    }
};