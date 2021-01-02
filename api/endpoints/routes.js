import CheckUser from "../resolvers/users/checkUser.js";
import Cover from "../resolvers/igdbApi/cover.js";
import CreateCollection from "../resolvers/collections/createCollection.js";
import DeleteCollection from "../resolvers/collections/deleteCollection.js";
import GetCollection from "../resolvers/collections/getCollection.js";
import GetGame from "../resolvers/games/getGame.js";
import Health from "../resolvers/health.js";
import Register from "../resolvers/users/registerUser.js";
import RemoveGame from "../resolvers/games/removeGame.js";
import SaveGame from "../resolvers/games/saveGame.js";
import Search from "../resolvers/igdbApi/search.js";
import UpdateCollection from "../resolvers/collections/updateCollection.js";
import UpdateGame from "../resolvers/games/updateGame.js";
import { apiBase } from "./constants.js";
import express from "express";
import igdbAuth from "../resolvers/igdbApi/auth.js";
import { jwtCheck } from "../../common/globalUtils.js";

const api = express.Router();

/** Utils */
api.get(`${apiBase}/health`, Health);

/** Games */
api.get(`${apiBase}/game`, GetGame);
api.post(`${apiBase}/game`, jwtCheck, SaveGame);
api.delete(`${apiBase}/game`, jwtCheck, RemoveGame);
api.put(`${apiBase}/game`, UpdateGame);

/** Collections */
api.get(`${apiBase}/collection`, GetCollection);
api.post(`${apiBase}/collection`, jwtCheck, CreateCollection);
api.put(`${apiBase}/collection`, jwtCheck, UpdateCollection);
api.delete(`${apiBase}/collection`, jwtCheck, DeleteCollection);

/** igdb stuff */
api.post(`${apiBase}/external/search/`, igdbAuth.middleware, Search);
api.post(`${apiBase}/external/cover/`, igdbAuth.middleware, Cover);

/** users */
api.get(`${apiBase}/user/check`, CheckUser);
api.post(`${apiBase}/user/register`, Register);

export default api;
