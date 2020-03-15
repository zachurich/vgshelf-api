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
        const data = await removeGameFromUser(user, gameId);
        if (data) {
          response = createResponse("Game removed from user!", data);
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
  const collections = await Collection.find({ user });
  collections.forEach(async shelf => {
    console.log(shelf.games);
    shelf.games = shelf.games.filter(game => game !== gameId);
    await shelf.save();
  });
  const userGame = user.games.id(gameId);
  if (userGame) {
    userGame.remove();
    const data = await user.save();
    return data;
  }
}

async function removeGameFromUser(user, gameId) {
  const userGame = user.games.id(gameId);
  if (userGame) {
    userGame.remove();
    const data = await user.save();
    return data;
  }
}

module.exports = RemoveGame;
