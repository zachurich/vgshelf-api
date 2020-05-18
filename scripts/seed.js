import seeder from "mongoose-seed";
import generateUserData from "./data/user-data";
import { generateGamesData, generateUserGamesData } from "./data/games-data";

async function run() {
  const gamesData = await generateGamesData();
  const userGamesData = generateUserGamesData(gamesData);
  const userData = generateUserData(userGamesData);

  const models = [
    { name: "User", seed: userData },
    { name: "Game", seed: gamesData },
    { name: "UserGame", seed: userGamesData },
  ];

  // Connect to MongoDB via Mongoose
  seeder.connect(process.env.MONGODB_CONNECTION, async () => {
    // Load Mongoose models
    seeder.loadModels(models.map(({ name }) => `./api/models/${name}.js`));

    // Clear specified collections
    seeder.clearModels(
      models.map(({ name }) => name),
      () => {
        // Callback to populate DB once collections have been cleared
        seeder.populateModels(
          models.map(({ seed }) => seed),
          () => {
            seeder.disconnect();
          }
        );
      }
    );
  });
}

run();
