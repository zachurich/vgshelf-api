const mongoose = require("mongoose");
const uniqueRequired = { unique: true, required: true };

const ShelfSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  created: { type: Date, default: Date.now },
  games: [
    {
      type: mongoose.Types.ObjectId,
      ref: "UserGame"
    }
  ]
});

const User = new mongoose.Schema({
  userId: { type: String, ...uniqueRequired },
  username: { type: String, ...uniqueRequired },
  emailAddress: { type: String, ...uniqueRequired },
  created: { type: Date, default: Date.now },
  collections: [ShelfSchema],
  games: [
    {
      type: mongoose.Types.ObjectId,
      ref: "UserGame"
    }
  ]
});

module.exports = mongoose.model("User", User);
