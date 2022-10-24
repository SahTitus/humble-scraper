import mongoose from "mongoose";

const articleSchema = mongoose.Schema({
  link: String,
  title: String,
  image: String,
  source: String,
  category: String,
  mini_card: Boolean,
  translate: Boolean,
  source_img: String,
  category_id: String,
});

export default mongoose.model("Article", articleSchema);
