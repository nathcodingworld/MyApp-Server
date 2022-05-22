import VideoQuery from "./QueryResolvers/VideoQuery";
import VideoMutation from "./MutationResolvers/VideoMutation";
import UserMutation from "./MutationResolvers/UserMutation";
import UserQuery from "./QueryResolvers/UserQuery";
import PostQuery from "./QueryResolvers/PostQuery";
import PhotoQuery from "./QueryResolvers/PhotoQuery";
import AudioQuery from "./QueryResolvers/AudioQuery";
import AudioMutation from "./MutationResolvers/AudioMutation";
import PhotoMutation from "./MutationResolvers/PhotoMutation";
import PostMutation from "./MutationResolvers/PostMutation";
import MessageMutation from "./MutationResolvers/MessageMutation";
import MessageQuery from "./QueryResolvers/MessageQuery";

const resolvers = {
  Query: {
    ...UserQuery,

    ...PostQuery,

    ...AudioQuery,

    ...PhotoQuery,

    ...VideoQuery,

    ...MessageQuery,
  },
  Mutation: {
    ...UserMutation,

    ...PostMutation,

    ...VideoMutation,

    ...AudioMutation,

    ...PhotoMutation,

    ...MessageMutation,
  },
};
export default resolvers;
