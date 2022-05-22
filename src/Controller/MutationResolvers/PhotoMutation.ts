import { authError, authTimeOutError, registeringError } from "../../ErrorHandlers/AuthErrors";
import { addPhoto, deleteOnePhoto, updateOnePhoto, updatePhotoComment, updatePhotoLike } from "../../Keeper/Model/PhotoModel";

const PhotoMutation = {
  photo: async (parent: any, args: any, context: any) => {
    if (!context.req.isAuth) throw authError;
    try {
      await addPhoto(args);
      return { message: "add Photo Successful" };
    } catch (err) {
      throw registeringError;
    }
  },
  iphotolike: async (parent: any, args: { photoid: string; userid: string }, context: any) => {
    if (!context.req.isAuth) throw authTimeOutError;

    const data = await updatePhotoLike(args);
    if (!data) throw registeringError;
    return data;
  },
  iphotocomment: async (parent: any, args: { photoid: string; userid: string; comment: string }, context: any) => {
    if (!context.req.isAuth) throw authTimeOutError;
    const data = await updatePhotoComment(args);
    if (!data.comments) throw registeringError;
    return data.comments;
  },
  editphoto: async (parent: any, args: { photoid: string; caption: string; disablelike: boolean; disablecomment: boolean }, context: any) => {
    if (!context.req.isAuth) throw authTimeOutError;
    try {
      await updateOnePhoto(args);
      return { message: "edit Photo Successful" };
    } catch (err) {
      throw registeringError;
    }
  },
  deletephoto: async (parent: any, args: { photoid: string; userid: string; filepath: string }, context: any) => {
    if (!context.req.isAuth) authTimeOutError;
    try {
      await deleteOnePhoto(args);
      return { message: "delete Photo Successful" };
    } catch (err) {
      throw registeringError;
    }
  },
};

export default PhotoMutation;
