const Account = require('../models/Account');
const User = require('../models/User');
const { hash, compare } = require('bcryptjs');
const sign = require('jsonwebtoken/sign');
const checkAuth = require('../../utilities/auth');

const { UserInputError, AuthenticationError } = require('apollo-server-errors');

const generateToken = (dbObject) => {
    return sign({
        id: dbObject.id,
        email: dbObject.email,
        username: dbObject.username
    }, process.env.SECRET_KEY, {
        expiresIn: '1h'
    });
};

module.exports = {
    Query: {
        getAccounts: async (_, { }, context) => {
            const account = checkAuth(context);
            try {
                const accountData = await Account.findById(account.id);
                if (accountData) {
                    const accountList = await Account.find().sort({ createdAt: -1 });
                    return accountList;
                } else {
                    throw new uthenticationError("Token is invalid!");
                }
            } catch (error) {
                throw new Error(error);
            }
        },

        getAccountDetails: async (_, { accountId }, context) => {
            const account = checkAuth(context);
            try {
                const userData = await Account.findById(account.id);
                if (userData) {
                    const accountFromDb = await Account.findOne({ _id: accountId });
                    if (accountFromDb) {
                        return accountFromDb;
                    } else {
                        throw new Error('Account not found!');
                    }
                } else {
                    throw new AuthenticationError("Token is invalid!");
                }
            } catch (error) {
                throw new Error(error);
            }
        }
    },

    Mutation: {
        register: async (_, args, context, info) => {

            let {
                regAccountInput: { username, email, accessType, signupAt, password, confirmPassword },
            } = args;

            let {
                regUserInput: { firstName, middleName, lastName, nickname,
                    birthdate, fbAccount, contactNo, emailAdd, status, position, type, group,
                    yearBaptism, position1FC, eon }
            } = args;

            const exisitingUsername = await Account.findOne({ username: username });
            if (exisitingUsername) {
                throw new UserInputError("Username already exists.", {
                    errors: {
                        username: "\'" + username + "\' is already taken."
                    }
                });
            }

            const exisitingEmail = await Account.findOne({ email: email });
            if (exisitingEmail) {
                throw new UserInputError("Email is already used.", {
                    errors: {
                        email: "\'" + email + "\' is already used."
                    }
                });
            }

            if (password !== confirmPassword) {
                throw new UserInputError("Password did not match!", {
                    errors: {
                        password: "confirm password did not match"
                    }
                });
            }

            password = await hash(password, 12);

            const newAccount = new Account({
                username,
                email,
                password,
                accessType,
                signupAt,
                createdAt: new Date().toString(),
                updatedAt: new Date().toString()
            });

            const addAccount = await newAccount.save();

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
                accountId: addAccount.id,
                signupAt,
                createdAt: new Date().toString(),
                updatedAt: new Date().toString()
            });

            const addUser = await newUser.save();

            return {
                id: addAccount.id,
                ...addAccount._doc,
                user: {
                    ...addUser._doc
                }
            };
        },

        login: async (_, args, context, info) => {
            let {
                loginInput: { username, password }
            } = args;

            const errors = {};

            const existingAccount = await Account.findOne({ username });

            if (!existingAccount) {
                errors.general = "Account is not found.";
                throw new UserInputError('Account is not found', { errors });
            }

            const verified = await compare(password, existingAccount.password);
            if (!verified) {
                errors.general = "Invalid Credentials.";
                throw new UserInputError('Invalid Credentials', { errors });
            }

            const token = generateToken(existingAccount);

            return {
                account: existingAccount,
                token
            };
        },

        deleteAccount: async (_, args, context, info) => {
            let {
                accountId
            } = args;

            const errors = {};

            const accountData = checkAuth(context);
            try {
                const myAccount = await Account.findById(accountData.id);

                if (!myAccount) {
                    return {
                        message: "Account is invalid!"
                    };
                }

                if (myAccount.accessType === "ADMIN" || myAccount.accessType === "SUPERADMIN") {

                    const deletedAccount = await Account.findOne({ _id: accountId });

                    if (deletedAccount) {
                        await Account.findByIdAndDelete(accountId);
                        return {
                            message: "Account is deleted!",
                            accountId
                        };
                    } else {
                        return {
                            message: "Account is not found!",
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

        updateAccount: async (_, args, context, info) => {

            let {
                updateAccountInput: { username, email, accessType, signupAt, password },
                updateAccountInput,
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
                    const updatedAccount = await Account.findOne({ _id: accountId });

                    if (updatedAccount) {
                        if (password) {
                            password = await hash(password, 12);
                            updateAccountInput.password = password;
                        }

                        updateAccountInput.updatedAt = new Date();
                        const afterUpdate = await Account.findByIdAndUpdate(accountId,
                            updateAccountInput,
                            { new: true }
                        );
                        return {
                            message: "Account has been updated!",
                            id: accountId,
                            ...afterUpdate._doc
                        };
                    } else {
                        return {
                            message: "Account is not found!",
                            id: accountId,
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