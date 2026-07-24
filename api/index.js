const app = require('../server/index.js');
const { parse } = require('url');
const mongoose = require('mongoose');

module.exports = (req, res) => {
  // Debug endpoint to check Vercel environment
  if (req.url.includes('/api/_debug')) {
    return res.json({
      env_mongo: !!process.env.MONGO_URI,
      env_jwt: !!process.env.JWT_SECRET,
      db_state: mongoose.connection.readyState,
      url: req.url,
      originalUrl: req.headers['x-invoke-path'] || req.url,
      method: req.method
    });
  }

  // Parse the query string manually since Vercel might not populate req.query for raw HTTP handlers
  const parsedUrl = parse(req.url, true);
  
  if (parsedUrl.query && parsedUrl.query.route) {
    // Restore the exact path Express expects, preserving any other query parameters
    const originalQuery = Object.keys(parsedUrl.query)
      .filter(key => key !== 'route')
      .map(key => `${key}=${parsedUrl.query[key]}`)
      .join('&');
      
    req.url = `/api/${parsedUrl.query.route}${originalQuery ? '?' + originalQuery : ''}`;
  }
  
  return app(req, res);
};
