import mongoose from "mongoose";
import User from "../User";
import Video from "../Video";

export async function addVideo(arg: any) {
  const video = await new Video({
    userid: new mongoose.Types.ObjectId(arg.userid),
    file: arg.file,
    filepath: arg.filepath,
    title: arg.title,
    thumbnail: arg.thumbnail,
    thumbnailpath: arg.thumbnailpath,
    description: arg.description,
    date: new Date().toDateString(),
    like: 0,
    dislike: 0,
    comment: 0,
    view: 0,
    disablelike: arg.disablelike,
    disablecomment: arg.disablecomment,
    comments: [],
  });
  await User.findByIdAndUpdate(arg.userid, { $push: { allphotopath: arg.thumbnailpath, allvideopath: arg.filepath } });
  await video.save();
}

export async function findAllVideo(args: { authorid: string }) {
  if (args.authorid === "default")
    return await Video.find({}).sort({ createdAt: "desc" }).populate({ path: "userid", select: "userName avatar id" }).populate({ path: "comments.userid", select: "userName avatar id" });
  else
    return await Video.find({ userid: args.authorid })
      .sort({ createdAt: "desc" })
      .populate({ path: "userid", select: "userName avatar id" })
      .populate({ path: "comments.userid", select: "userName avatar id" });
}
export async function findOneVideo(args: { id: string }) {
  return await Video.findById(args.id).populate({ path: "userid", select: "userName avatar id" }).populate({ path: "comments.userid", select: "userName avatar id" });
}

export async function updateOneVideo(args: {
  userid: string;
  videoid: string;
  title: string;
  thumbnail: string;
  thumbnailpath: string;
  description: string;
  disablelike: boolean;
  disablecomment: boolean;
}) {
  const video = await Video.findByIdAndUpdate(args.videoid, {
    title: args.title,
    description: args.description,
    thumbnail: args.thumbnail,
    thumbnailpath: args.thumbnailpath,
    disablelike: args.disablelike,
    disablecomment: args.disablecomment,
  });
  await User.findByIdAndUpdate(args.userid, { $push: { allphotopath: args.thumbnailpath } });
  await User.findByIdAndUpdate(args.userid, { $pull: { allphotopath: video.thumbnailpath } });
}

export async function deleteOneVideo(args: { videoid: string; userid: string; thumbnailpath: string; filepath: string }) {
  await User.findByIdAndUpdate(args.userid, { $pull: { allphotopath: args.thumbnailpath, allvideopath: args.filepath } });
  await Video.findByIdAndDelete(args.videoid);
}

export async function deleteAllVideo(args: { userid: string }) {
  await Video.deleteMany({ userid: args.userid });
}

export async function findMoreVideo(args: { userid: string }) {
  return await Video.find({ userid: args.userid }, { _id: 0, title: 1, file: 1, thumbnail: 1, view: 1, like: 1 });
}

export async function updateVideoLike(args: { userid: string; videoid: string }) {
  const user = await User.findById(args.userid, { likedVideos: 1, _id: 0 });
  const userliked = user.likedVideos;
  if (userliked.includes(args.videoid)) {
    await User.findByIdAndUpdate(args.userid, { $pull: { likedVideos: args.videoid } });
    const data = await Video.findByIdAndUpdate(args.videoid, { $inc: { like: -1 } });
    return { like: data.like - 1 };
  } else {
    await User.findByIdAndUpdate(args.userid, { $push: { likedVideos: args.videoid } });
    const data = await Video.findByIdAndUpdate(args.videoid, { $inc: { like: 1 } });
    return { like: data.like + 1 };
  }
}

export async function updateVideoDislike(args: { userid: string; videoid: string }) {
  const user = await User.findById(args.userid, { dislikedVideos: 1, _id: 0 });
  const userdislike = user.dislikedVideos;
  if (userdislike.includes(args.videoid)) {
    await User.findByIdAndUpdate(args.userid, { $pull: { dislikedVideos: args.videoid } });
    const data = await Video.findByIdAndUpdate(args.videoid, { $inc: { dislike: -1 } });
    return { dislike: data.dislike - 1 };
  } else {
    await User.findByIdAndUpdate(args.userid, { $push: { dislikedVideos: args.videoid } });
    const data = await Video.findByIdAndUpdate(args.videoid, { $inc: { dislike: 1 } });
    return { dislike: data.dislike + 1 };
  }
}

export async function updateVideoComment(args: { videoid: string; userid: string; comment: string }) {
  const update = { userid: new mongoose.Types.ObjectId(args.userid), date: new Date().toDateString(), comment: args.comment };
  await Video.findByIdAndUpdate(args.videoid, { $push: { comments: update } });
  return await Video.findById(args.videoid, { comments: 1, _id: 0 })
    .sort({ createdAt: "desc" })
    .populate({ path: "comments", populate: { path: "userid", select: "userName avatar id" } });
}
