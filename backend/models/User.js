const mongoose = require('mongoose');

// Define the Node Schema
const sampleuserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true, 
    },
    password: {
        type: String,
        required: true, 
    },
    });

// Create and export the Node model
const sampleuser = mongoose.model('sampleuser', sampleuserSchema);

module.exports = sampleuser;