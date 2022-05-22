import mongoose from "mongoose";

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    userid: { type: Schema.Types.ObjectId, ref: "User" },
    content: String,
    file: String,
    filepath: String,
    date: String,
    like: Number!,
    comment: Number!,
    disablelike: Boolean!,
    disablecomment: Boolean!,
    comments: [
      {
        userid: { type: Schema.Types.ObjectId, ref: "User" },
        date: String,
        comment: String,
      },
    ],
  },
  { timestamps: true, strict: false }
);

export default mongoose.model("Post", postSchema);
