const fetch = require("node-fetch");
const { createResponse, handleResponse } = require("../utils");
const { IGDB_ENDPOINTS } = require("./constants");

const Cover = async (req, res, next) => {
  const { gameId } = req.body; // game id
  let response;
  const query = constructCoverQuery(gameId);
  try {
    let results = await fetch(IGDB_ENDPOINTS.COVERS, {
      method: "POST",
      headers: {
        "user-key": process.env.IGDB_KEY
      },
      body: query
    });
    const data = await results.json();
    response = createResponse("Cover found!", data);
  } catch (e) {
    response = createResponse("Failed to cover from IGDB!", e, 500);
  }
  return handleResponse(res, response);
};

const constructCoverQuery = gameId => `fields alpha_channel,animated,game,height,image_id,url,width;
  where game = ${gameId};`;

module.exports = Cover;
