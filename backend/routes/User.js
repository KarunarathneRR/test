const express = require('express');
const router = express.Router();
const sampleuser = require('../models/User'); // Adjust path as needed
const bcrypt = require('bcrypt');

// POST method: Check if username and password are 'admin'
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are 'admin'
    if (username === 'admin' && password === 'admin') {
        return res.status(200).json({ message: 'Username and password are correct' });
    } else {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
});

module.exports = router;
