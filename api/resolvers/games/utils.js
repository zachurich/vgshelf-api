// .id() is a subdoc method to check for
// existence of an id in a subdoc, returning the doc
export const objectHasGame = (obj, game) => {
  return !!obj.games.id(game.id);
};

export const addGameToObj = (obj, game) => {
  return obj.games.push(game);
};

export const createGameObj = ({ title, igdbId, slug, imageUrl }) => {
  return {
    title,
    igdbId,
    slug,
    imageUrl,
  };
};
