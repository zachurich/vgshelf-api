const express = require("express");
const { InitUser, UserResponseHandler } = require("../resolvers/users/registerUser");

const api = express.Router();

api.get("/callback", InitUser, UserResponseHandler);

module.exports = api;
