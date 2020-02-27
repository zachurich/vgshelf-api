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
const { jwtCheck } = require("../../common/globalUtils");

const api = express.Router();

/** Utils */
api.get(`${apiBase}/health`, Health);

/** Games */
api.get(`${apiBase}/game`, GetGame);
api.post(`${apiBase}/game`, jwtCheck, SaveGame);
api.delete(`${apiBase}/game`, jwtCheck, RemoveGame);

/** Collections */
api.get(`${apiBase}/collection`, GetCollection);
api.post(`${apiBase}/collection`, jwtCheck, CreateCollection);
api.put(`${apiBase}/collection`, jwtCheck, UpdateCollection);
api.delete(`${apiBase}/collection`, jwtCheck, DeleteCollection);

/** igdb stuff */
api.post(`${apiBase}/external/search/`, Search);
api.post(`${apiBase}/external/cover/`, Cover);

module.exports = api;
