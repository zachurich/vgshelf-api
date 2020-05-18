import { idGen } from "../utils";

import { fetchGames, createSearchQuery } from "../../api/resolvers/igdbApi/search";
import { fetchCover, createCoverQuery } from "../../api/resolvers/igdbApi/cover";
import { createGameObj } from "../../api/resolvers/games/utils";

const getGameData = async (title, limit) => {
  const query = createSearchQuery(title, limit);
  const data = await fetchGames(query);
  return data;
};

const getCoverData = async (gameId) => {
  const query = createCoverQuery(gameId);
  const data = await fetchCover(query);
  return data;
};

const getGameSeedData = async () => {
  const games = await getGameData("Mario", 50);
  let composedGames = [];
  for (const game of games) {
    const [cover] = await getCoverData(game.id);
    composedGames.push({
      _id: idGen(),
      ...createGameObj({
        title: game.name,
        igdbId: game.id,
        slug: game.slug,
        imageUrl: cover ? cover.url : "",
      }),
    });
  }
  return composedGames;
};

export const generateGamesData = async () => {
  const games = await getGameSeedData();
  return {
    model: "Game",
    documents: games,
  };
};

export const generateUserGamesData = (gamesData) => {
  return {
    model: "UserGame",
    documents: gamesData.documents.map((game) => ({
      _id: idGen(),
      refId: game._id,
      properties: [],
      user: "5de9c19aff599c0d0ca583f8",
    })),
  };
};
