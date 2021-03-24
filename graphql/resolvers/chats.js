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
      // subscribe+
      context.pubsub.publish("NEW_CHAT", {
        newChat: chat,
      });
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
    likeChat: async (_, { chatId }, context) => {
      const { username } = checkAuth(context);
      const chat = await Chat.findById(chatId);
      if (!chat) throw new UserInputError("Chat not found");
      if (chat.likes.find((like) => like.username === username)) {
        // already like
        chat.likes = chat.likes.filter((like) => like.username !== username);
      } else {
        // not like ,like chat
        chat.likes.push({ username, createdAt: new Date().toISOString() });
      }
      await chat.save();
      return chat;
    },
  },

  Subscription: {
    newChat: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_CHAT"),
    },
  },
};
