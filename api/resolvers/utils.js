import User from "../models/User.js";

export const createResponse = (msg, data, code = 200) => {
  return {
    msg,
    data,
    code
  };
};

export const handleResponse = (res, response, redirect = false) => {
  const { code } = response;
  if (code >= 500 && code < 600) {
    console.log(response);
    res.status(code);
  }

  if (redirect) {
    res.redirect(redirect);
  } else {
    return res.send(response);
  }
};

export const userExists = (userId, req, res, next) => {
  User.findOne({ userId }, (err, obj) => {
    req.userId = userId;
    if (err) {
      req.userExists = false;
      next();
    }
    if (obj) {
      req.userExists = true;
    } else {
      req.userExists = false;
    }
    next();
  });
};

export const handleErrors = async fn => {
  try {
    const response = await fn;
    return response;
  } catch (e) {
    throw e;
  }
};

export const checkAuthentication = (req, res, next) => {
  console.log(req.get("host"));
  if (req.get("host").includes("/api") && !req.isAuthenticated()) {
    res.status(401);
    return res.send(
      createResponse("You must be authenticated to use this API!", {}, 401)
    );
  }
  next();
};
