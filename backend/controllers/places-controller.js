const fs = require('fs');
const HttpError = require('../models/http-error');
const uuid = require('uuid').v4;
const mongoose = require('mongoose');
const getCoordsForAdress = require('../util/location');
const { validationResult } = require('express-validator');
const Place = require('../models/place');
const User = require('../models/user');
// const { default: mongoose } = require('mongoose');

// let DUMMY_PLACES = [
//   {
//     id: 'p1',
//     title: 'WTC',
//     description: 'One of the most famous sky scrapers in the world ',
//     location: {
//       lat: 40.712742,
//       lng: -74.013382,
//     },
//     address: 'World Trade Center, New York, USA',
//     creator: 'u1',
//   },
// ];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (error) {
    const err = new HttpError('smth went wrong, could not find a place', 500);
    return next(err);
  }

  if (!place) {
    let err = new HttpError('could not find a place for provided id.', 404);
    return next(err);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // let places;

  let userWithPlaces;

  try {
    userWithPlaces = await User.findById(userId).populate('places');
  } catch (error) {
    const err = new HttpError('smth went wrong, fetching users places', 500);
    return next(err);
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new HttpError('could not find a places for provided uid.', 404)
    );
  }

  res.json({
    places: userWithPlaces.places.map((p) => p.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors);
    return next(
      new HttpError('invalid inputs passed, please check your data', 422)
    );
  }
  const { title, description, address, creator } = req.body;
  let coordinates;

  try {
    coordinates = await getCoordsForAdress(address);
  } catch (error) {
    console.log(error);
    return next(error);
  }
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      'Creating place failed, please try again.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id.', 404);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();

    sess.startTransaction();

    await createdPlace.save({ session: sess });

    user.places.push(createdPlace);

    await user.save({ session: sess, validateModifiedOnly: true });

    await sess.commitTransaction();
  } catch (err) {
    console.log('err ', err);
    const error = new HttpError(
      'here here Creating place failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const err = new HttpError(
      'invalid inputs passed, please check your data',
      422
    );
    return next(err);
  }

  const { title, description, location, address } = req.body;

  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (error) {
    const err = new HttpError('smth went wrong, could not find a place', 500);
    return next(err);
  }

  if (!place) {
    let err = new HttpError('could not find a place for provided id.', 404);
    return next(err);
  }

  // const updatePlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  // const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (error) {
    const err = new HttpError('smth went wrong, could not update a place', 500);
    return next(err);
  }
  // updatePlace.location = location;
  // updatePlace.address = address;

  // DUMMY_PLACES[placeIndex] = updatePlace;
  //
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (error) {
    const err = new HttpError(
      'smth went wrong, could not delete your place',
      500
    );
    return next(err);
  }

  if (!place) {
    const err = new HttpError('could not find place for this id', 404);
    return next(err);
  }

  const imagePath = place.image;

  try {
    // await place.remove();
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    const err = new HttpError(
      'smth went wrong, could not delete your place',
      500
    );
    return next(err);
  }

  // if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
  //   throw new HttpError('could not find place with that id', 404);
  // }

  // DUMMY_PLACES = DUMMY_PLACES.filter((p) => {
  //   return p.id !== placeId;
  // });

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: 'Delete place' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
