import { body, validationResult } from "express-validator";

const validateRegistration = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const validateLogin = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

const validateMessage = [
  body("content").notEmpty().withMessage("Message content is required"),
  body("receiverId").isInt().withMessage("Invalid receiver ID"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateMessage,
  validate,
};
