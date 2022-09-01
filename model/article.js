import mongoose from "mongoose";

const articleSchema = mongoose.Schema({
  category: { String },
  sub_category: { String },
  data: { Object },
  source: { String },
  source_img: { String },
});

const Article = mongoose.model("Article", articleSchema);

export default Article;

