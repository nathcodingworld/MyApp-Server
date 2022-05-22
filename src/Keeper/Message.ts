import mongoose from "mongoose";

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    groupchat: Boolean,
    userid: { type: Schema.Types.ObjectId, ref: "User" },
    authorid: { type: Schema.Types.ObjectId, ref: "User" },
    groupids: [{ type: Schema.Types.ObjectId, ref: "User" }],
    messages: [
      {
        userid: { type: Schema.Types.ObjectId, ref: "User", required: true },
        message: String!,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
