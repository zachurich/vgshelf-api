import User from "../../models/User.js";
import { handleResponse, createResponse, userExists } from "../utils.js";
import { ROUTES } from "../../../common/routes.js";

const Register = async (req, res, next) => {
  const { userId, username, emailAddress } = req.body;
  let response;
  try {
    const exists = await userExists(userId);
    if (exists) {
      response = createResponse(`${username} already exists!`, username, 409);
    } else {
      const mongoUser = new User({
        userId,
        username,
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
      `There was an error checking or creating user ${username}`,
      { ...error, userId, username, emailAddress },
      500
    );
  }

  return handleResponse(res, response);
};

export default Register;
