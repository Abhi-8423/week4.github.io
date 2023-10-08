const express = require('express');
const axios = require('axios');
const _ = require('lodash');

const app = express();
const port = 3000;

// Middleware to retrieve and analyze data from the third-party blog API
app.get('/api/blog-stats', async (req, res) => {
  try {
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
      }
    });

    const blogs = response.data;

    // Calculate statistics
    const totalBlogs = blogs.length;
    const longestTitleBlog = _.maxBy(blogs, 'title.length');
    const blogsWithPrivacy = blogs.filter(blog => blog.title.toLowerCase().includes('privacy'));
    const uniqueTitles = _.uniqBy(blogs, 'title');

    // Create the response object
    const blogStats = {
      totalBlogs,
      longestTitle: longestTitleBlog.title,
      blogsWithPrivacy: blogsWithPrivacy.length,
      uniqueTitles: uniqueTitles.map(blog => blog.title)
    };

    res.json(blogStats);
  } catch (error) {
    console.error('Error fetching and analyzing blog data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Blog search endpoint
app.get('/api/blog-search', (req, res) => {
  const query = req.query.query.toLowerCase();

  // Filter blogs based on the query string
  const filteredBlogs = blogs.filter(blog => blog.title.toLowerCase().includes(query));

  res.json(filteredBlogs);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
