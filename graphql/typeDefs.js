const { gql } = require("apollo-server");
module.exports = gql`
  type Chat {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Query {
    getChats: [Chat]
    getChat(chatId: ID!): Chat
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createChat(body: String!): Chat!
    deleteChat(chatId: ID!): String!
  }
`;
