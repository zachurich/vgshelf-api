const slugify = require("slugify");
const User = require("../../models/User");
const { handleResponse, createResponse } = require("../utils");

const CreateCollection = async (req, res) => {
  const { userId, collectionName, games = [] } = req.body;
  const user = await User.findOne({ userId });
  let response;
  try {
    user.collections.push({
      name: collectionName,
      slug: slugify(collectionName.toLowerCase()),
      games
    });
    const data = await user.save();
    response = createResponse("Collection created!", data);
  } catch (e) {
    response = createResponse("There was an error creating the collection!", e, 500);
  }
  return handleResponse(res, response);
};

module.exports = CreateCollection;
