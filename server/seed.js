
import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import User from './models/User.js';
import Consultation from './models/Consultation.js';
import PharmacyStock from './models/PharmacyStock.js';
import HealthRecord from './models/HealthRecord.js';

dotenv.config();

const seedData = async () => {
    try {
        fs.writeFileSync('seed_debug_new.log', 'Starting seed new...\n');
        const log = (msg) => {
            console.log(msg);
            fs.appendFileSync('seed_debug_new.log', msg + '\n');
        };

        await connectDB();
        log('🔌 Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Consultation.deleteMany({});
        await PharmacyStock.deleteMany({});
        await HealthRecord.deleteMany({});
        log('🧹 Cleared existing data');

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
        log('👨‍⚕️ Created 2 Doctors');

        // --- Create Patients ---
        log('Start creating patients...');
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
        log('🏥 Created 5 Patients');

        // --- Create Consultations ---
        const today = new Date();
        const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
        const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

        const consultations = await Consultation.create([
            // Today - Dr. Rajesh
            {
                patientId: patients[0]._id, // Rahul
                doctorId: doctors[0]._id,   // Rajesh
                scheduledDate: new Date(today.setHours(10, 0, 0, 0)),
                type: 'video',
                status: 'scheduled',
                symptoms: 'Bloating, High Loose Motion',
                roomId: `room_${Date.now()}_1`
            },
            {
                patientId: patients[1]._id, // Priya
                doctorId: doctors[0]._id,
                scheduledDate: new Date(today.setHours(11, 30, 0, 0)),
                type: 'clinic',
                status: 'confirmed',
                symptoms: 'Headache, Dizziness',
                roomId: `room_${Date.now()}_2`
            },

            // Today - Dr. Sarah
            {
                patientId: patients[2]._id, // Suresh
                doctorId: doctors[1]._id,   // Sarah
                scheduledDate: new Date(today.setHours(14, 0, 0, 0)),
                type: 'video',
                status: 'scheduled',
                symptoms: 'High Blood Sugar follow-up',
                roomId: `room_${Date.now()}_3`
            },

            // Tomorrow
            {
                patientId: patients[3]._id, // Anjali
                doctorId: doctors[0]._id,
                scheduledDate: new Date(tomorrow.setHours(9, 30, 0, 0)),
                type: 'video',
                status: 'scheduled',
                symptoms: 'Thyroid Checkup',
                roomId: `room_${Date.now()}_4`
            },

            // Completed/Past
            {
                patientId: patients[4]._id, // Vikram
                doctorId: doctors[1]._id,
                scheduledDate: yesterday,
                type: 'clinic',
                status: 'completed',
                symptoms: 'Knee Pain',
                roomId: `room_${Date.now()}_5`,
                prescription: [
                    { medication: 'Volini Gel', dosage: 'Apply twice', frequency: 'Daily', duration: '5 days', instructions: 'External use only' },
                    { medication: 'Combiflam', dosage: '400mg', frequency: 'SOS', duration: '3 days', instructions: 'After food' }
                ],
                notes: 'Patient advised physiotherapy.'
            }
        ]);
        log(`📅 Created ${consultations.length} Consultations`);

        // --- Create Pharmacy Stock ---
        const pharmacies = await PharmacyStock.create([
            {
                pharmacyId: 'PH001',
                pharmacyName: 'Apollo Pharmacy',
                location: {
                    address: 'Link Road, Andheri West',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    pincode: '400053',
                    coordinates: { lat: 19.1136, lng: 72.8697 }
                },
                medicines: [
                    { name: 'Dolo 650', category: 'Analgesic', manufacturer: 'Micro Labs', batchNumber: 'B123', expiryDate: new Date('2025-12-31'), quantity: 500, price: 30, unit: 'strip' },
                    { name: 'Azithromycin 500', category: 'Antibiotic', manufacturer: 'Cipla', batchNumber: 'A456', expiryDate: new Date('2025-06-30'), quantity: 100, price: 120, unit: 'strip' },
                    { name: 'Cetirizine', category: 'Antihistamine', manufacturer: 'Sun Pharma', batchNumber: 'C789', expiryDate: new Date('2026-01-01'), quantity: 300, price: 20, unit: 'strip' }
                ],
                contactInfo: { phone: '+912226345678', email: 'apollo.andheri@example.com', operatingHours: '24x7' }
            },
            {
                pharmacyId: 'PH002',
                pharmacyName: 'Wellness Forever',
                location: {
                    address: 'Connaught Place',
                    city: 'Delhi',
                    state: 'Delhi',
                    pincode: '110001',
                    coordinates: { lat: 28.6304, lng: 77.2177 }
                },
                medicines: [
                    { name: 'Combiflam', category: 'Analgesic', manufacturer: 'Sanofi', batchNumber: 'C999', expiryDate: new Date('2025-10-15'), quantity: 200, price: 45, unit: 'strip' },
                    { name: 'Pan 40', category: 'Antacid', manufacturer: 'Alkem', batchNumber: 'P888', expiryDate: new Date('2025-08-20'), quantity: 150, price: 110, unit: 'strip' }
                ],
                contactInfo: { phone: '+911123456789', email: 'wellness.cp@example.com', operatingHours: '8 AM - 11 PM' }
            }
        ]);
        log(`💊 Created ${pharmacies.length} Pharmacies`);



        // Helper to create date
        const getDate = (daysAgo) => {
            const d = new Date();
            d.setDate(d.getDate() - daysAgo);
            return d;
        };

        // --- Create Health Records ---
        log('DEBUG: Patients found: ' + patients.map(p => `${p.name} (${p._id})`).join(', '));

        const healthRecordPayload = [
            {
                userId: patients[4]._id, // Vikram
                consultationId: consultations[4]._id,
                records: [{
                    date: yesterday,
                    symptoms: ['Knee Pain'],
                    diagnosis: 'Mild Arthritis',
                    vitals: { bloodPressure: '130/85', heartRate: 78, temperature: 98.6, weight: 75, height: 175 },
                    medications: [{ name: 'Volini', dosage: 'Apply twice', frequency: 'Daily', duration: '5 days' }],
                    notes: 'Degenerative changes.'
                }]
            },
            {
                userId: patients[2]._id, // Suresh
                records: [{
                    date: getDate(30),
                    symptoms: ['Fatigue'],
                    diagnosis: 'Type 2 Diabetes',
                    vitals: { bloodPressure: '140/90', heartRate: 82, temperature: 98.4, weight: 85, height: 170 },
                    medications: [{ name: 'Metformin', dosage: '500mg', frequency: 'Twice Daily', duration: 'Ongoing' }],
                    notes: 'Dietary changes.'
                }]
            },
            {
                userId: patients[3]._id, // Anjali
                records: [
                    {
                        date: getDate(60),
                        diagnosis: 'Hypothyroidism',
                        symptoms: ['Fatigue'],
                        vitals: { bloodPressure: '120/80', weight: 65, temperature: 98.6, heartRate: 72 },
                        medications: [{ name: 'Thyronorm', dosage: '50mcg', frequency: 'Daily', duration: 'Ongoing' }],
                        notes: 'Initial diagnosis.'
                    },
                    {
                        date: getDate(2),
                        diagnosis: 'Routine Checkup',
                        symptoms: ['None'],
                        vitals: { bloodPressure: '115/75', weight: 62, temperature: 98.6, heartRate: 68 },
                        medications: [{ name: 'Thyronorm', dosage: '50mcg', frequency: 'Daily', duration: 'Ongoing' }],
                        notes: 'Patient feels energetic.'
                    }
                ]
            }
        ];
        log('DEBUG: Payload prepared for ' + healthRecordPayload.length + ' users.');

        const healthRecords = await HealthRecord.create(healthRecordPayload);
        log(`📋 Created ${healthRecords.length} Health Records`);
        log(JSON.stringify(healthRecords.map(h => h.userId), null, 2));

        fs.writeFileSync('seed_success.txt', 'Seeding completed at ' + new Date().toISOString());
        log('✅ Seeding Completed Successfully! Login details:');
        log('   Doctor: rajesh@niramya.com / password123');
        log('   Patient: rahul@example.com / password123');

        process.exit(0);
    } catch (error) {
        fs.writeFileSync('seed_error.txt', error.toString());
        console.error('❌ Seeding Error:', error);
        process.exit(1);
    }
};

seedData();
