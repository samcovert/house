const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
    // check('email')
    //   .exists({ checkFalsy: true })
    //   .isEmail()
    //   .withMessage('Please provide a valid email.'),
    // check('username')
    //   .exists({ checkFalsy: true })
    //   .isLength({ min: 4 })
    //   .withMessage('Please provide a username with at least 4 characters.'),
    // check('username')
    //   .not()
    //   .isEmail()
    //   .withMessage('Username cannot be an email.'),
    // check('password')
    //   .exists({ checkFalsy: true })
    //   .isLength({ min: 6 })
    //   .withMessage('Password must be 6 characters or more.'),
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Invalid email'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('UserName is required'),
    check('firstName')
      .exists({ checkFalsy: true })
      .withMessage('First Name is required'),
    check('lastName')
      .exists({ checkFalsy: true })
      .withMessage('Last Name is required'),
    handleValidationErrors
  ];

// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { firstName, lastName, email, password, username } = req.body;
      const hashedPassword = bcrypt.hashSync(password);

      // const existingEmail = await User.findAll({
      //   where: { email: email }
      // })
      // if (existingEmail) {
      //   return res.status(500).json({
      //     "message": "User already exists",
      //     "errors": {
      //       "email": "User with that email already exists"
      //     }
      //   })
      // }
      // const existingUser = await User.findAll({
      //   where: { username: username }
      // })
      // // console.log(existingUser)
      // if (existingUser) {
      //   return res.status(500).json({
      //     "message": "User already exists",
      //     "errors": {
      //       "username": "User with that username already exists"
      //     }
      //   })
      // }

      const user = await User.create({ firstName, lastName, email, username, hashedPassword });

      const safeUser = {
        firstName: user.firstName,
        lastName: user.lastName,
        id: user.id,
        email: user.email,
        username: user.username,
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
    }
  );

module.exports = router;
