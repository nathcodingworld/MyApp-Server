import User from "../User";
import { HashPassword } from "../../Auth/UserPassword";
import { ApolloError } from "apollo-server-express";
import mongoose from "mongoose";

export async function AddUser(args: any) {
  const user = await User.findOne({ email: args.email });
  if (user) throw new ApolloError("User with email already exists", "Error Code (400)", { type: "Auth", info: "change your email address, or log in with the current email" });
  const hashedPW = await HashPassword(args.password);

  const newuser = await new User({
    userName: args.userName,
    email: args.email,
    password: hashedPW,
    heart: 0,
    avatar: args.avatar,
    filepath: args.filepath,
    description: args.bio,
    heartedUser: [],
    likedVideos: [],
    dislikedVideos: [],
    likedPhotos: [],
    likedPost: [],
    allphotopath: [args.filepath],
    allvideopath: [],
    allaudiopath: [],
    friends: [],
    friendRequest: [],
    sentRequest: [],
    messageChatRoom: [],
  });
  const data = await newuser.save();
  return data;
}

export async function GetUser(email: string) {
  return await User.findOne({ email: email });
}

export async function GetAllFiles(args: { id: string }) {
  return await User.findById(args.id, { allphotopath: 1, allvideopath: 1, allaudiopath: 1, heart: 1, _id: 0 });
}

export async function UpdateUser(args: { userid: string; userName: string; password: string; avatar: string; bio: string; filepath: string }) {
  const hashedPW = await HashPassword(args.password);
  const user = await User.findByIdAndUpdate(args.userid, {
    $set: { userName: args.userName, password: hashedPW, avatar: args.avatar, description: args.bio, filepath: args.filepath },
    $push: { allphotopath: args.filepath },
  });
  const data = await User.findByIdAndUpdate(args.userid, { $pull: { allphotopath: user.filepath } });
  return data;
}

export async function DeleteUser(args: { userid: string }) {
  await User.findByIdAndDelete(args.userid);
}

export async function updateHeart(args: { id: string; userid: string }) {
  const user = await User.findById(args.userid, { heartedUser: 1, _id: 0 });
  const userhearted = user.heartedUser;
  if (userhearted.includes(args.id)) {
    await User.findByIdAndUpdate(args.userid, { $pull: { heartedUser: args.id } });
    const data = await User.findByIdAndUpdate(args.id, { $inc: { heart: -1 } });
    return { heart: data.heart - 1 };
  } else {
    await User.findByIdAndUpdate(args.userid, { $push: { heartedUser: args.id } });
    const data = await User.findByIdAndUpdate(args.id, { $inc: { heart: 1 } });
    return { heart: data.heart + 1 };
  }
}

export async function findAllProfile() {
  return await User.find({}).populate({ path: "messageChatRoom.userid", select: "id" });
}

export async function requestFriend(args: { authorid: string; userid: string }) {
  const userid = new mongoose.Types.ObjectId(args.userid);
  const author = await User.findById(args.authorid, { sentRequest: 1, _id: 0 });
  if (author.sentRequest.includes(args.userid)) return;
  await User.findByIdAndUpdate(args.authorid, { $push: { friendRequest: userid } });
  await User.findByIdAndUpdate(args.userid, { $push: { sentRequest: args.authorid } });
}

export async function cancelFriend(args: { authorid: string; userid: string }) {
  const userid = new mongoose.Types.ObjectId(args.userid);
  await User.findByIdAndUpdate(args.authorid, { $pull: { friendRequest: userid } });
  await User.findByIdAndUpdate(args.userid, { $pull: { sentRequest: args.authorid } });
}

export async function refuseFriend(args: { authorid: string; userid: string }) {
  const authorid = new mongoose.Types.ObjectId(args.authorid);
  await User.findByIdAndUpdate(args.userid, { $pull: { friendRequest: authorid } });
  await User.findByIdAndUpdate(args.authorid, { $pull: { sentRequest: args.userid } });
}

export async function addFriend(args: { authorid: string; userid: string }) {
  const authorid = new mongoose.Types.ObjectId(args.authorid);
  const userid = new mongoose.Types.ObjectId(args.userid);
  const user = await User.findById(args.userid, { friends: 1, _id: 0 });
  if (user.friends.includes(authorid)) return;
  await User.findByIdAndUpdate(args.authorid, { $push: { friends: userid }, $pull: { sentRequest: args.userid } });
  await User.findByIdAndUpdate(args.userid, { $push: { friends: authorid }, $pull: { friendRequest: authorid } });
}

export async function removeFriend(args: { authorid: string; userid: string }) {
  const authorid = new mongoose.Types.ObjectId(args.authorid);
  const userid = new mongoose.Types.ObjectId(args.userid);
  await User.findByIdAndUpdate(args.authorid, { $pull: { friends: userid } });
  await User.findByIdAndUpdate(args.userid, { $pull: { friends: authorid } });
}

export async function getFriend(args: { userid: string }) {
  if (args.userid === "") return { friends: [], friendRequest: [], sentRequest: [] };
  return await User.findById(args.userid, { friends: 1, friendRequest: 1, sentRequest: 1, _id: 0 })
    .populate({ path: "friends", select: "userName avatar id heart" })
    .populate({ path: "friendRequest", select: "userName avatar id heart" });
}

export async function getRooms(args: { userid: string }) {
  if (args.userid === "") return { messageChatRoom: [] };
  return await User.findById(args.userid, { messageChatRoom: 1, _id: 0 }).populate({ path: "messageChatRoom.userid", select: "id avatar userName" });
}
