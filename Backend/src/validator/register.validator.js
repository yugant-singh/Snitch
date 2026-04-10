import {body,validationResult} from 'express-validator'

function validateRequest(req, res, next) {
  const errors = validationResult(req); 
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
    next();
}


export const userValidationRules = [
  body("email")
    .isEmail()
    .withMessage("Valid email required"),

  body("contact")
    .matches(/^(?:\+91|91)?[6-9]\d{9}$/)
    .withMessage("Valid Indian contact number required"),

  body("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain one number"),
    body("isSeller")
    .isBoolean()
    .withMessage("isSeller must be a boolean value"),
    validateRequest
];

