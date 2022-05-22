import { internalError, propablyDeletedError } from "../../ErrorHandlers/UIError";
import { findAllPost, findOnePost } from "../../Keeper/Model/PostModel";

const PostQuery = {
  getPost: async (parent: any, args: { authorid: string }, context: any) => {
    const data = await findAllPost(args);
    if (!data) throw internalError("Can't fetch all Post");
    return data;
  },
  getOnePost: async (parent: any, args: { id: string }, context: any) => {
    const data = await findOnePost(args);
    if (!data) throw propablyDeletedError;
    return data;
  },
};

export default PostQuery;
