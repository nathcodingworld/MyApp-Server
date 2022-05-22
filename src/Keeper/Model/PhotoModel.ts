import mongoose from "mongoose";
import Photo from "../Photo";
import User from "../User";

export async function addPhoto(arg: any) {
  const photo = await new Photo({
    userid: new mongoose.Types.ObjectId(arg.userid),
    file: arg.file,
    filepath: arg.filepath,
    caption: arg.caption,
    date: new Date().toDateString(),
    like: 0,
    comment: 0,
    disablelike: arg.disablelike,
    disablecomment: arg.disablecomment,
    comments: [],
  });
  await User.findByIdAndUpdate(arg.userid, { $push: { allphotopath: arg.filepath } });
  await photo.save();
}

export async function findAllPhoto(args: { authorid: string }) {
  if (args.authorid === "default")
    return await Photo.find({}).sort({ createdAt: "desc" }).populate({ path: "userid", select: "userName avatar id" }).populate({ path: "comments.userid", select: "userName avatar id" });
  else
    return await Photo.find({ userid: args.authorid })
      .sort({ createdAt: "desc" })
      .populate({ path: "userid", select: "userName avatar id" })
      .populate({ path: "comments.userid", select: "userName avatar id" });
}

export async function findOnePhoto(args: { id: string }) {
  return await Photo.findById(args.id).populate({ path: "userid", select: "userName avatar id" }).populate({ path: "comments.userid", select: "userName avatar id" });
}

export async function updateOnePhoto(args: { photoid: string; caption: string; disablelike: boolean; disablecomment: boolean }) {
  await Photo.findByIdAndUpdate(args.photoid, { caption: args.caption, disablelike: args.disablelike, disablecomment: args.disablecomment });
}

export async function deleteOnePhoto(args: { photoid: string; userid: string; filepath: string }) {
  await User.findByIdAndUpdate(args.userid, { $pull: { allphotopath: args.filepath } });
  await Photo.findByIdAndDelete(args.photoid);
}

export async function deleteAllPhoto(args: { userid: string }) {
  await Photo.deleteMany({ userid: args.userid });
}

export async function updatePhotoLike(args: { photoid: string; userid: string }) {
  const user = await User.findById(args.userid, { likedPhotos: 1, _id: 0 });
  const userliked = user.likedPhotos;
  if (userliked.includes(args.photoid)) {
    await User.findByIdAndUpdate(args.userid, { $pull: { likedPhotos: args.photoid } });
    const data = await Photo.findByIdAndUpdate(args.photoid, { $inc: { like: -1 } });
    return { like: data.like - 1 };
  } else {
    await User.findByIdAndUpdate(args.userid, { $push: { likedPhotos: args.photoid } });
    const data = await Photo.findByIdAndUpdate(args.photoid, { $inc: { like: 1 } });
    return { like: data.like + 1 };
  }
}

export async function updatePhotoComment(args: { photoid: string; userid: string; comment: string }) {
  const update = { userid: new mongoose.Types.ObjectId(args.userid), date: new Date().toDateString(), comment: args.comment };
  await Photo.findByIdAndUpdate(args.photoid, { $push: { comments: update } });
  return await Photo.findById(args.photoid, { comments: 1, _id: 0 }).populate({ path: "comments", populate: { path: "userid", select: "userName avatar id" } });
}
