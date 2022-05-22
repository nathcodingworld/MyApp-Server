import { ApolloError } from "apollo-server-express";

export const authTimeOutError = new ApolloError("Authorization expired", "Error Code (401)", { type: "Auth", info: "try re-Login by signing out and login" });

export const authError = new ApolloError("not Authorize", "Error Code (401)", { type: "Auth", info: "Log in or Sign up" });

export const creatingTokenError = new ApolloError("Can't Log in, creating id failed", "INTERNAL SERVER ERROR", {
  type: "Internal",
  info: "internal server error, website is down until it fixed by the owner",
});

export const registeringError = new ApolloError("registering failed", "Error Code (400)", { type: "Crash", info: "request data might be corrupted" });

export const noUserError = new ApolloError("User not Found", "Error Code: (400)", { type: "Auth", clienterror: true });

export const passwordError = new ApolloError("Password is Incorect or invalid", "Error Code: (400)", { type: "Invalid", clienterror: true });

export const emailError = new ApolloError("Email is invalid", "Error Code: (400)", { type: "Auth" });
