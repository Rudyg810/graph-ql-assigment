// Step 1: Launch GraphQL Server

const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const app = express();

// Step 2: Create a model for user data
let users = [
  { id: '1', name: 'John', age: 30, phoneNumber: '1234567890' },
  { id: '2', name: 'Alice', age: 25, phoneNumber: '9876543210' }
];

// Step 3: Define GraphQL schema
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    age: Int!
    phoneNumber: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, age: Int!, phoneNumber: String!): User!
    deleteUser(id: ID!): User!
  }
`;

// Step 4: Implement resolvers for CRUD operations
const resolvers = {
  Query: {
    users: () => users,
    user: (parent, { id }) => users.find(user => user.id === id)
  },
  Mutation: {
    createUser: (parent, args) => {
      const newUser = { id: String(users.length + 1), ...args };
      users.push(newUser);
      return newUser;
    },
    deleteUser: (parent, { id }) => {
      const userIndex = users.findIndex(user => user.id === id);
      if (userIndex !== -1) {
        const deletedUser = users.splice(userIndex, 1)[0];
        return deletedUser;
      }
      throw new Error('User not found');
    }
  }
};

// Step 5: Create ApolloServer and apply middleware to Express app
const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });

// Start the server
app.listen({ port: 4000 }, () =>
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
);
