import { COMPLETENESS, PACKAGING } from "../../common/constants.js";

import Game from "./Game.js";
import mongoose from "mongoose";

// Users need to be able to add custom properties to a game, but we don't want
// to modify the game for everyone, so users have their own game instance that wraps
// the shared game
const UserGameSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  slug: {
    type: String,
  },
  refId: {
    type: mongoose.Types.ObjectId,
    ref: "Game",
  },
  added: {
    type: Date,
    default: Date.now,
  },
  properties: {
    packaging: {
      type: String,
      enum: Object.keys(PACKAGING).map((key) => PACKAGING[key]),
    },
    completeness: {
      type: String,
      enum: Object.keys(COMPLETENESS).map((key) => COMPLETENESS[key]),
    },
    quantity: {
      type: Number,
      default: 1,
    },
    systems: [
      {
        type: String,
      },
    ],
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

UserGameSchema.pre("save", async function (next) {
  const gameRef = await Game.findOne({ _id: this.refId });

  // find existing instances, so we can have some unique identifier for `slug`
  const existingGames = await UserGame.find({ title: gameRef.title });
  let slug = gameRef.slug;
  if (existingGames.length > 0) {
    slug += `-${existingGames.length + 1}`;
  }

  this.title = gameRef.title;
  this.slug = slug;
  next();
});

const UserGame = mongoose.model("UserGame", UserGameSchema);

export default UserGame;
