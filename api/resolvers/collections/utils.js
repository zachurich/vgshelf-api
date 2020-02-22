const Collection = require("../../models/Collection");

exports.retrieveCollection = async collectionFilter => {
  try {
    const currentCollection = await Collection.findOne(collectionFilter);
    if (!currentCollection) {
      error = "Collection not found!";
      throw error;
    }
    return currentCollection;
  } catch (error) {
    throw error;
  }
};

exports.retrieveAllCollections = async collectionFilter => {
  try {
    const allCollections = await Collection.find(collectionFilter);
    if (!allCollections) {
      error = "Collections not found!";
      throw error;
    }
    return allCollections;
  } catch (error) {
    throw error;
  }
};

exports.createDetailedCollection = (collection, gameDetails) => {
  return {
    id: collection["_id"],
    user: collection.user,
    title: collection.name,
    created: collection.created,
    games: gameDetails
  };
};
