const app = require('../server/index.js');
const { parse } = require('url');

module.exports = (req, res) => {
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
