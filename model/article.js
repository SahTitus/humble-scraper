import mongoose from "mongoose";

const articleSchema = mongoose.Schema({
  category: String,
  sub_category: String,
  title: String,
  link: String,
  image: String,
  source: String,
  source_img: String,
});

export default mongoose.model("Article", articleSchema);
