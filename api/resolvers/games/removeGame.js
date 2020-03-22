const _ = require("lodash");
const User = require("../../models/User");
const Game = require("../../models/Game");
const Collection = require("../../models/Collection");
const { createResponse, handleResponse } = require("../utils");

// {
// 	"gameId": "" (Required)
// 	"userId": "",
// }
const RemoveGame = async (req, res, next) => {
  const { gameId, userId = null } = req.body;
  let response;
  try {
    if (userId) {
      const user = await User.findOne({ userId });
      if (user) {
        await removeGameFromCollections(user, gameId);
        const removedFromUser = await removeGameFromUser(user, gameId);
        if (removedFromUser) {
          response = createResponse("Game removed from user!", {});
        } else {
          response = createResponse("User doesn't have game in collection!", {}, 400);
        }
      } else {
        response = createResponse("No user found!", {}, 400);
      }
    } else {
      const users = await User.find();
      users.forEach(async user => {
        await removeGameFromUser(user, gameId);
      });
      const { deletedCount } = await Game.deleteOne({ _id: gameId });
      response = createResponse(
        "Deleted game from database and all users.",
        deletedCount
      );
    }
  } catch (e) {
    response = createResponse("There was an error removing the game!", e, 500);
  }
  return handleResponse(res, response);
};

async function removeGameFromCollections(user, gameId) {
  user.collections.forEach(async shelf => {
    const foundShelfGame = shelf.games.includes(gameId);
    if (foundShelfGame) {
      shelf.games = shelf.games.filter(id => id != gameId);
      console.log(`Removed game from shelf ${shelf.name}`);
    }
  });
  await user.save();
}

async function removeGameFromUser(user, gameId) {
  const foundGame = user.games.includes(gameId);
  if (foundGame) {
    user.games = user.games.filter(id => id != gameId);
    console.log(`Removed game from ${user.username}`);
    await user.save();
    return true;
  }
}

module.exports = RemoveGame;
