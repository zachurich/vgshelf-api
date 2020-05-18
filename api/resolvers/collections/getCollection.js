import _ from "lodash";
import Game from "../../models/Game.js";
import UserGame from "../../models/UserGame.js";
import User from "../../models/User.js";
import { handleResponse, createResponse, handleErrors } from "../utils.js";
import { composeGameDetails } from "../games/getGame.js";
import { ERRORS } from "../../../common/constants.js";

// collectionId: (Optional - Returns single collection)
// userId: (Optional - Returns all collections for user)
const GetCollection = async (req, res) => {
  const { collectionSlug, userName } = req.query;
  let response = {};
  try {
    const mongoUser = await User.findOne({ username: userName });
    if (!mongoUser) {
      throw Error(ERRORS.NO_USER);
    }
    if (!collectionSlug) {
      // Get all collections via unauthed username
      response = await handleErrors(retrieveAllDetailedCollections(mongoUser));
    } else if (collectionSlug) {
      const mongoUser = await User.findOne({ username: userName });
      response = await handleErrors(
        retrieveSingleDetailedCollection(mongoUser, collectionSlug)
      );
    }
  } catch (error) {
    response = createResponse(
      "There was an error retrieving the collection!",
      error.toString(),
      500
    );
  }
  return handleResponse(res, response);
};

const retrieveSingleDetailedCollection = async (mongoUser, collectionSlug) => {
  try {
    const currentCollection = await retrieveCollection(mongoUser, collectionSlug);
    const gameDetails = await retrieveGamesInCollection(currentCollection);
    const detailedCollection = createDetailedCollection(currentCollection, gameDetails);
    const response = createResponse(`Retrieved single Collection!`, detailedCollection);
    return response;
  } catch (e) {
    let error = { msg: "Error retrieving single collection!", data: e };
    throw error;
  }
};

const retrieveAllDetailedCollections = async mongoUser => {
  try {
    const allCollections = await retrieveAllCollections(mongoUser);
    const allDetailedCollections = await composeDetailedCollections(allCollections);
    const response = createResponse(
      `Retrieved all Collections for user!`,
      allDetailedCollections
    );

    return response;
  } catch (e) {
    const error = { msg: "Error retrieving multiple collections!", data: e };
    throw error;
  }
};

const retrieveGamesInCollection = async currentCollection => {
  const { games } = currentCollection;
  let gameDetails = [];
  try {
    gameDetails = await composeGameDetails(games);
    return gameDetails;
  } catch (e) {
    throw e;
  }
};

const composeDetailedCollections = async allCollections => {
  const allDetailedCollections = [];
  try {
    for (const i in allCollections) {
      const currentCollection = allCollections[i];
      const gameDetails = await retrieveGamesInCollection(currentCollection);
      const detailedCollection = createDetailedCollection(currentCollection, gameDetails);
      allDetailedCollections.push(detailedCollection);
    }
    return allDetailedCollections;
  } catch (error) {
    throw "Failed to compose collection data!";
  }
};

const retrieveCollection = async (mongoUser, collectionSlug) => {
  try {
    const currentCollection = _.find(mongoUser.collections, ["slug", collectionSlug]);
    if (!currentCollection) {
      error = "Collection not found!";
      throw error;
    }
    return currentCollection;
  } catch (error) {
    throw error;
  }
};

const retrieveAllCollections = async mongoUser => {
  try {
    const allCollections = mongoUser.collections;
    if (!allCollections) {
      error = "Collections not found!";
      throw error;
    }
    return allCollections;
  } catch (error) {
    throw error;
  }
};

const createDetailedCollection = (collection, gameDetails) => {
  return {
    id: collection["_id"],
    title: collection.name,
    slug: collection.slug,
    created: collection.created,
    games: gameDetails
  };
};

export default GetCollection;
