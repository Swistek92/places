const uuid = require('uuid').v4;

const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

// const DUMMY_USERS = [
//   {
//     id: 'u1',
//     name: 'Piotr Swistowski',
//     email: 'test@test.com',
//     password: '123456',
//   },
// ];

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '--password');
  } catch (error) {
    const err = new HttpError(
      'fetching users failed please try again later',
      500
    );
    return next(err);
  }
  res.json({ users: users.map((u) => u.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let err = new HttpError(
      'invalid inputs passed, please check your data',
      422
    );
    return next(err);
  }

  const { name, email, password } = req.body;

  // if (name === undefined || email === undefined || password === undefined) {
  //   throw new HttpError('set all propety', 402);
  // }
  // const hasUser = DUMMY_USERS.find((e) => e.email === email);

  // if (hasUser) {
  //   throw new HttpError('email is allready exists', 402);
  // }
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    const err = new HttpError(
      'smth went wrong, sigin up fail try again later',
      500
    );
    return next(err);
  }

  if (existingUser) {
    const error = new HttpError(
      'user exists allready, please login instaead',
      422
    );
    return next(error);
  }

  // const userSchema = new Schema({
  //   name: { type: String, required: true },
  //   email: { type: String, required: true, unique: true },
  //   password: { type: String, required: true, minlength: 6 },
  //   image: { type: String, required: true },
  //   places: { type: String, required: true },
  // });

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (error) {
    console.log(error);
    const err = new HttpError('createdUser fail , place try again', 500);
    return next(err);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    const err = new HttpError(
      'smth went wrong,  login in fail try again later',
      500
    );
    return next(err);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  // const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  // if (!identifiedUser || identifiedUser.password !== password) {
  //   const err = new HttpError(
  //     'could not identify user, credentials semm to be wrong',
  //     401
  //   );
  //   return next(err);
  // }

  res.json({
    message: 'logged in',
    user: existingUser.toObject({ getters: true }),
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
