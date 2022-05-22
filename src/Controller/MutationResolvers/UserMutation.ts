import { deleteAllAudio } from "../../Keeper/Model/AudioModel";
import { deleteAllPhoto } from "../../Keeper/Model/PhotoModel";
import { deleteAllPost } from "../../Keeper/Model/PostModel";
import { deleteAllVideo } from "../../Keeper/Model/VideoModel";
import { CreateToken } from "../../Auth/UserToker";
import { addFriend, AddUser, cancelFriend, DeleteUser, GetUser, refuseFriend, removeFriend, requestFriend, updateHeart, UpdateUser } from "../../Keeper/Model/UserModel";

import { VerifyPassword } from "../../Auth/UserPassword";
import { authError, authTimeOutError, creatingTokenError, emailError, noUserError, passwordError, registeringError } from "../../ErrorHandlers/AuthErrors";
import { brokenError, friendRequestError, internalError } from "../../ErrorHandlers/UIError";

const UserMutation = {
  login: async (parent: any, args: any, context: any) => {
    const data = await GetUser(args.email);
    if (!data) throw noUserError;
    const isEqual = await VerifyPassword(args.password, data.password);
    if (!isEqual) throw passwordError;
    const token = CreateToken(data);
    if (!token) throw creatingTokenError;
    return { token, id: data._id.toString(), avatar: data.avatar, userName: data.userName, bio: data.description, filepath: data.filepath };
  },
  signup: async (parent: any, args: any, context: any) => {
    try {
      const data = await AddUser(args);
      if (!data) throw registeringError;
      const token = CreateToken(data);
      if (!token) throw creatingTokenError;
      return { token, id: data._id.toString(), avatar: data.avatar, userName: data.userName, bio: data.description, filepath: data.filepath };
    } catch (err) {
      throw err;
    }
  },
  resignup: async (parent: any, args: any, context: any) => {
    if (!context.req.isAuth) throw authTimeOutError;
    const data = await UpdateUser(args);
    if (!data) throw registeringError;
    const token = CreateToken(data);
    if (!token) throw creatingTokenError;
    return { token: token, id: data._id.toString(), avatar: args.avatar, userName: args.userName, bio: args.bio, filepath: args.filepath };
  },
  deleteprofile: async (parent: any, args: { userid: string }, context: any) => {
    if (!context.req.isAuth) throw authTimeOutError;
    try {
      await deleteAllPost(args);
      await deleteAllVideo(args);
      await deleteAllPhoto(args);
      await deleteAllAudio(args);
      await DeleteUser(args);
      return { message: "Account Deleted" };
    } catch (error) {
      throw brokenError("can't delete data");
    }
  },
  iheart: async (parent: any, args: { id: string; userid: string }, context: any) => {
    if (!context.req.isAuth) throw authError;
    const data = await updateHeart(args);
    if (!data) throw internalError("Internal error");
    return data;
  },
  friendrequest: async (parent: any, args: { authorid: string; userid: string }, context: any) => {
    if (!context.req.isAuth) throw authError;
    try {
      await requestFriend(args);
      return { message: "Request sent" };
    } catch (error) {
      throw friendRequestError("Sending");
    }
  },
  cancelrequest: async (parent: any, args: { authorid: string; userid: string }, context: any) => {
    if (!context.req.isAuth) throw authTimeOutError;
    try {
      await cancelFriend(args);
      return { message: "Request canceled" };
    } catch (error) {
      throw friendRequestError("Canceling");
    }
  },
  refuserequest: async (parent: any, args: { authorid: string; userid: string }, context: any) => {
    if (!context.req.isAuth) throw authTimeOutError;
    try {
      await refuseFriend(args);
      return { message: "friend request removed" };
    } catch (error) {
      throw friendRequestError("Refusing");
    }
  },
  acceptrequest: async (parent: any, args: { authorid: string; userid: string }, context: any) => {
    if (!context.req.isAuth) throw authTimeOutError;
    try {
      await addFriend(args);
      return { message: "Friend added" };
    } catch (error) {
      throw friendRequestError("Accepting");
    }
  },
  deletefriend: async (parent: any, args: { authorid: string; userid: string }, context: any) => {
    if (!context.req.isAuth) throw authTimeOutError;
    try {
      await removeFriend(args);
      return { message: "Friend removed" };
    } catch (error) {
      throw friendRequestError("Removing");
    }
  },
};

export default UserMutation;
