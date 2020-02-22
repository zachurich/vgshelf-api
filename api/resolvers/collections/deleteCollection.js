const _ = require("lodash");
const Collection = require("../../models/Collection");
const User = require("../../models/User");
const { handleResponse, createResponse } = require("../utils");

// {
// 	"collectionId": "",
// 	"userId": ""
// }
const DeleteCollection = async (req, res) => {
  const { collectionId, userId } = req.body;
  let response = {};
  try {
    const deletedCount = await deleteCollection(collectionId, userId);
    if (deletedCount === 0) {
      error = "Collection doesn't exist!";
      throw error;
    }
    response = createResponse("Collection deleted!", {});
  } catch (error) {
    response = createResponse("There was an error deleting the collection!", error, 500);
  }
  return handleResponse(res, response);
};

async function deleteCollection(collectionId, userId) {
  try {
    const user = await User.findOne({ userId });
    user.collections = user.collections.filter(
      userCollectionId => userCollectionId !== collectionId
    );
    await user.save();
    const { deletedCount } = await Collection.deleteOne({ _id: collectionId });
    return deletedCount;
  } catch (error) {
    throw error;
  }
}

module.exports = DeleteCollection;
