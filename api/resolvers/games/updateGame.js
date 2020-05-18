import { addGameToObj, createGameObj, objectHasGame } from "./utils.js";
import { createResponse, handleErrors, handleResponse } from "../utils.js";

import Collection from "../../models/Collection.js";
import Game from "../../models/Game.js";
import User from "../../models/User.js";
import UserGame from "../../models/UserGame.js";

// {
// 	"userId": "auth0|5d50aaee46c9270eb3b3441d",
// 	"title": "Mario & Luigi: Dream Team",
// 	"slug": "mario-luigi-dream-team",
//  "properties": {}
// }
const UpdateGame = async (req, res, next) => {
  const { gameId, title, userId, properties = {} } = req.body;
  let response;
  try {
    const gameObj = createGameObj({ title, igdbId, slug, imageUrl });
    const gameToAdd = await handleErrors(optionallyAddGameToDb(gameObj));
    if (collectionId) {
      response = await handleErrors(addGameToCollection(collectionId, gameToAdd));
    }
    response = await handleErrors(addGameToUser(userId, gameToAdd, properties));
  } catch (e) {
    response = createResponse(
      "There was an error saving the game!",
      error.toString(),
      500
    );
  }
  return handleResponse(res, response);
};

export default UpdateGame;
