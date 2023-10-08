// Create a function to fetch and analyze blog data
const fetchAndAnalyzeBlogData = async () => {
  try {
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
      }
    });

    const blogs = response.data;

    // Calculate statistics as before
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

    return blogStats;
  } catch (error) {
    console.error('Error fetching and analyzing blog data:', error);
    throw new Error('Internal server error');
  }
};

// Memoize the fetchAndAnalyzeBlogData function with a caching period of 5 minutes (300,000 milliseconds)
const memoizedFetchAndAnalyzeBlogData = _.memoize(fetchAndAnalyzeBlogData, null, 300000);

// Middleware for /api/blog-stats route
app.get('/api/blog-stats', async (req, res) => {
  try {
    const blogStats = await memoizedFetchAndAnalyzeBlogData();
    res.json(blogStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear the cache after a certain period (e.g., 1 hour)
setInterval(() => {
  memoizedFetchAndAnalyzeBlogData.cache.clear();
}, 3600000); // 1 hour in milliseconds
