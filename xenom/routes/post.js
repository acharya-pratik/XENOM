const express = require('express');

const Post = require('../models/post');
const router = express.Router();

const moduleName = require('port2'); // Import the module
// Route to get all posts
router.get('/', async (req, res) => {
  try {
    // Fetch all posts from the database
    const posts = await Post.find();

    // Pass the posts to the 'home.ejs' view
    res.render('home', { posts: posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Error fetching posts');
  }
});

// Route to create a new post (optional, if you want to create posts via API)
router.post('/create', async (req, res) => {
  try {
    const newPost = new Post({
      username: req.body.username,
      description: req.body.description,
      photo: req.body.photo,
      likes: req.body.likes,
      comments: req.body.comments,
      shares: req.body.shares
    });

    await newPost.save();
    res.redirect('/');
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send('Error creating post');
  }
});

module.exports = router;
