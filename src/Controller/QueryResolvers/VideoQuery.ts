import { internalError, propablyDeletedError, refreshError, returningDataError } from "../../ErrorHandlers/UIError";
import { findAllVideo, findMoreVideo, findOneVideo } from "../../Keeper/Model/VideoModel";

const VideoQuery = {
  getVideo: async (parent: any, args: { authorid: string }, context: any) => {
    const data = await findAllVideo(args);
    if (!data) throw internalError("Can't fetch all Videos");
    return data;
  },
  getOneVideo: async (parent: any, args: { id: string }, context: any) => {
    try {
      const data = await findOneVideo(args);
      if (!data) throw new Error("noData");
      return data;
    } catch (error: any) {
      if (error.message === "noData") throw propablyDeletedError;
      else throw refreshError;
    }
  },
  more: async (parent: any, args: { userid: string }, context: any) => {
    const data = await findMoreVideo(args);
    if (!data) throw returningDataError;
    return data;
  },
};

export default VideoQuery;
