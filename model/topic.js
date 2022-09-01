import mongoose from "mongoose";

const topicSchema = mongoose.Schema({
  source: { String },
  source_img: { String },
  title: { String },
  link: { String },
  data: { Object },
  topics: {
    type: [Object],
    data: [Object],
    explore: Boolean,
    topic: String,
    subcategory: String,
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Topic = mongoose.model("Topic", topicSchema);

export default Topic;
