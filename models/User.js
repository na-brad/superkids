const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  FriendRequestedBy: [{ type: Schema.Types.ObjectId, ref: "users" }],
  Friends: [{ type: Schema.Types.ObjectId, ref: "users" }],
  date: {
    type: Date,
    default: Date.now
  },
  path: {
    type: String
  }
});

module.exports = User = mongoose.model("users", UserSchema);
