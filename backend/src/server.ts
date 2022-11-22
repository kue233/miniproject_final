/** lib */
import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
/** config */
import { config } from "./config/config";
/** logging */
// ...
/** routes */
import profileRoutes from "./routes/Profile";
/**-------------------- */
const router = express();

/** connect to mongo */
mongoose
  .connect(config.mongo.url, { retryWrites: true, w: "majority" })
  .then(() => {
    console.log("MongoDB connected...");
    StartServer();
  })
  .catch((e) => {
    console.log("Unable to connect to MongoDB");
    console.log(e);
  });

/** start the server */
const StartServer = () => {
  /** log middleware */
  router.use((req, res, next) => {
    console.log(`incoming -> 
      Method: [${req.method}] 
    - Url:[${req.url}] 
    - IP: [${req.socket.remoteAddress}]`);

    res.on("finish", () => {
      console.log(`incomming -> 
          Method:[${req.method}]
          - Url: [${req.url}]
          - IP: [${req.socket.remoteAddress}]
          - Status: [${res.statusCode}]`);
    });

    next();
  });

  /** */
  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());
  router.use(cors());

  /** rules of API */
  router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin,X-Requested-With,Content-Type,Accept,Authorization"
    );

    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
      return res.status(200).json({});
    }
    next();
  });

  /** Routes */
  router.use("/profiles", profileRoutes);

  /** Healthckeck */
  router.get("/ping", (req, res, next) => {
    res.status(200).json({ message: "pong" });
  });

  /** Error Handling */
  router.use((req, res, next) => {
    const error = new Error("not found page");
    console.log(error);

    return res.status(404).json({ message: error.message });
  });

  /** create server and listen */
  http.createServer(router).listen(config.server.port, () => {
    console.log(`server is running on port ${config.server.port}`);
  });
};
