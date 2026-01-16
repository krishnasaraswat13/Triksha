
import express from 'express';
import User from '../models/User.js';
import Consultation from '../models/Consultation.js';
import fs from 'fs';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        console.log('🌱 Seeding database...');
        // Clear existing data
        await User.deleteMany({});
        await Consultation.deleteMany({});

        // --- Create Doctors ---
        const doctors = await User.create([
            {
                name: 'Dr. Rajesh Koothrappali',
                email: 'rajesh@niramya.com',
                password: 'password123',
                role: 'doctor',
                phone: '+919876543210',
                profile: { age: 32, gender: 'Male', address: 'Mumbai, India', emergencyContact: '+919998887770' }
            },
            {
                name: 'Dr. Sarah Bennett',
                email: 'sarah@niramya.com',
                password: 'password123',
                role: 'doctor',
                phone: '+919876543211',
                profile: { age: 40, gender: 'Female', address: 'Delhi, India', emergencyContact: '+919998887771' }
            }
        ]);

        // --- Create Patients ---
        const patients = await User.create([
            {
                name: 'Rahul Sharma',
                email: 'rahul@example.com',
                password: 'password123',
                role: 'patient',
                phone: '+919876540001',
                isConnected: true,
                profile: {
                    age: 28,
                    gender: 'Male',
                    address: 'Pune, MH',
                    emergencyContact: '+918888888888',
                    bloodGroup: 'O+',
                    allergies: ['Peanuts', 'Penicillin'],
                    chronicConditions: ['Asthma']
                }
            },
            {
                name: 'Priya Patel',
                email: 'priya@example.com',
                password: 'password123',
                role: 'patient',
                phone: '+919876540002',
                isConnected: true,
                profile: {
                    age: 34,
                    gender: 'Female',
                    address: 'Ahmedabad, GJ',
                    bloodGroup: 'B+',
                    allergies: ['None'],
                    chronicConditions: ['Migraine', 'Hypertension']
                }
            },
            {
                name: 'Suresh Raina',
                email: 'suresh@example.com',
                password: 'password123',
                role: 'patient',
                phone: '+919876540003',
                isConnected: true,
                profile: {
                    age: 45,
                    gender: 'Male',
                    address: 'Chennai, TN',
                    bloodGroup: 'AB-',
                    allergies: ['Dust'],
                    chronicConditions: ['Diabetes Type 2']
                }
            },
            {
                name: 'Anjali Gupta',
                email: 'anjali@example.com',
                password: 'password123',
                role: 'patient',
                phone: '+919876540004',
                isConnected: true,
                profile: {
                    age: 29,
                    gender: 'Female',
                    address: 'Bangalore, KA',
                    bloodGroup: 'A+',
                    allergies: ['None'],
                    chronicConditions: ['Thyroid']
                }
            },
            {
                name: 'Vikram Singh',
                email: 'vikram@example.com',
                password: 'password123',
                role: 'patient',
                phone: '+919876540005',
                isConnected: true,
                profile: {
                    age: 52,
                    gender: 'Male',
                    address: 'Jaipur, RJ',
                    bloodGroup: 'O-',
                    allergies: ['Shellfish'],
                    chronicConditions: ['None']
                }
            }
        ]);

        // --- Create Consultations ---
        const today = new Date();
        const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
        const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

        const consultations = await Consultation.create([
            {
                patientId: patients[0]._id, // Rahul
                doctorId: doctors[0]._id,   // Rajesh
                scheduledDate: new Date(today.setHours(10, 0, 0, 0)),
                type: 'video',
                status: 'scheduled',
                symptoms: ['Fever', 'Cough'],
                roomId: `room_${Date.now()}_1`
            },
            {
                patientId: patients[1]._id, // Priya
                doctorId: doctors[0]._id,
                scheduledDate: new Date(today.setHours(11, 30, 0, 0)),
                type: 'clinic',
                status: 'confirmed',
                symptoms: ['Headache', 'Dizziness'],
                roomId: `room_${Date.now()}_2`
            },
            {
                patientId: patients[2]._id, // Suresh
                doctorId: doctors[1]._id,   // Sarah
                scheduledDate: new Date(today.setHours(14, 0, 0, 0)),
                type: 'video',
                status: 'scheduled',
                symptoms: ['High Blood Sugar'],
                roomId: `room_${Date.now()}_3`
            },
            {
                patientId: patients[3]._id, // Anjali
                doctorId: doctors[0]._id,
                scheduledDate: new Date(tomorrow.setHours(9, 30, 0, 0)),
                type: 'video',
                status: 'scheduled',
                symptoms: ['Thyroid Checkup'],
                roomId: `room_${Date.now()}_4`
            },
            {
                patientId: patients[4]._id, // Vikram
                doctorId: doctors[1]._id,
                scheduledDate: yesterday,
                type: 'clinic',
                status: 'completed',
                symptoms: ['Knee Pain'],
                roomId: `room_${Date.now()}_5`,
                prescription: [
                    { medication: 'Volini Gel', dosage: 'Apply twice', frequency: 'Daily', duration: '5 days', instructions: 'External use only' },
                    { medication: 'Combiflam', dosage: '400mg', frequency: 'SOS', duration: '3 days', instructions: 'After food' }
                ],
                notes: 'Patient advised physiotherapy.'
            }
        ]);

        res.json({
            message: 'Database seeded successfully',
            doctors: doctors.length,
            patients: patients.length,
            consultations: consultations.length
        });


        // ... (inside route)
    } catch (error) {
        console.error('Seeding error:', error);
        fs.writeFileSync('seed_api_error.txt', error.toString());
        res.status(500).json({ message: error.message });
    }
});

export default router;
