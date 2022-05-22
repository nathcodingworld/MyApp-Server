import { ApolloError } from "apollo-server-express";

export const friendRequestError = (type: string) => new ApolloError(type + " friend request failed", "INTERNAL SERVER ERROR", { type: "Internal", info: "internal server error, it might be broken" });

export const internalError = (type: string) => new ApolloError(type, "INTERNAL SERVER ERROR", { type: "Internal", info: "internal server error, it might be broken" });

export const brokenError = (type: string) => new ApolloError("internal server error, " + type, "error Code: (500)", { type: "Broken", info: "internal server error, it might be broken" });

export const returningDataError = new ApolloError("can't Fetch Data from server", "INTERNAL SERVER ERROR", { type: "Broken", info: "internal server error, it might be broken" });

export const propablyDeletedError = new ApolloError("Can't fetch data", "ERROR CODE (404)", { type: "Crash", info: "propably, already deleted" });

export const crashError = new ApolloError("Crashed request data", "Error code (400)", { type: "Crash", info: "consider re-login" });

export const refreshError = new ApolloError("Can't refresh page", "Error code (404)", {
  type: "Crash",
  info: " click the video page again and play the video ",
});
