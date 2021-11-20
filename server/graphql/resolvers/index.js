//Resolvers dictates how the data of a particular type is fetched
const AccountResolvers = require('./accounts');
const UserResolvers = require('./users');

module.exports = {
    Query: {
        ...UserResolvers.Query,
        ...AccountResolvers.Query,
    },
    Mutation: {
        ...UserResolvers.Mutation,
        ...AccountResolvers.Mutation,
    }
};