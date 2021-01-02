import mongoose from "mongoose";
import slugify from "slugify";
const uniqueRequired = {
  unique: true,
  required: true,
};

const ShelfSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  games: [
    {
      type: mongoose.Types.ObjectId,
      ref: "UserGame",
    },
  ],
});

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    ...uniqueRequired,
  },
  username: {
    type: String,
    ...uniqueRequired,
  },
  emailAddress: {
    type: String,
    ...uniqueRequired,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  collections: [ShelfSchema],
  games: [
    {
      type: mongoose.Types.ObjectId,
      ref: "UserGame",
    },
  ],
});

UserSchema.pre("save", async function (next) {
  for (const shelf of this.collections) {
    if (shelf.isNew) {
      const existingShelvesSameName = this.collections.filter(
        (existing) =>
          !existing.isNew && existing.name.toLowerCase() === shelf.name.toLowerCase()
      );
      shelf.slug = slugify(shelf.name.toLowerCase());
      if (existingShelvesSameName.length > 0) {
        shelf.slug += `-${existingShelvesSameName.length + 1}`;
      }
    }
  }
  next();
});

const User = mongoose.model("User", UserSchema);

export default User;
