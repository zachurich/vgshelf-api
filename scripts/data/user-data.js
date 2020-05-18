import { idGen } from "../utils";

const generateUserData = (userGamesData) => ({
  model: "User",
  documents: [
    {
      _id: idGen(),
      collections: [],
      userId: process.env.AUTH0_TEST_USER,
      username: process.env.AUTH0_TEST_USER_EMAIL.split("@")[0],
      emailAddress: process.env.AUTH0_TEST_USER_EMAIL,
      games: userGamesData.documents.map((game) => game._id),
    },
  ],
});

export default generateUserData;
