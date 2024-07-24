import mongoose from "mongoose";

// Define the Post schema
const postSchema = new mongoose.Schema({
  content: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  like: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// Create the Post model
const Post = mongoose.model("Post", postSchema);
export default Post;
