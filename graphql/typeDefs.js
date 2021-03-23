const { gql } = require("apollo-server");
module.exports = gql`
  type Chat {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }
  type Query {
    getChats: [Chat]
  }
`;
