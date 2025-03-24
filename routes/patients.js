const express = require('express');
const router = express.Router();
const db = require('../config/database');
const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

// Send OTP
router.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    const otp = generateOTP();

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'OTP Verification',
            text: `Your OTP for patient registration is: ${otp}`
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, message: 'Error sending OTP' });
    }
});

// Get single patient
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [patients] = await db.execute(
            'SELECT * FROM patients WHERE id = ?',
            [id]
        );

        if (patients.length > 0) {
            res.json({ success: true, patient: patients[0] });
        } else {
            res.status(404).json({ success: false, message: 'Patient not found' });
        }
    } catch (error) {
        console.error('Error fetching patient:', error);
        res.status(500).json({ success: false, message: 'Error fetching patient' });
    }
});

// Register patient
router.post('/register', async (req, res) => {
    const { name, age, dob, city, gender, mobile, email } = req.body;

    try {
        // Validate required fields
        if (!name || !age || !dob || !city || !gender || !mobile || !email) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email format' 
            });
        }

        // Validate mobile number format
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobile)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid mobile number format' 
            });
        }

        // Check if email already exists
        const [existingPatients] = await db.execute(
            'SELECT id FROM patients WHERE email = ?',
            [email]
        );

        if (existingPatients.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already registered' 
            });
        }

        // Insert new patient
        const [result] = await db.execute(
            'INSERT INTO patients (name, age, dob, city, gender, mobile, email) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, age, dob, city, gender, mobile, email]
        );

        if (result.affectedRows > 0) {
            res.json({ 
                success: true, 
                message: 'Patient registered successfully',
                patientId: result.insertId
            });
        } else {
            throw new Error('Failed to insert patient');
        }
    } catch (error) {
        console.error('Error registering patient:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error registering patient',
            error: error.message 
        });
    }
});

// Get all patients
router.get('/', async (req, res) => {
    try {
        const [patients] = await db.execute('SELECT * FROM patients');
        res.json({ success: true, patients });
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ success: false, message: 'Error fetching patients' });
    }
});

// Update patient
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, age, dob, city, gender, mobile, email } = req.body;

    try {
        // Validate required fields
        if (!name || !age || !dob || !city || !gender || !mobile || !email) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email format' 
            });
        }

        // Validate mobile number format
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobile)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid mobile number format' 
            });
        }

        // Check if email exists for other patients
        const [existingPatients] = await db.execute(
            'SELECT id FROM patients WHERE email = ? AND id != ?',
            [email, id]
        );

        if (existingPatients.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already registered for another patient' 
            });
        }

        // Update patient
        const [result] = await db.execute(
            'UPDATE patients SET name = ?, age = ?, dob = ?, city = ?, gender = ?, mobile = ?, email = ? WHERE id = ?',
            [name, age, dob, city, gender, mobile, email, id]
        );

        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'Patient updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Patient not found' });
        }
    } catch (error) {
        console.error('Error updating patient:', error);
        res.status(500).json({ success: false, message: 'Error updating patient' });
    }
});

// Delete patient
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.execute('DELETE FROM patients WHERE id = ?', [id]);
        
        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'Patient deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Patient not found' });
        }
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({ success: false, message: 'Error deleting patient' });
    }
});

module.exports = router; 