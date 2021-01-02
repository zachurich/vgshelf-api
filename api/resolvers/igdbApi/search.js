import { createResponse, handleResponse } from "../utils.js";

import { IGDB_ENDPOINTS } from "./constants.js";
import fetch from "node-fetch";

const Search = async (req, res, next) => {
  const { igdbAuthToken } = req.app.locals;
  const { title, limit = 5 } = req.body;
  let response;
  const body = createSearchQuery(title, limit);
  try {
    const data = await fetchGames(body, igdbAuthToken);
    response = createResponse("Results found!", data);
  } catch (error) {
    response = createResponse(
      "Failed to fetch results from IGDB!",
      error.toString(),
      500
    );
  }
  return handleResponse(res, response);
};

export const fetchGames = async (body, accessToken) => {
  let results = await fetch(IGDB_ENDPOINTS.GAMES, {
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

export const createSearchQuery = (title, limit = 5) => `
fields id, slug, name, platforms.name, summary, cover, artworks;
search "${title}"; 
limit ${limit};
`;

export default Search;
