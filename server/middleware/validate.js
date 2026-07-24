const { validationResult } = require('express-validator');

/**
 * Middleware factory: runs express-validator rules and responds with errors if any
 * @param {import('express-validator').ValidationChain[]} validations
 */
const validate = (validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) break;
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }
    next();
  };
};

module.exports = { validate };
