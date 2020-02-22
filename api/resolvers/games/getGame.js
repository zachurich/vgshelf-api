const uniqBy = require("lodash/uniqBy");
const User = require("../../models/User");
const Game = require("../../models/Game");
const Collection = require("../../models/Collection");
const { createDetailedGame } = require("./utils");
const { handleResponse, createResponse, handleErrors } = require("../utils");

/**
 * @field gameId (Required)- Game Unique ID from mongo collection
 *
 * @field userId (Optional) - ID of user in mongodb to get all games from
 * @field collectionId (Optional) - Collection Unique ID from mongodb collection
 * @field userName (Optional) - Username for user in mongodb
 */
const GetGame = async (req, res) => {
  const { gameId, userId = null, collectionId = null, userName = null } = req.query;
  let response = {};
  let query;
  try {
    // Get a single game by _id
    if (gameId) {
      query = { _id: gameId };
      response = await handleErrors(retrieveSingleGame(query));
      return handleResponse(res, response);
    }

    if (userName && !collectionId) {
      // Get all games via unauthed username
      query = await handleErrors(buildQueryGamesByUsername(userName));
      response = await handleErrors(retrieveAllGames(query));
    } else if (collectionId) {
      query = await handleErrors(buildQueryGamesInCollection(collectionId));
    } else if (userId) {
      query = await handleErrors(buildQueryGamesInUser(userId));
    } else {
      throw Error("No params provided!");
    }
    response = await handleErrors(retrieveAllGames(query));
  } catch (error) {
    response = createResponse("There was an error retrieving the game(s)!", error, 500);
  }
  return handleResponse(res, response);
};

async function buildQueryGamesInCollection(collection) {
  const type = "collection";
  const queryObject = await Collection.findOne({ _id: collection });
  return { queryObject, type, user: queryObject.user };
}

async function buildQueryGamesInUser(user) {
  const type = "user";
  const queryObject = await User.findOne({ userId: user });
  return { queryObject, type, user: queryObject.id };
}

async function buildQueryGamesByUsername(username) {
  const type = "userName";
  const queryObject = await User.findOne({ username });
  return { queryObject, type, user: queryObject.id };
}

async function retrieveSingleGame(filter) {
  const game = await Game.findOne(filter);
  return createResponse("Retrieved single game!", game);
}

async function retrieveAllGames({ queryObject, type, user }) {
  const { games } = queryObject;
  const gameDetails = [];
  for (const userGame of games) {
    let globalGame = await Game.findOne({ _id: userGame._id });
    gameDetails.push(createDetailedGame(globalGame, userGame));
  }
  try {
    const { username } = await User.findOne({ _id: user });
    return createResponse(`Retrieved all games from ${type}!`, {
      username,
      games: uniqBy(gameDetails, "id")
    });
  } catch (error) {
    throw Error("User not found!", error);
  }
}

module.exports = GetGame;
