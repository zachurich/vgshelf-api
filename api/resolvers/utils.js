import User from "../models/User.js";
import { createLogger } from "../../logger/logger.js";

const logger = createLogger();

export const createResponse = (msg, data, code = 200) => {
  return {
    msg,
    data,
    code,
  };
};

export const handleResponse = (res, response, redirect = false) => {
  const { code } = response;
  if (code >= 500 && code < 600) {
    logger.error(response);
    res.status(code);
  }

  if (redirect) {
    res.redirect(redirect);
  } else {
    return res.send(response);
  }
};

export const userExists = async (userId) => {
  const existingUser = await User.findOne({ userId });
  return !!existingUser;
};

export const handleErrors = async (fn) => {
  try {
    const response = await fn;
    return response;
  } catch (e) {
    throw e;
  }
};

export const checkAuthentication = (req, res, next) => {
  if (req.get("host").includes("/api") && !req.isAuthenticated()) {
    res.status(401);
    return res.send(
      createResponse("You must be authenticated to use this API!", {}, 401)
    );
  }
  next();
};
