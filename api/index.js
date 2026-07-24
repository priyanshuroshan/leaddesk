const app = require('../server/index.js');

module.exports = (req, res) => {
  // Vercel rewrites strip the original URL. We explicitly pass it via the 'route' query param.
  // Here we reconstruct the original URL so Express routes match correctly.
  if (req.query && req.query.route) {
    req.url = `/api/${req.query.route}`;
  }
  return app(req, res);
};
