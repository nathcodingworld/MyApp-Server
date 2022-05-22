import { internalError, returningDataError } from "../../ErrorHandlers/UIError";
import { findAllPhoto, findOnePhoto } from "../../Keeper/Model/PhotoModel";

const PhotoQuery = {
  getPhoto: async (parent: any, args: { authorid: string }, context: any) => {
    const data = await findAllPhoto(args);
    if (!data) throw internalError("Can't fetch all Photos");
    return data;
  },
  getOnePhoto: async (parent: any, args: { id: string }, context: any) => {
    const data = await findOnePhoto(args);
    if (!data) throw returningDataError;
    return data;
  },
};

export default PhotoQuery;
