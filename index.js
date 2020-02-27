require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const mongoose = require("mongoose");

const api = require("./api/endpoints/routes");

mongoose.connect(process.env.MONGODB_CONNECTION, { useNewUrlParser: true });
mongoose.connection.on("error", err => {
  console.log(`Error connecting to db: ${err}`);
});

const init = () => {
  try {
    const server = express();

    server.use(
      cors({
        origin: process.env.APP_URL,
        optionsSuccessStatus: 200
      })
    );

    server.use(bodyParser.json());

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
