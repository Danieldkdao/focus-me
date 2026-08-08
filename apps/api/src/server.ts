import { config } from "dotenv";
config();

import express from "express";
import { env } from "./config.js";

const app = express();

app.get("/", (_, res) => {
  res.send("Hello from the FocusMe backend server.");
});

app.listen(env.PORT);
