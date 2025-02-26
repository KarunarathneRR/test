// models/Node.js
const mongoose = require('mongoose');

// Define Node Schema
const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
});

// Create Node model from the schema
const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
