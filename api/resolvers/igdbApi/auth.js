import { createLogger } from "../../../logger/logger";
import fetch from "node-fetch";

const logger = createLogger(__filename);

const checkAccessToken = async (accessToken) => {
  try {
    const response = await fetch(process.env.IGDB_VALIDATION_URL, {
      method: "GET",
      headers: {
        Authorization: `OAuth ${accessToken}`,
      },
    });

    const data = await response.json();
    if (data.client_id) {
      return true;
    }
    return false;
  } catch (error) {
    logger.debug("Invalid token, fetch a new one.");
    return false;
  }
};

const fetchAccessToken = async () => {
  const response = await fetch(
    process.env.IGDB_AUTH_URL +
      `?client_id=${process.env.IGDB_CLIENT_ID}&client_secret=${process.env.IGDB_CLIENT_SECRET}&grant_type=client_credentials`,
    {
      method: "POST",
    }
  );
  const data = await response.json();
  return data.access_token;
};

const getAccessToken = async (req) => {
  const { igdbAuthToken } = req.app.locals;

  if (igdbAuthToken) {
    const isValid = await checkAccessToken(igdbAuthToken);
    if (isValid) {
      return igdbAuthToken;
    }
  }

  logger.debug("Fetching new IGDB API token.");
  const newToken = await fetchAccessToken();
  return newToken;
};

const middleware = async (req, res, next) => {
  const accessToken = await getAccessToken(req);
  req.app.locals.igdbAuthToken = accessToken;
  next();
};

export default {
  middleware,
  getAccessToken,
  fetchAccessToken,
  checkAccessToken,
};
