const express = require("express");

const { SaveGame } = require("../resolvers/games/saveGame");
const GetGame = require("../resolvers/games/getGame");
const RemoveGame = require("../resolvers/games/removeGame");
const GetCollection = require("../resolvers/collections/getCollection");
const CreateCollection = require("../resolvers/collections/createCollection");
const UpdateCollection = require("../resolvers/collections/updateCollection");
const DeleteCollection = require("../resolvers/collections/deleteCollection");
const Health = require("../resolvers/health");
const Search = require("../resolvers/igdbApi/search");
const Cover = require("../resolvers/igdbApi/cover");
const { apiBase } = require("./constants");

const api = express.Router();

/** Utils */
api.get(`${apiBase}/health`, Health);

/** Games */
api.get(`${apiBase}/game`, GetGame);
api.post(`${apiBase}/game`, SaveGame);
api.delete(`${apiBase}/game`, RemoveGame);

/** Collections */
api.get(`${apiBase}/collection`, GetCollection);
api.post(`${apiBase}/collection`, CreateCollection);
api.put(`${apiBase}/collection`, UpdateCollection);
api.delete(`${apiBase}/collection`, DeleteCollection);

/** igdb stuff */
api.post(`${apiBase}/external/search/`, Search);
api.post(`${apiBase}/external/cover/`, Cover);

module.exports = api;
