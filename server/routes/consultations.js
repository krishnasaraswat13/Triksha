import express from 'express';
import Consultation from '../models/Consultation.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all consultations for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const consultations = await Consultation.find({
      $or: [
        { patientId: req.user._id },
        { doctorId: req.user._id }
      ]
    }).populate('patientId doctorId', 'name phone email profile bloodGroup allergies chronicConditions');

    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Book a consultation
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { doctorId, scheduledDate, symptoms, type } = req.body;

    const consultation = new Consultation({
      patientId: req.user._id,
      doctorId,
      scheduledDate,
      symptoms,
      type,
      roomId: `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

    await consultation.save();

    res.status(201).json({
      message: 'Consultation booked successfully',
      consultation
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Update consultation status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    // specific checks can be added here, e.g., only doctor can update status
    // if (req.user.role !== 'doctor') return res.status(403).json({ message: 'Unauthorized' });

    consultation.status = status;
    await consultation.save();

    res.json({ message: 'Status updated successfully', consultation });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});




// Add prescription to consultation
router.post('/:id/prescription', authenticateToken, async (req, res) => {
  try {
    const { prescription, notes } = req.body;
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    if (prescription) {
      // If it's an array of medications
      if (Array.isArray(prescription)) {
        consultation.prescription.push(...prescription);
      } else {
        consultation.prescription.push(prescription);
      }
    }

    if (notes) {
      consultation.notes = notes;
    }

    await consultation.save();

    res.json({ message: 'Prescription added successfully', consultation });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;