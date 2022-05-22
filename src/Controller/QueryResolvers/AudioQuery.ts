import { internalError, returningDataError } from "../../ErrorHandlers/UIError";
import { findAllAudio, findOneAudio } from "../../Keeper/Model/AudioModel";

const AudioQuery = {
  getAudio: async (parent: any, args: { authorid: string }, context: any) => {
    const data = await findAllAudio(args);
    if (!data) throw internalError("Can't fetch all Music");
    return data;
  },
  getOneAudio: async (parent: any, args: { id: string }, context: any) => {
    const data = await findOneAudio(args);
    if (!data) throw returningDataError;
    return data;
  },
};

export default AudioQuery;
