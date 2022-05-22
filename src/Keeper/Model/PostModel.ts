import mongoose from "mongoose";
import Post from "../Post";
import User from "../User";

export async function addPost(arg: any) {
  const post = await new Post({
    userid: new mongoose.Types.ObjectId(arg.userid),
    content: arg.content,
    file: arg.file,
    filepath: arg.filepath,
    date: new Date().toDateString(),
    like: 0,
    comment: 0,
    disablelike: arg.disablelike,
    disablecomment: arg.disablecomment,
    comments: [],
  });
  if (arg.file) await User.findByIdAndUpdate(arg.userid, { $push: { allphotopath: arg.filepath } });
  await post.save();
}

export async function findAllPost(args: { authorid: string }) {
  if (args.authorid === "default")
    return await Post.find({}).sort({ createdAt: "desc" }).populate({ path: "userid", select: "userName avatar id" }).populate({ path: "comments.userid", select: "userName avatar id" });
  else
    return await Post.find({ userid: args.authorid })
      .sort({ createdAt: "desc" })
      .populate({ path: "userid", select: "userName avatar id" })
      .populate({ path: "comments.userid", select: "userName avatar id" });
}

export async function findOnePost(args: { id: string }) {
  return await Post.findById(args.id);
}

export async function updateOnePost(args: { postid: string; content: string; disablelike: boolean; disablecomment: boolean }) {
  await Post.findByIdAndUpdate(args.postid, { content: args.content, disablelike: args.disablelike, disablecomment: args.disablecomment });
}

export async function deleteOnePost(args: { postid: string; userid: string; filepath: string }) {
  if (args.filepath) await User.findByIdAndUpdate(args.userid, { $pull: { allphotopath: args.filepath } });
  await Post.findByIdAndDelete(args.postid);
}

export async function deleteAllPost(args: { userid: string }) {
  await Post.deleteMany({ userid: args.userid });
}

export async function updateLike(args: { postid: string; userid: string }) {
  const user = await User.findById(args.userid, { likedPost: 1, _id: 0 });
  const userliked = user.likedPost;
  if (userliked.includes(args.postid)) {
    await User.findByIdAndUpdate(args.userid, { $pull: { likedPost: args.postid } });
    const data = await Post.findByIdAndUpdate(args.postid, { $inc: { like: -1 } });
    return { like: data.like - 1 };
  } else {
    await User.findByIdAndUpdate(args.userid, { $push: { likedPost: args.postid } });
    const data = await Post.findByIdAndUpdate(args.postid, { $inc: { like: 1 } });
    return { like: data.like + 1 };
  }
}

export async function updateComment(args: { postid: string; userid: string; comment: string }) {
  const update = { userid: new mongoose.Types.ObjectId(args.userid), date: new Date().toDateString(), comment: args.comment };
  await Post.findByIdAndUpdate(args.postid, { $push: { comments: update } });
  return await Post.findById(args.postid, { comments: 1, _id: 0 }).populate({ path: "comments", populate: { path: "userid", select: "userName avatar id" } });
}
