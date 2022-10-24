import express from "express";
import bodyParser from "body-parser";
import { scraper } from "./controllers/articles.js";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./config/connectDb.js";
import { scraper1 } from "./controllers/scraper1.js";
import { scraper2 } from "./controllers/scraper2.js";

const PORT = 9000;
dotenv.config();
const app = express();

connectDB();

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use("/humble-scraper", scraper);
app.use("/scraper-1", scraper1);
app.use("/scraper-2", scraper2);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB 😆");
  app.listen(PORT, () => console.log(`App is running on PORT ${PORT}`));
});
