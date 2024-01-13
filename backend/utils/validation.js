const { validationResult } = require('express-validator');
const { check } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    // const err = Error("Bad request.");
    // err.errors = errors;
    // err.status = 400;
    // err.title = "Bad request.";
    // next(err);
    return res.status(400).json({
      message: "Bad Request",
      errors
    })
  }
  next();
};

const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
  check('lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be within -90 and 90'),
  check('lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be within -180 and 180'),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Price per day must be a positive number'),
  handleValidationErrors
];

const validateReviews = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .exists({ checkFalsy: true })
    .isFloat({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
]

const validateQuery = [
  check('page')
    .default(1)
    .isFloat({ min: 1, max: 10 })
    .withMessage("Page must be greater than or equal to 1"),
  check('size')
    .default(20)
    .isFloat({ min: 1, max: 20 })
    .withMessage("Size must be greater than or equal to 1"),
  check('maxLat')
    .optional()
    .isDecimal()
    .withMessage("Maximum latitude is invalid"),
  check('minLat')
    .optional()
    .isDecimal()
    .withMessage("Minimum latitude is invalid"),
  check('minLng')
    .optional()
    .isDecimal()
    .withMessage("Minimum longitude is invalid"),
  check('maxLng')
    .optional()
    .isDecimal()
    .withMessage("Maximum longitude is invalid"),
  check('minPrice')
    .optional()
    .isDecimal()
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be greater than or equal to 0"),
  check('maxPrice')
    .optional()
    .isDecimal()
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be greater than or equal to 0"),
  handleValidationErrors
]



module.exports = {
  handleValidationErrors,
  validateSpot,
  validateReviews,
  validateQuery
};
