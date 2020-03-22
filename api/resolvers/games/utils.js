const { createResponse } = require("../utils");

// .id() is a subdoc method to check for
// existence of an id in a subdoc, returning the doc
exports.objectHasGame = (obj, game) => {
  return !!obj.games.id(game.id);
};

exports.addGameToObj = (obj, game) => {
  return obj.games.push(game);
};
