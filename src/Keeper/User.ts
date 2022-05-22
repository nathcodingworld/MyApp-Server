import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const userSchema = new Schema({
  userName: String,
  description: String,
  heart: Number,
  avatar: String,
  email: String,
  password: String,
  heartedUser: [String],
  likedVideos: [String],
  dislikedVideos: [String],
  likedPhotos: [String],
  likedPost: [String],
  allphotopath: [String],
  allvideopath: [String],
  allaudiopath: [String],
  filepath: String,
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  friendRequest: [{ type: Schema.Types.ObjectId, ref: "User" }],
  sentRequest: [String],
  messageChatRoom: [{ userid: { type: Schema.Types.ObjectId, ref: "User" }, roomid: String! }],
});

export default mongoose.model("User", userSchema);
