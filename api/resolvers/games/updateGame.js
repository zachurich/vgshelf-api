import { createResponse, handleResponse } from "../utils.js";

import UserGame from "../../models/UserGame.js";
import _ from "lodash";
import { createUserGameResponse } from "./utils.js";

// {
// 	"gameSlug": "super-mario-brothers",
// 	"properties": {},
// }
const UpdateGame = async (req, res, next) => {
  const { gameSlug, properties = {} } = req.body;
  let response;
  try {
    const userGame = await UserGame.findOne({ slug: gameSlug });
    const response = await updateUserGame(userGame, properties);
    return response;
  } catch (error) {
    response = createResponse(
      "There was an error saving the game!",
      error.toString(),
      500
    );
  }
  return handleResponse(res, response);
};

const updateUserGame = async (userGame, properties) => {
  let response;
  if (userGame && !_.isEmpty(properties)) {
    for (const property in properties) {
      if (properties[property]) {
        userGame.properties[property] = properties[property];
      }
    }
    const data = await userGame.save();
    response = createResponse(`Updated ${userGame.title}.`, createUserGameResponse(data));
  } else {
    response = createResponse(`Could not find a game with slug ${gameSlug}.`, {}, 400);
  }
  return response;
};

export default UpdateGame;
