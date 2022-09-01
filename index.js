import * as cheerio from "cheerio";
import axios from "axios";
import express from "express";
import bodyParser from "body-parser";
import { scraper } from "./controllers/articles.js";
import cors from "cors"
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./config/connectDb.js";

const PORT = 9000;
dotenv.config();
const app = express();

connectDB();

app.use(express.urlencoded({ extended: false }));
app.use(cors())
  app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use('/humble-scraper', scraper)
// Medium
// const medUrl = `https://medium.com/tag/${"technology"}`;
// axios(medUrl).then((response) => {
//   console.log(response.data);
//   const html = response.data;
//   const $ = cheerio.load(html);
//   const articles = [];

//   // $(".o .l.eo.le").each((i, el) => {
//   //   const title = $(el).find(" h2").text();

//   //   // articles.push({title,})
//   // }).get();

//   console.log(html)
// });



mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB 😆");
  app.listen(PORT, () => console.log(`App is running on PORT ${PORT}`));
});