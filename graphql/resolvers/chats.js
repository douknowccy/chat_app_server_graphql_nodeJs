const Chat = require("../../models/Chat");

module.exports = {
  Query: {
    getChats: async () => {
      try {
        const chats = await Chat.find();

        return chats;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
