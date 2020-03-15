const _ = require("lodash");
const User = require("../../models/User");
const Game = require("../../models/Game");
const { handleResponse, createResponse } = require("../utils");

// {
// 	"collectionId": "",
// 	"games": [],
// 	"newName": "" (Optional)
// }

// Expects to recieve all games in collection in request
const UpdateCollection = async (req, res) => {
  const { userName, collectionSlug, newName = null, games } = req.body;
  let response = {};
  try {
    const mongoUser = await User.findOne({ username: userName });
    const updatedCollection = await updateCollection(mongoUser, collectionSlug, {
      games: createModifiedCollection(mongoUser, games),
      name: newName
    });
    response = createResponse("Collection updated!", updatedCollection);
  } catch (error) {
    response = createResponse("There was an error updating the collection!", error, 500);
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
    for (const userGameId of games) {
      const game = _.find(mongoUser.games, ["id", userGameId]);
      if (!game) {
        error = "Game not found! Won't update collection.";
        throw error;
      } else {
        modifiedCollection.push(game);
      }
    }
    return modifiedCollection;
  } catch (e) {
    throw e;
  }
};

module.exports = UpdateCollection;
