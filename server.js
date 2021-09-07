import express from "express";
import cors from "cors";
import lib from "./src/lib/index.js";
import mongoose from "mongoose";
import profileRouter from "./src/services/profile/index.js";
import postRouter from "./src/services/post/index.js";

const { errorHandlers, serverConfig } = lib;

const server = express();
const { PORT } = process.env;

server.use(express.json());
server.use(cors(serverConfig));

server.use("/profile", profileRouter);
server.use("/posts", postRouter);

server.use(errorHandlers.forbidden);
server.use(errorHandlers.notFound);
server.use(errorHandlers.badRequest);
server.use(errorHandlers.server);

mongoose.connect(process.env.MONGO_CONN);
mongoose.connection.on("connected", () => {
  try {
    console.log("Mongo connected");
    server.listen(PORT, async () => {
      console.log("🚀 Server is running on port ", PORT);
    });
    mongoose.connection.on("error", (error) => {
      console.log("Mongo error: ", error);
    });
    server.on("error", (error) =>
      console.log("🚀 Server is crashed due to ", error)
    );
  } catch (error) {
    console.log(error);
  }
});
