import express from "express";

import SaveGame from "../resolvers/games/saveGame.js";
import GetGame from "../resolvers/games/getGame.js";
import RemoveGame from "../resolvers/games/removeGame.js";
import GetCollection from "../resolvers/collections/getCollection.js";
import CreateCollection from "../resolvers/collections/createCollection.js";
import UpdateCollection from "../resolvers/collections/updateCollection.js";
import DeleteCollection from "../resolvers/collections/deleteCollection.js";
import Health from "../resolvers/health.js";
import Search from "../resolvers/igdbApi/search.js";
import Cover from "../resolvers/igdbApi/cover.js";
import { apiBase } from "./constants.js";
import { jwtCheck } from "../../common/globalUtils.js";

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

export default api;
