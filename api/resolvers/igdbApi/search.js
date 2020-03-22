import fetch from "node-fetch";
import { createResponse, handleResponse } from "../utils.js";
import { IGDB_ENDPOINTS } from "./constants.js";

const Search = async (req, res, next) => {
  const { title } = req.body;
  let response;
  const query = searchTitleQuery(title);
  try {
    let results = await fetch(IGDB_ENDPOINTS.GAMES, {
      method: "POST",
      headers: {
        "user-key": process.env.IGDB_KEY
      },
      body: query
    });
    const data = await results.json();
    response = createResponse("Results found!", data);
  } catch (e) {
    response = createResponse("Failed to fetch results from IGDB!", e, 500);
  }
  return handleResponse(res, response);
};

const searchTitleQuery = title => `
fields id, slug, name, platforms.name, summary, cover, artworks;
search "${title}"; 
limit 5;
`;

export default Search;
