import { createResponse, handleResponse, userExists } from "../utils";

const CheckUser = async (req, res, next) => {
  const { userId } = req.query;
  let response;
  try {
    const { exists, userName } = await userExists(userId);
    if (exists) {
      response = createResponse(`User exists!`, { userName }, 200);
    } else {
      response = createResponse(`User doesn't exist!`, {}, 404);
    }
  } catch (error) {
    response = createResponse(
      `There was an error checking for the user`,
      { ...error },
      500
    );
  }

  return handleResponse(res, response);
};

export default CheckUser;
