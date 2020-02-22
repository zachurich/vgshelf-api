const User = require("../../models/User");
const { handleResponse, createResponse, userExists } = require("../utils");
const { ROUTES } = require("../../../common/routes");

const InitUser = (req, res, next) => {
  const { id, displayName, nickname } = user;
  const mongoUser = new User({
    userId: id,
    username: nickname,
    emailAddress: displayName
  });
  if (err) return next(err);
  if (!user) return res.redirect(ROUTES.LOGIN);
  req.logIn(user, err => {
    if (err) return next(err);
    req.mongoUser = mongoUser;
    userExists(id, req, res, next);
  });
};

const UserResponseHandler = async (req, res, next) => {
  const { mongoUser, userExists } = req;
  if (!userExists) {
    try {
      await mongoUser.save();
      response = createResponse(
        `Created user ${mongoUser.username}!`,
        mongoUser.username,
        200
      );
    } catch (e) {
      response = createResponse(
        `There was an error registering user ${mongoUser.username}`,
        e,
        500
      );
    }
  } else {
    response = createResponse(
      `Logging in ${mongoUser.username}!`,
      mongoUser.username,
      200
    );
  }
  return handleResponse(res, response, `${ROUTES.APP}/${mongoUser.username}`);
};

module.exports = { InitUser, UserResponseHandler };
