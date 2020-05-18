import _ from "lodash";
import User from "../../models/User.js";
import Game from "../../models/Game.js";
import UserGame from "../../models/UserGame.js";

import {
  handleResponse,
  createResponse,
  handleErrors
} from "../utils.js";
import {
  ERRORS
} from "../../../common/constants.js";

/**
 * @field gameId (Required)- Game Unique ID from mongo collection
 *
 * @field userId (Optional) - ID of user in mongodb to get all games from
 * @field collectionSlug (Optional) - Collection Unique ID from mongodb collection
 * @field userName (Optional) - Username for user in mongodb
 */
const GetGame = async (req, res) => {
  const {
    gameId,
    userName,
    userId = null,
    collectionSlug = null
  } = req.query;
  let response = {};
  let query;

  try {
    const mongoUser = await User.findOne(userName ? {
      username: userName
    } : {
      userId
    });
    if (!mongoUser) {
      throw Error(ERRORS.NO_USER);
    }
    // Get a single game by _id
    if (gameId) {
      query = {
        _id: gameId
      };
      response = await handleErrors(retrieveSingleGame(query));
      return handleResponse(res, response);
    }

    if (!collectionSlug) {
      // Get all games via unauthed username
      query = await handleErrors(buildQueryGamesByUsername(mongoUser));
      response = await handleErrors(retrieveAllGames(query));
    } else if (collectionSlug) {
      query = await handleErrors(buildQueryGamesInCollection(mongoUser, collectionSlug));
    } else {
      throw Error("No params provided!");
    }
    response = await handleErrors(retrieveAllGames(query));
  } catch (error) {
    response = createResponse(
      "There was an error retrieving the game(s)!",
      error.toString(),
      500
    );
  }
  return handleResponse(res, response);
};

async function buildQueryGamesInCollection(mongoUser, collectionSlug) {
  const type = "collection";
  const collection = _.find(mongoUser.collections, ["slug", collectionSlug]);
  return {
    queryObject: collection,
    type,
    user: mongoUser
  };
}

async function buildQueryGamesByUsername(mongoUser) {
  const type = "userName";
  return {
    queryObject: mongoUser,
    type,
    user: mongoUser
  };
}

async function retrieveSingleGame(filter) {
  const game = await Game.findOne(filter);
  return createResponse("Retrieved single game!", game);
}

async function retrieveAllGames({
  queryObject,
  type,
  user
}) {
  const {
    games
  } = queryObject;
  let gameDetails = [];
  try {
    gameDetails = await composeGameDetails(games);
    return createResponse(`Retrieved all games from ${type}!`, {
      username: user.username,
      games: _.uniqBy(gameDetails, "id")
    });
  } catch (error) {
    throw Error("Could not retrieve game data!", error);
  }
}

export const composeGameDetails = async games => {
  let gameDetails = [];
  for (const userGameId of games) {
    let userGame = await UserGame.findOne({
      _id: userGameId
    });
    let globalGame = await Game.findOne({
      _id: userGame.refId
    });
    gameDetails.push(createDetailedGame(globalGame, userGame));
  }
  return gameDetails;
};

export const createDetailedGame = (globalGame, userGame) => {
  return {
    id: `${userGame._id}`,
    title: globalGame.title,
    imageUrl: globalGame.imageUrl,
    added: userGame.added,
    properties: userGame.properties
  };
};

export default GetGame;