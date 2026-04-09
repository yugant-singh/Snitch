import { body, validationResult } from 'express-validator'

function validateRequest(req, res, next) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    })
  }

  next()
}

export const loginValidationRules = [
  body("email")
    .optional()
    .isEmail()
    .withMessage("Valid email required"),

  body("contact")
    .optional()
    .matches(/^(?:\+91|91)?[6-9]\d{9}$/)
    .withMessage("Valid contact required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),

  validateRequest
]