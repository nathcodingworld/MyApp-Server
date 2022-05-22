import { internalError, returningDataError } from "../../ErrorHandlers/UIError";
import { authError } from "../../ErrorHandlers/AuthErrors";
import { findAllProfile, GetAllFiles, getFriend, getRooms } from "../../Keeper/Model/UserModel";

const UserQuery = {
  getProfiles: async (parent: any, args: any, context: any) => {
    const data = await findAllProfile();
    if (!data) throw internalError("Can't fetch all profiles");
    return data;
  },
  preDeleteProfile: async (parent: any, args: { id: string }, context: any) => {
    const data = await GetAllFiles(args);
    if (!data) throw returningDataError;
    return data;
  },
  getFriend: async (parent: any, args: { userid: string }, context: any) => {
    const data = await getFriend(args);
    if (!data) throw internalError("Can't fetch all friend profiles");
    return data;
  },
  getRooms: async (parent: any, args: { userid: string }, context: any) => {
    if (!context.req.isAuth) throw authError;
    const data = await getRooms(args);
    return data;
  },
};

export default UserQuery;
