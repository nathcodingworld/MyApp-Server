import { authError, registeringError } from "../../ErrorHandlers/AuthErrors";
import { createRoom } from "../../Keeper/Model/MessageModel";

const MessageMutation = {
  createroomid: async (parent: any, args: { authorid: string; userid: string }, context: any) => {
    if (!context.req.isAuth) throw authError;
    const data = await createRoom(args);
    if (!data) throw registeringError;
    return { message: data._id.toString() };
  },
};

export default MessageMutation;
