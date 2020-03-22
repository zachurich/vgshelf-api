import _ from "lodash";
import User from "../../models/User.js";
import Game from "../../models/Game.js";
import UserGame from "../../models/UserGame.js";

import { handleResponse, createResponse, handleErrors } from "../utils.js";

/**
 * @field gameId (Required)- Game Unique ID from mongo collection
 *
 * @field userId (Optional) - ID of user in mongodb to get all games from
 * @field collectionSlug (Optional) - Collection Unique ID from mongodb collection
 * @field userName (Optional) - Username for user in mongodb
 */
const GetGame = async (req, res) => {
  const { gameId, userId = null, collectionSlug = null, userName = null } = req.query;
  let response = {};
  let query;
  try {
    // Get a single game by _id
    if (gameId) {
      query = { _id: gameId };
      response = await handleErrors(retrieveSingleGame(query));
      return handleResponse(res, response);
    }

    if (userName && !collectionSlug) {
      // Get all games via unauthed username
      query = await handleErrors(buildQueryGamesByUsername(userName));
      response = await handleErrors(retrieveAllGames(query));
    } else if (userName && collectionSlug) {
      query = await handleErrors(buildQueryGamesInCollection(userName, collectionSlug));
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

async function buildQueryGamesInCollection(userName, collectionSlug) {
  const type = "collection";
  const mongoUser = await User.findOne({ username: userName });
  const collection = _.find(mongoUser.collections, ["slug", collectionSlug]);
  return { queryObject: collection, type, user: mongoUser };
}

async function buildQueryGamesInUser(user) {
  const type = "user";
  const mongoUser = await User.findOne({ userId: user });
  return { queryObject: mongoUser, type, user: mongoUser };
}

async function buildQueryGamesByUsername(userName) {
  const type = "userName";
  const mongoUser = await User.findOne({ username: userName });
  return { queryObject: mongoUser, type, user: mongoUser };
}

async function retrieveSingleGame(filter) {
  const game = await Game.findOne(filter);
  return createResponse("Retrieved single game!", game);
}

async function retrieveAllGames({ queryObject, type, user }) {
  const { games } = queryObject;
  const gameDetails = [];
  try {
    for (const userGameId of games) {
      let userGame = await UserGame.findOne({ _id: userGameId });
      let globalGame = await Game.findOne({ _id: userGame.refId });
      gameDetails.push(createDetailedGame(globalGame, userGame));
    }
    return createResponse(`Retrieved all games from ${type}!`, {
      username: user.username,
      games: _.uniqBy(gameDetails, "id")
    });
  } catch (error) {
    throw Error("Could not retrieve game data!", error);
  }
}

const createDetailedGame = (globalGame, userGame) => {
  return {
    id: `${userGame._id}`,
    title: globalGame.title,
    imageUrl: globalGame.imageUrl,
    added: userGame.added,
    properties: userGame.properties
  };
};

export default GetGame;
