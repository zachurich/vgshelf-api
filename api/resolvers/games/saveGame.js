import { addGameToObj, createGameObj, objectHasGame } from "./utils.js";
import { createResponse, handleErrors, handleResponse } from "../utils.js";

import Collection from "../../models/Collection.js";
import Game from "../../models/Game.js";
import User from "../../models/User.js";
import UserGame from "../../models/UserGame.js";

// {
// 	"userId": "auth0|5d50aaee46c9270eb3b3441d",
// 	"title": "Mario & Luigi: Dream Team",
// 	"igdbId": "3365",
// 	"slug": "mario-luigi-dream-team",
// 	"imageUrl": "//images.igdb.com/igdb/image/upload/t_thumb/n3ixw6sevozbp5fs3ms9.jpg",
// 	"collectionId": null,
//  "properties": {}
// }
const SaveGame = async (req, res, next) => {
  const {
    title,
    igdbId,
    slug,
    imageUrl,
    userId,
    collectionId = null,
    properties = {},
  } = req.body;
  let response;
  try {
    const gameObj = createGameObj({ title, igdbId, slug, imageUrl });
    const gameToAdd = await handleErrors(optionallyAddGameToDb(gameObj));
    if (collectionId) {
      response = await handleErrors(addGameToCollection(collectionId, gameToAdd));
    }
    response = await handleErrors(addGameToUser(userId, gameToAdd, properties));
  } catch (error) {
    response = createResponse(
      "There was an error saving the game!",
      error.toString(),
      500
    );
  }
  return handleResponse(res, response);
};

const optionallyAddGameToDb = async ({ title, igdbId, slug, imageUrl }) => {
  const existingGameInDB = await Game.findOne({ title });
  if (existingGameInDB === null) {
    const game = new Game({ title, igdbId, slug, imageUrl });
    await game.save();
    return game;
  } else {
    return existingGameInDB;
  }
};

const addGameToCollection = async (collection, game) => {
  const collectionObj = await Collection.findOne({ _id: collection });
  if (objectHasGame(collectionObj, game)) {
    return createResponse("Collection already has game!", {}, 400);
  } else {
    collectionObj.games = addGameToObj(collectionObj, game);
    const data = await collectionObj.save();
    return createResponse("Game assigned to collection!", data);
  }
};

const addGameToUser = async (userId, game, properties) => {
  const user = await User.findOne({ userId });
  const userGame = new UserGame({
    refId: game._id,
    properties,
    user: user._id,
  });
  await userGame.save();
  user.games.push(userGame._id);
  const data = await user.save();
  return createResponse("Game assigned to user!", data);
  // }
};

export default SaveGame;
