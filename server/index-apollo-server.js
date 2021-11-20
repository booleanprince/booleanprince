//Use Apollo Server without Express Middleware

const { ApolloServer } = require('apollo-server');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const mongoose = require('mongoose');
const path = require('path');

if (process.env.NODE_ENV !== 'production') {
    // require('dotenv').config();
    require('dotenv').config({ path: path.resolve(__dirname, '.env') });
}

console.log("NODE_ENV " + process.env);
console.log("NODE_ENV " + process.env.NODE_ENV);
console.log("MONGODB " + process.env.MONGODB);

mongoose.connect(process.env.MONGODB, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log('MongoDB is connected!');
});


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
});

server.listen({ port: process.env.PORT || 6000 })
    .then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
    });