
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import User from './models/User.js';
import HealthRecord from './models/HealthRecord.js';

dotenv.config();

const seedHistory = async () => {
    try {
        await connectDB();
        console.log('🔌 Connected to MongoDB');

        // 1. Find Targets: Rahul (Demo User) and the most recent User (likely the one the dev is testing with)
        const rahul = await User.findOne({ email: 'rahul@example.com' });
        const latestUser = await User.findOne({ role: 'patient' }).sort({ createdAt: -1 });

        const targets = [];
        if (rahul) targets.push(rahul);
        if (latestUser && (!rahul || latestUser._id.toString() !== rahul._id.toString())) {
            targets.push(latestUser);
        }

        if (targets.length === 0) {
            console.log('⚠️ No patients found to seed data for.');
            process.exit(0);
        }

        console.log(`🎯 Seeding data for ${targets.length} users: ${targets.map(u => u.name).join(', ')}`);

        for (const user of targets) {
            // Delete existing records to avoid duplicates/clutter for this mock run
            await HealthRecord.deleteMany({ userId: user._id });

            // Generate dates
            const today = new Date();
            const oneMonthAgo = new Date(today); oneMonthAgo.setMonth(today.getMonth() - 1);
            const threeMonthsAgo = new Date(today); threeMonthsAgo.setMonth(today.getMonth() - 3);
            const sixMonthsAgo = new Date(today); sixMonthsAgo.setMonth(today.getMonth() - 6);

            const records = [
                {
                    userId: user._id,
                    records: [{
                        date: sixMonthsAgo,
                        diagnosis: 'Hypertension Catch-up',
                        symptoms: ['Headache', 'Dizziness'],
                        vitals: { bloodPressure: '150/95', heartRate: 88, temperature: 98.6, weight: 85 },
                        notes: 'Initial checkup. BP is high. Recommended dietary changes.'
                    }]
                },
                {
                    userId: user._id,
                    records: [{
                        date: threeMonthsAgo,
                        diagnosis: 'Regular Follow-up',
                        symptoms: ['Mild Headache'],
                        vitals: { bloodPressure: '140/90', heartRate: 82, temperature: 98.4, weight: 83 }, // Weight dropped 2kg
                        notes: 'BP slightly better but still high. Started medication.'
                    }]
                },
                {
                    userId: user._id,
                    records: [{
                        date: oneMonthAgo,
                        diagnosis: 'Monthly Checkup',
                        symptoms: ['None'],
                        vitals: { bloodPressure: '130/85', heartRate: 78, temperature: 98.2, weight: 80 }, // Weight dropped 3kg
                        notes: 'Significant improvement. Continue same medication.'
                    }]
                },
                {
                    userId: user._id,
                    records: [{
                        date: today,
                        diagnosis: 'Routine Check & Viral Fever',
                        symptoms: ['Fever', 'Body Aches'],
                        vitals: { bloodPressure: '122/81', heartRate: 95, temperature: 101.2, weight: 79 },
                        notes: 'BP is now under control. Treating current viral fever.'
                    }]
                }
            ];

            await HealthRecord.insertMany(records);
            console.log(`✅ Added 4 health records for ${user.name}`);
        }

        console.log('🎉 Health history seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding history:', error);
        process.exit(1);
    }
};

seedHistory();
