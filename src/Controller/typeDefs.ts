import { gql } from "apollo-server-express";

const Profile = `
type chatroom {
  userid: profile
  roomid: String
}

type profile {
  id: String
  userName: String
  avatar: String
  filepath: String
  heart: Int
  description: String
  friends: [profile]
  friendRequest: [profile],
  sentRequest: [String],
  messageChatRoom: [chatroom],
}
`;

const Auth = `
type Auth {
  token: String!
  id: String!
  avatar: String
  userName: String!
  bio: String
  filepath: String
}
`;
const Msg = `
type Msg {
  message: String!
}
`;

const more = `
type more {
  title: String!
  thumbnail: String!
  view: Int
  like: Int
  file: String!
}
`;

const files = `
type files {
  allphotopath: [String]
  allvideopath: [String]
  allaudiopath: [String]
  heart: Int
}
`;

const comment = `
type comment {
  userid: profile,
  date: String!
  comment: String,
}
`;

const post = `
type post {
  id: String!
  userid: profile,
  content: String,
  date: String,
  file: String,
  filepath: String
  like: Int,
  comment: Int,
  disablelike: Boolean!,
  disablecomment: Boolean!,
  comments: [comment],
}
`;

const video = `
type video {
  id: String!
  userid: profile,
  title: String!,
  thumbnail: String!,
  thumbnailpath: String
  view: Int!,
  like: Int!,
  dislike: Int!,
  comment: Int!,
  file: String!,
  filepath: String
  description: String!,
  date: String,
  disablelike: Boolean!,
  disablecomment: Boolean!,
  comments: [comment],
},
`;

const audio = `
type audio {
  id: String!
  userid: profile
  date: String
  file: String!
  filepath: String
  cover: String
  coverpath: String
  title: String!
  owner: String!
  coverby: String
}
`;
const photo = `
type photo {
  id: String!
  userid: profile
  date: String
  file: String!
  filepath: String
  caption: String!
  like: Int!
  comment: Int
  disablelike: Boolean!,
  disablecomment: Boolean!,
  comments: [comment],
}
`;

const message = `
type room {
userid: profile!
message: String!
}

type message {
  id: String!
  groupchat: Boolean
  userid: profile,
  authorid: profile,
  groupids: [profile],
  messages: [room]
}
`;

const typeDefs = gql`
  ${Profile}
  ${Auth}
  ${comment}
  ${post}
  ${video}
  ${audio}
  ${photo}
  ${Msg}
  ${more}
  ${files}
  ${message}
  type Query {
    getProfiles: [profile]
    getPost(authorid: String!): [post]
    getVideo(authorid: String!): [video]
    getAudio(authorid: String!): [audio]
    getPhoto(authorid: String!): [photo]
    getRooms(userid: String!): profile
    getOneRoom(roomid: String!): message
    getOneVideo(id: String!): video
    getOnePhoto(id: String!): photo
    getOnePost(id: String!): post
    getOneAudio(id: String!): audio
    more(userid: String!): [more]
    preDeleteProfile(id: String!): files
    getFriend(userid: String): profile
  }
  type Mutation {
    login(email: String!, password: String!): Auth!
    signup(userName: String!, email: String!, password: String!, avatar: String, bio: String, filepath: String): Auth!
    resignup(userid: String!, userName: String!, password: String!, avatar: String, bio: String, filepath: String): Auth!
    iheart(id: String!, userid: String!): profile
    ipostlike(postid: String!, userid: String!): post
    ivideolike(videoid: String!, userid: String!): video
    ivideodislike(videoid: String!, userid: String!): video
    iphotolike(photoid: String!, userid: String!): photo
    ipostcomment(postid: String!, userid: String!, comment: String): [comment]
    iphotocomment(photoid: String!, userid: String!, comment: String): [comment]
    ivideocomment(videoid: String!, userid: String!, comment: String): [comment]
    post(userid: String!, content: String, file: String, filepath: String, disablelike: Boolean!, disablecomment: Boolean!): Msg!
    video(userid: String!, file: String!, filepath: String, title: String!, thumbnail: String, thumbnailpath: String, description: String, disablelike: Boolean!, disablecomment: Boolean!): Msg!
    audio(userid: String!, file: String!, filepath: String, cover: String, coverpath: String, title: String!, owner: String!, coverby: String): Msg!
    photo(userid: String!, file: String!, filepath: String, caption: String, disablelike: Boolean!, disablecomment: Boolean!): Msg!
    editpost(postid: String!, content: String, disablelike: Boolean!, disablecomment: Boolean!): Msg!
    editvideo(userid: String!, videoid: String!, title: String!, thumbnail: String, thumbnailpath: String, description: String, disablelike: Boolean!, disablecomment: Boolean!): Msg!
    editaudio(userid: String!, audioid: String!, cover: String, coverpath: String, title: String!, owner: String!, coverby: String): Msg!
    editphoto(photoid: String!, caption: String, disablelike: Boolean!, disablecomment: Boolean!): Msg!
    deletepost(postid: String!, userid: String!, filepath: String): Msg!
    deletephoto(photoid: String!, userid: String!, filepath: String): Msg!
    deletevideo(videoid: String!, userid: String!, thumbnailpath: String, filepath: String): Msg!
    deleteaudio(audioid: String!, userid: String!, coverpath: String, filepath: String): Msg!
    deleteprofile(userid: String!): Msg!
    friendrequest(authorid: String!, userid: String!): Msg!
    cancelrequest(authorid: String!, userid: String!): Msg!
    acceptrequest(authorid: String!, userid: String!): Msg!
    refuserequest(authorid: String!, userid: String!): Msg!
    deletefriend(authorid: String!, userid: String!): Msg!
    createroomid(authorid: String!, userid: String!): Msg!
  }
`;
export default typeDefs;
