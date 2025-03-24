const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Simple validation for admin credentials
    if (username === 'admin' && password === 'admin@123') {
        req.session.isAuthenticated = true;
        req.session.user = { username: 'admin' };
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error logging out' });
        } else {
            res.json({ success: true, message: 'Logged out successfully' });
        }
    });
});

// Check authentication status
router.get('/check-auth', (req, res) => {
    if (req.session.isAuthenticated) {
        res.json({ isAuthenticated: true });
    } else {
        res.json({ isAuthenticated: false });
    }
});

module.exports = router; 