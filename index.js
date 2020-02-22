require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");

const { NODE_ENV, AUTH0_DOMAIN, AUTH0_AUDIENCE, MONGODB_CONNECTION } = process.env;

const mongoose = require("mongoose");

const api = require("./api/endpoints/routes");

mongoose.connect(MONGODB_CONNECTION, { useNewUrlParser: true });
mongoose.connection.on("error", err => {
  console.log(`Error connecting to db: ${err}`);
});

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${AUTH0_DOMAIN}.well-known/jwks.json`
  }),
  audience: AUTH0_AUDIENCE,
  issuer: AUTH0_DOMAIN,
  algorithms: ["RS256"]
});

const init = () => {
  try {
    const server = express();

    server.use(bodyParser.json());

    server.use(jwtCheck);

    server.use(api);

    const port = parseInt(process.env.PORT) || 8000;
    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

init();
