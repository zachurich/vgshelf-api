const mongoose = require("mongoose");
const uniqueRequired = { unique: true, required: true };
const { PACKAGING, COMPLETENESS } = require("../../common/constants");

// Users need to be able to add custom properties to a game, but we don't want
// to modify the game for everyone, so users have their own game instance that wraps
// the shared game
const userGame = {
  properties: {
    packaging: {
      type: String,
      enum: Object.keys(PACKAGING).map(key => PACKAGING[key])
    },
    completeness: {
      type: String,
      enum: Object.keys(COMPLETENESS).map(key => COMPLETENESS[key])
    },
    quantity: { type: Number, default: 1 },
    systems: [{ type: String }]
  },
  added: { type: Date, default: Date.now },
  id: {
    type: mongoose.Types.ObjectId,
    ref: "Game"
  }
};

const User = new mongoose.Schema({
  userId: { type: String, ...uniqueRequired },
  username: { type: String, ...uniqueRequired },
  emailAddress: { type: String, ...uniqueRequired },
  created: { type: Date, default: Date.now },
  collections: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Collection"
    }
  ],
  games: [userGame]
});

module.exports = mongoose.model("User", User);
