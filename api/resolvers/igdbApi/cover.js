import { createResponse, handleResponse } from "../utils.js";

import { IGDB_ENDPOINTS } from "./constants.js";
import fetch from "node-fetch";

const Cover = async (req, res, next) => {
  const { gameId } = req.body; // game id
  const { igdbAuthToken } = req.app.locals;

  let response;
  const query = createCoverQuery(gameId);
  try {
    const data = await fetchCover(query, igdbAuthToken);
    response = createResponse("Cover found!", data);
  } catch (error) {
    response = createResponse("Failed to cover from IGDB!", error.toString(), 500);
  }
  return handleResponse(res, response);
};

export const fetchCover = async (body, accessToken) => {
  const results = await fetch(IGDB_ENDPOINTS.COVERS, {
    method: "POST",
    headers: {
      "Client-ID": process.env.IGDB_CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
    body,
  });
  const data = await results.json();
  return data;
};

export const createCoverQuery = (
  gameId
) => `fields alpha_channel,animated,game,height,image_id,url,width;
  where game = ${gameId};`;

export default Cover;
