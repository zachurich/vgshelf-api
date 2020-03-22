import mongoose from "mongoose";

const uniqueRequired = { unique: true, required: true };

const Collection = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  name: { type: String },
  created: { type: Date, default: Date.now },
  games: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Collection"
    }
  ]
});

export default mongoose.model("Collection", Collection);
