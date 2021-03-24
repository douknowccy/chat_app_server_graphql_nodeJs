const { UserInputError, AuthenticationError } = require("apollo-server");
const Chat = require("../../models/Chat");
const checkAuth = require("../../util/checkAuth");

module.exports = {
  Mutation: {
    createMessage: async (_, { chatId, body }, context) => {
      const { username } = checkAuth(context);
      if (body.trim() === "")
        throw new UserInputError("empty comment", {
          errors: { body: "message body must not empty" },
        });

      const chat = await Chat.findById(chatId);

      if (chat) {
        chat.messages.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
        });

        await chat.save();
        // 指傳回index:0的messages 讓前端update chatId裡面的message local state
        context.pubsub.publish("NEW_MESSAGE", {
          newMessage: { message: chat.messages[0], chatId },
        });
        return chat;
      }
      throw new UserInputError("Chat not found");
    },
    deleteMessage: async (_, { chatId, messageId }, context) => {
      const { username } = checkAuth(context);
      const chat = await Chat.findById(chatId);
      if (!chat) throw new UserInputError("Chat not found");

      const messageIndex = chat.messages.findIndex((c) => c.id === messageId);

      if (chat.messages[messageIndex].username === username) {
        chat.messages.splice(messageIndex, 1);
        await chat.save();
        return chat;
      }
      throw new AuthenticationError("Action not Allowed");
    },
  },
  // TODO:subscribe Messages update
  // 當有create messages的時候 發送消息
  Subscription: {
    newMessage: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_MESSAGE"),
    },
  },
};
