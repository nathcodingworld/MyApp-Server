import mongoose from "mongoose";

const Schema = mongoose.Schema;

const photoSchema = new Schema(
  {
    userid: { type: Schema.Types.ObjectId, ref: "User" },
    file: String!,
    filepath: String,
    caption: String,
    date: String!,
    like: Number!,
    comment: Number!,
    disablelike: Boolean!,
    disablecomment: Boolean!,
    comments: [
      {
        userid: { type: Schema.Types.ObjectId, ref: "User" },
        comment: String,
        date: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Photo", photoSchema);
