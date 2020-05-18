import { createResponse, handleResponse } from "../utils.js";

import User from "../../models/User.js";

const CreateCollection = async (req, res) => {
  const { userId, collectionName, games = [] } = req.body;
  const user = await User.findOne({ userId });
  let response;
  try {
    user.collections.push({
      name: collectionName,
      games,
    });
    const data = await user.save();
    response = createResponse("Collection created!", data);
  } catch (error) {
    response = createResponse(
      "There was an error creating the collection!",
      error.toString(),
      500
    );
  }
  return handleResponse(res, response);
};

export default CreateCollection;
