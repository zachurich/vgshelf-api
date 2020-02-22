const _ = require("lodash");
const Collection = require("../../models/Collection");
const Game = require("../../models/Game");
const { retrieveCollection } = require("./utils");
const { handleResponse, createResponse } = require("../utils");

// {
// 	"collectionId": "",
// 	"games": [],
// 	"newName": "" (Optional)
// }

// Expects to recieve all games in collection in request
const UpdateCollection = async (req, res) => {
  const { collectionId, newName = null, games } = req.body;
  const collectionFilter = { _id: collectionId };
  let response = {};
  try {
    await validateGames(games);
    const modifiedCollection = createModifiedCollection(games, newName);
    const updatedCollection = await updateCollection(
      collectionFilter,
      modifiedCollection
    );
    response = createResponse("Collection updated!", updatedCollection);
  } catch (error) {
    response = createResponse("There was an error updating the collection!", error, 500);
  }
  return handleResponse(res, response);
};

const updateCollection = async (collectionFilter, modifiedCollection) => {
  try {
    await Collection.findOneAndUpdate(collectionFilter, modifiedCollection);
    const updatedCollection = await Collection.findOne(collectionFilter);
    if (!updatedCollection) {
      error = "Collection not found!";
      throw error;
    }
    return updatedCollection;
  } catch (error) {
    throw error;
  }
};

const validateGames = async games => {
  try {
    if (!games.length) {
      throw "No games provided, will not update collection!";
    }

    for (i in games) {
      let game = await Game.findOne({ _id: games[i] });
      if (!game) {
        error = "Game not found! Won't update collection.";
        throw error;
      }
    }
  } catch (e) {
    throw e;
  }
};

const createModifiedCollection = (games, name) => {
  let uniqueGames = _.uniq(games);
  return name ? { name, games: uniqueGames } : { games: uniqueGames };
};

module.exports = UpdateCollection;
