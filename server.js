const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mern_posts_feed', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

const postSchema = new mongoose.Schema({
  userName: String,
  message: String,
  comments: [{ userName: String, message: String }],
});

const Post = mongoose.model('Post', postSchema);

app.get('/api/posts', async (req, res) => {
  const { search } = req.query;
  let posts;

  if (search) {
    posts = await Post.find({ userName: new RegExp(search, 'i') });
  } else {
    posts = await Post.find();
  }

  res.json(posts);
});

app.post('/api/posts', async (req, res) => {
  const { userName, message } = req.body;
  const newPost = new Post({ userName, message });
  await newPost.save();
  res.json(newPost);
});

app.post('/api/posts/:postId/comments', async (req, res) => {
  const { userName, message } = req.body;
  const post = await Post.findById(req.params.postId);
  post.comments.push({ userName, message });
  await post.save();
  res.json(post);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
