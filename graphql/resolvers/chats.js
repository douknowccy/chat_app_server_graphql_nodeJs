const Chat = require("../../models/Chat");
const checkAuth = require("../../util/checkAuth");
const { AuthenticationError } = require("apollo-server");
module.exports = {
  Query: {
    getChats: async () => {
      try {
        const chats = await Chat.find().sort({ createdAt: -1 });

        return chats;
      } catch (error) {
        throw new Error(error);
      }
    },
    getChat: async (_, { chatId }) => {
      try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
          throw new Error("Chat not found");
        }
        return chat;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    createChat: async (_, { body }, context) => {
      const user = checkAuth(context);

      const newChat = new Chat({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const chat = await newChat.save();
      return chat;
    },
    deleteChat: async (_, { chatId }, context) => {
      const user = checkAuth(context);
      try {
        const chat = await Chat.findById(chatId);
        if (user.username === chat.username) {
          await chat.delete();
          return "Chat deleted suscessful";
        }
        throw new AuthenticationError("Action not allowed");
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
