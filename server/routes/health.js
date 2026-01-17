import express from 'express';
import HealthRecord from '../models/HealthRecord.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all health records for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
    try {
        // Find record document for this user (each user has one main HealthRecord doc with an array of records)
        // OR create one if it doesn't exist
        console.log(`[DEBUG] Fetching health records for user: ${req.user._id}`);
        let healthData = await HealthRecord.findOne({ userId: req.user._id });
        console.log(`[DEBUG] Found healthData: ${healthData ? 'Yes' : 'No'}, Records count: ${healthData?.records?.length}`);

        if (!healthData) {
            return res.json([]);
        }

        // Return the array of records sorted by date (newest first)
        const sortedRecords = healthData.records.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json(sortedRecords);
    } catch (error) {
        console.error('Error fetching health records:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a new health record manually (or via doctor)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { diagnosis, symptoms, vitals, notes, medications, date } = req.body;

        let healthData = await HealthRecord.findOne({ userId: req.user._id });

        if (!healthData) {
            healthData = new HealthRecord({ userId: req.user._id, records: [] });
        }

        const newRecord = {
            date: date || new Date(),
            diagnosis,
            symptoms,
            vitals,
            notes,
            medications
        };

        healthData.records.push(newRecord);
        await healthData.save();

        res.status(201).json(newRecord);
    } catch (error) {
        console.error('Error adding health record:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
