import { Server } from "socket.io";
import { storeMessage } from "../Keeper/Model/MessageModel";

export default function ChatSocket(io: Server) {
  io.on("connection", (socket) => {
    socket.on("joinRoom", (room) => {
      if (room === "none") return;
      socket.join(room);
    });
    socket.on("leaveRoom", (room) => {
      if (room === "none") return;
      socket.leave(room);
    });
    socket.on("sendMessage", async (args) => {
      if (args.roomid === "none") return;
      try {
        await storeMessage(args);
        socket.to(args.roomid).emit("receiveMessage");
      } catch (error) {
        socket.to(args.roomid).emit("recieveFailed");
      }
    });
  });
}
