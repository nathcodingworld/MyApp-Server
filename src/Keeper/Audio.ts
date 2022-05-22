import mongoose from "mongoose";

const Schema = mongoose.Schema;

const audioSchema = new Schema(
  {
    userid: { type: Schema.Types.ObjectId, ref: "User" },
    file: String!,
    filepath: String,
    cover: String,
    coverpath: String,
    date: String!,
    title: String!,
    owner: String!,
    coverby: String,
  },
  { timestamps: true }
);

export default mongoose.model("Audio", audioSchema);
