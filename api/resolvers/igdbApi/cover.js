import fetch from "node-fetch";
import { createResponse, handleResponse } from "../utils.js";
import { IGDB_ENDPOINTS } from "./constants.js";

const Cover = async (req, res, next) => {
  const { gameId } = req.body; // game id

  let response;
  const query = createCoverQuery(gameId);
  try {
    const data = await fetchCover(query);
    response = createResponse("Cover found!", data);
  } catch (e) {
    response = createResponse("Failed to cover from IGDB!", error.toString(), 500);
  }
  return handleResponse(res, response);
};

export const fetchCover = async (body) => {
  const results = await fetch(IGDB_ENDPOINTS.COVERS, {
    method: "POST",
    headers: {
      "user-key": process.env.IGDB_KEY,
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
