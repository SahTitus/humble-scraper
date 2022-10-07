import mongoose from "mongoose";

const conditionSchema = mongoose.Schema({
  source: String ,
  source_img: String ,
  title: String ,
  link: String ,
  category: String ,
  sub_category: String ,
  condition: String ,
  image: String ,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model("CondArticle", conditionSchema);;
