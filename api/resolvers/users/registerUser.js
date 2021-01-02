import { createResponse, handleResponse, userExists } from "../utils.js";

import { ROUTES } from "../../../common/routes.js";
import User from "../../models/User.js";

const Register = async (req, res, next) => {
  const { userId, userName, emailAddress } = req.body;
  let response;
  try {
    const { exists } = await userExists(userId);
    if (exists) {
      response = createResponse(`${userName} already exists!`, userName, 409);
    } else {
      const mongoUser = new User({
        userId,
        username: userName,
        emailAddress,
      });

      await mongoUser.save();

      response = createResponse(
        `Created user ${mongoUser.username}!`,
        mongoUser.username,
        200
      );
    }
  } catch (error) {
    response = createResponse(
      `There was an error checking or creating user ${userName}`,
      { ...error, userId, userName, emailAddress },
      500
    );
  }

  return handleResponse(res, response);
};

export default Register;
