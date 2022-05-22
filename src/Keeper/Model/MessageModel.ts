import mongoose from "mongoose";
import Message from "../Message";
import User from "../User";

export async function createRoom(args: { authorid: string; userid: string }) {
  const userid = new mongoose.Types.ObjectId(args.userid);
  const authorid = new mongoose.Types.ObjectId(args.authorid);
  const userRoomid = await Message.findOne({ userid: userid, authorid: authorid }, { _id: 1 });

  if (userRoomid) return userRoomid;
  const authorRoomid = await Message.findOne({ userid: authorid, authorid: userid }, { _id: 1 });

  if (authorRoomid) return authorRoomid;
  const room = await new Message({
    groupchat: false,
    userid: userid,
    authorid: authorid,
    groupids: [userid, authorid],
    messages: [],
  });
  const data = await room.save();
  const touserid = { userid: authorid, roomid: data._id.toString() };
  const toauthorid = { userid: userid, roomid: data._id.toString() };
  await User.findByIdAndUpdate(args.userid, { $push: { messageChatRoom: touserid } });
  await User.findByIdAndUpdate(args.authorid, { $push: { messageChatRoom: toauthorid } });
  return data;
}

export async function getRoom(args: { roomid: string }) {
  if (args.roomid === "none") return { messages: [] };
  return await Message.findById(args.roomid).populate("messages.userid");
}

export async function storeMessage(args: { userid: string; roomid: string; message: string }) {
  const data = {
    userid: new mongoose.Types.ObjectId(args.userid),
    message: args.message,
  };
  await Message.findByIdAndUpdate(args.roomid, { $push: { messages: data } });
}
