import _ from "lodash";
import User from "../../models/User.js";
import { handleResponse, createResponse } from "../utils.js";

// {
//  "userName": "",
// 	"collectionSlug": "test2",
// 	"newName": "Lol",
// 	"games": [],
// }

// Expects to recieve all games in collection in request
const UpdateCollection = async (req, res) => {
  const { userName, collectionSlug, newName = null, games = null } = req.body;
  let response = {};
  try {
    const mongoUser = await User.findOne({ username: userName });
    const updatedCollection = await updateCollection(mongoUser, collectionSlug, {
      games: games ? createModifiedCollection(mongoUser, games) : null,
      name: newName
    });
    response = createResponse("Collection updated!", updatedCollection);
  } catch (error) {
    response = createResponse(
      "There was an error updating the collection!",
      error.toString(),
      500
    );
  }
  return handleResponse(res, response);
};

const updateCollection = async (mongoUser, collectionSlug, modifications) => {
  try {
    const collection = _.find(mongoUser.collections, ["slug", collectionSlug]);
    Object.keys(modifications).forEach(key => {
      if (modifications[key]) {
        collection.set(key, modifications[key]);
      }
    });
    await mongoUser.save();
    if (!collection) {
      error = "Collection not found!";
      throw error;
    }
    return collection;
  } catch (error) {
    throw error;
  }
};

const createModifiedCollection = (mongoUser, games) => {
  const modifiedCollection = [];
  try {
    for (const game of games) {
      const foundGame = mongoUser.games.includes(game.id);
      if (!foundGame) {
        const error = "Game not found! Won't update collection.";
        throw error;
      } else {
        modifiedCollection.push(...mongoUser.games.filter(id => id == game.id));
      }
    }
    return modifiedCollection;
  } catch (e) {
    throw e;
  }
};

export default UpdateCollection;
