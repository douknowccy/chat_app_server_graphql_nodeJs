const chatsResolvers = require("./chats");
const usersResolvers = require("./users");
const messagesResolvers = require("./messages");
module.exports = {
  Query: {
    ...chatsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...chatsResolvers.Mutation,
    ...messagesResolvers.Mutation,
  },
  Subscription: {
    ...chatsResolvers.Subscription,
    ...messagesResolvers.Subscription,
  },
};
