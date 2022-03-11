const axios = require('axios');
const HttpError = require('../models/http-error');
const API_KEY = process.env.MAP_API;

async function getCoordsForAdress(address) {
  const respone = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=AIzaSyBEof-KR5vudJjQboA1bdhmYK9oE8If8Rs`
  );

  const data = respone.data;
  if (!data || data.status === 'ZERO_RESULTS') {
    const error = new HttpError(
      'could not find a location for this address',
      404
    );
    throw error;
  }
  console.log(data.results.geometry);
  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordsForAdress;
