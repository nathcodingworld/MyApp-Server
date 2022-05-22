import mongoose from "mongoose";
import Audio from "../Audio";
import User from "../User";

export async function addAudio(arg: any) {
  const audio = await new Audio({
    userid: new mongoose.Types.ObjectId(arg.userid),
    file: arg.file,
    filepath: arg.filepath,
    cover: arg.cover,
    coverpath: arg.coverpath,
    date: new Date().toDateString(),
    title: arg.title,
    owner: arg.owner,
    coverby: arg.coverby,
  });
  await User.findByIdAndUpdate(arg.userid, { $push: { allphotopath: arg.coverpath, allaudiopath: arg.filepath } });
  await audio.save();
}

export async function findAllAudio(args: { authorid: string }) {
  if (args.authorid === "default") return await Audio.find({}).sort({ createdAt: "desc" }).populate({ path: "userid", select: "userName avatar id" });
  else return await Audio.find({ userid: args.authorid }).sort({ createdAt: "desc" }).populate({ path: "userid", select: "userName avatar id" });
}

export async function findOneAudio(args: { id: string }) {
  return await Audio.findById(args.id);
}

export async function updateOneAudio(args: { userid: string; audioid: string; cover: string; coverpath: string; title: string; owner: string; coverby: string }) {
  const audio = await Audio.findByIdAndUpdate(args.audioid, { title: args.title, cover: args.cover, coverpath: args.coverpath, owner: args.owner, coverby: args.coverby });
  await User.findByIdAndUpdate(args.userid, { $push: { allphotopath: args.coverpath } });
  await User.findByIdAndUpdate(args.userid, { $pull: { allphotopath: audio.coverpath } });
}

export async function deleteOneAudio(args: { audioid: string; userid: string; coverpath: string; filepath: string }) {
  await User.findByIdAndUpdate(args.userid, { $pull: { allphotopath: args.coverpath, allaudiopath: args.filepath } });
  await Audio.findByIdAndDelete(args.audioid);
}

export async function deleteAllAudio(args: { userid: string }) {
  await Audio.deleteMany({ userid: args.userid });
}
