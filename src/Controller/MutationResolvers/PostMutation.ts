import { crashError } from "../../ErrorHandlers/UIError";
import { authError, authTimeOutError, registeringError } from "../../ErrorHandlers/AuthErrors";
import { addPost, deleteOnePost, updateComment, updateLike, updateOnePost } from "../../Keeper/Model/PostModel";

const PostMutation = {
  post: async (parent: any, args: any, context: any) => {
    if (!context.req.isAuth) throw authTimeOutError;
    try {
      await addPost(args);
      return { message: "add Post Successful" };
    } catch (err) {
      throw registeringError;
    }
  },
  ipostlike: async (parent: any, args: { postid: string; userid: string }, context: any) => {
    if (!context.req.isAuth) throw authError;
    const data = await updateLike(args);
    if (!data) throw crashError;
    return data;
  },
  ipostcomment: async (parent: any, args: { postid: string; userid: string; comment: string }, context: any) => {
    if (!context.req.isAuth) throw authError;
    const data = await updateComment(args);
    if (!data.comments) throw crashError;
    return data.comments;
  },
  editpost: async (parent: any, args: { postid: string; content: string; disablelike: boolean; disablecomment: boolean }, context: any) => {
    if (!context.req.isAuth) throw authTimeOutError;
    try {
      await updateOnePost(args);
      return { message: "edit Post Successful" };
    } catch (err) {
      throw registeringError;
    }
  },
  deletepost: async (parent: any, args: { postid: string; userid: string; filepath: string }, context: any) => {
    if (!context.req.isAuth) throw authTimeOutError;
    try {
      await deleteOnePost(args);
      return { message: "delete Post Successful" };
    } catch (err) {
      throw registeringError;
    }
  },
};

export default PostMutation;
