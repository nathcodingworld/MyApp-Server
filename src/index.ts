import express from "express";
import mongoose from "mongoose";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./Controller/typeDefs";
import resolvers from "./Controller/resolvers";
import cors from "cors";
import auth from "./Auth/Auth";
import "dotenv/config";
import bodyParser from "body-parser";
import http from "http";
import { Server } from "socket.io";
import ChatSocket from "./Socket/ChatSocket";

const port = process.env.PORT || 5000;
const database = process.env.DATABASE;

const app = express();
const server = http.createServer(app);
const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res }),
});
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(auth);

ChatSocket(io);

server.listen(port, () => {
  console.log(`listening at port ${port}`);
  mongoose.connect(database, (err) => {
    if (err) console.log(`can't connect to database ${database}`);
    else {
      console.log(`connected to database ${database}`);
      (async () => {
        await apollo.start();
        apollo.applyMiddleware({ app });
        console.log("apollo aplied");
      })();
    }
  });
});
