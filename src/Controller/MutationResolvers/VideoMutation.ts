import { authError, authTimeOutError, registeringError } from "../../ErrorHandlers/AuthErrors";
import { addVideo, deleteOneVideo, updateOneVideo, updateVideoComment, updateVideoDislike, updateVideoLike } from "../../Keeper/Model/VideoModel";

const VideoMutation = {
  video: async (parent: any, args: any, context: any) => {
    if (!context.req.isAuth) throw authError;
    try {
      await addVideo(args);
      return { message: "add Video Successful" };
    } catch (err) {
      throw registeringError;
    }
  },
  ivideolike: async (parent: any, args: { videoid: string; userid: string }, context: any) => {
    if (!context.req.isAuth) throw authTimeOutError;
    const data = await updateVideoLike(args);
    if (!data) throw registeringError;
    return data;
  },
  ivideodislike: async (parent: any, args: { videoid: string; userid: string }, context: any) => {
    if (!context.req.isAuth) throw authTimeOutError;
    const data = await updateVideoDislike(args);
    if (!data) throw registeringError;
    return data;
  },
  ivideocomment: async (parent: any, args: { videoid: string; userid: string; comment: string }, context: any) => {
    if (!context.req.isAuth) throw authError;
    const data = await updateVideoComment(args);
    if (!data) throw registeringError;
    return data.comments;
  },
  editvideo: async (
    parent: any,
    args: { userid: string; videoid: string; title: string; thumbnail: string; thumbnailpath: string; description: string; disablelike: boolean; disablecomment: boolean },
    context: any
  ) => {
    if (!context.req.isAuth) throw authTimeOutError;
    try {
      await updateOneVideo(args);
      return { message: "edit Video Successful" };
    } catch (err) {
      throw registeringError;
    }
  },
  deletevideo: async (parent: any, args: { userid: string; videoid: string; filepath: string; thumbnailpath: string }, context: any) => {
    if (!context.req.isAuth) throw authTimeOutError;
    try {
      await deleteOneVideo(args);
      return { message: "delete Video Successful" };
    } catch (err) {
      throw registeringError;
    }
  },
};

export default VideoMutation;
