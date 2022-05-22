import { returningDataError } from "../../ErrorHandlers/UIError";
import { getRoom } from "../../Keeper/Model/MessageModel";

const MessageQuery = {
  getOneRoom: async (parent: any, args: { roomid: string }, context: any) => {
    const data = await getRoom(args);
    if (!data) throw returningDataError;
    return data;
  },
};

export default MessageQuery;
