import express from "express";
import { InitUser, UserResponseHandler } from "../resolvers/users/registerUser";

const api = express.Router();

api.get("/callback", InitUser, UserResponseHandler);

export default api;
