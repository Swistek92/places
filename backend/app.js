const express = require('express');
const bodyParder = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const userRoutes = require('./routes/users-routes');

const HttpError = require('./models/http-error');
require('dotenv').config();

const app = express();
const mongo = process.env.MONGO;

app.use(bodyParder.json());
app.use('/api/places', placesRoutes);
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
  const error = new HttpError('could not find this route', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);

  res.json({ message: error.message || 'an unknow error occurred' });
});

mongoose
  .connect(mongo)
  .then(() => {
    app.listen(5000, () => {
      console.log('serv listen on 5000');
    });
  })
  .catch((err) => {
    console.log(err);
  });
