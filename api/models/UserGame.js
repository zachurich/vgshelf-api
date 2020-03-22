import mongoose from "mongoose";
import { PACKAGING, COMPLETENESS } from "../../common/constants.js";

// Users need to be able to add custom properties to a game, but we don't want
// to modify the game for everyone, so users have their own game instance that wraps
// the shared game
const UserGame = new mongoose.Schema({
  refId: {
    type: mongoose.Types.ObjectId,
    ref: "Game"
  },
  added: { type: Date, default: Date.now },
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
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  }
});

export default mongoose.model("UserGame", UserGame);
