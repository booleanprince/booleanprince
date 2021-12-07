const { gql } = require('apollo-server');

module.exports = gql`
    #Type Definitions for establishing GraphQL Schema
    scalar JSON

    #TypeDefs define the structure of the data that clients can query

    type Account {
        id: ID!
        username: String!
        email: String!
        accessType: String!
        signupAt: String
        createdAt: String
        updatedAt: String
    }

    type User {
        id: ID!
        accountId: ID
        firstName: String!
        lastName: String!
        middleName: String
        nickname: String
        birthday: String
        fbAccount: String
        contactNo: String
        emailAdd: String
        status: String!
        position: String!
        type: String!
        group: String!
        yearBaptism: Int!
        position1FC: String!
        eon: String!
        createdAt: String
        updatedAt: String
    }

    interface Response {
        success: Boolean
        message: String
    }

    type LoginResponse implements Response {
        account: Account,
        token: String
        success: Boolean
        message: String
    }

    type RegisterResponse implements Response{
        account: Account
        user: User
        success: Boolean
        message: String   
    }

    input RegisterAccountInput {
        username: String!
        email: String!
        accessType: String!
        signupAt: String!
        password: String!
        confirmPassword: String!
    }

    input RegisterUserInput {
        firstName: String!
        lastName: String!
        middleName: String
        nickname: String
        birthdate: String
        fbAccount: String
        contactNo: String
        emailAdd: String
        status: String!
        position: String!
        type: String!
        group: String!
        yearBaptism: Int!
        position1FC: String!
        eon: String!
    }

    input UpdateAccountInput {
        username: String
        email: String
        accessType: String
        signupAt: String
        password: String
    }

    input UpdateUserInput {
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
        yearBaptism: Int,
        position1FC: String,
        eon: String,
        accountId: String,
        createdAt: String,
        updatedAt: String
    }

    input LoginInput {
        username: String!
        password: String!
    }

    input AccountFilter {
        accessType: String
        signupAt: String
        createdAt: String
        updatedAt: String
    }

    #Queries in the API
    type Query {
        getAccounts(search: String, filter: AccountFilter): [Account]
        getAccountDetails(accountId: ID!): Account
        getUsers: [User]
        getUserDetails(userId: ID!): User
    }

    #Mutations in the API
    type Mutation {
        register(regAccountInput: RegisterAccountInput, regUserInput: RegisterUserInput): RegisterResponse
        login(loginInput: LoginInput): LoginResponse!
        createUser(regUserInput: RegisterUserInput, accountId: String): User!
        deleteAccount(accountId: ID!): JSON
        updateAccount(accountId: ID!, updateAccountInput: UpdateAccountInput!): Account
        updateUser(userId: ID!, updateUserInput: UpdateUserInput!): User
        deleteUser(userId: ID!): JSON
    }
`;