const chatsResolvers = require("./chats");
const usersResolvers = require("./users");

module.exports = {
  Query: {
    ...chatsResolvers.Query,
  },
};
