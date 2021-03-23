const { model, Schema } = require("mongoose");

const messagesSchema = new Schema({
  body: String,
  username: String,
  createdAt: String,

  messages: [
    {
      body: String,
      username: String,
      createdAt: String,
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    },
  ],
});

module.exports = model("Chat", messagesSchema, "Chat");
