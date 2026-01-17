
import express from 'express';
// import { GoogleGenerativeAI } from '@google/generative-ai'; // DISABLED: Module not found
import dotenv from 'dotenv';
import HealthRecord from '../models/HealthRecord.js';

dotenv.config();

const router = express.Router();

// --- REAL AI IMPLEMENTATION (Disabled) ---
const callGemini = async (type, content) => {
    /* 
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("No API Key found");
    }

    // Dynamic import to avoid crash if module is missing
    const { GoogleGenerativeAI } = await import('@google/generative-ai'); 
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // ... (System prompt logic) ...
    */
    throw new Error("Gemini library not installed.");
};

// --- MOCK FALLBACK (Simulation Mode) ---
const analyzeWithMockAI = (type, content) => {
    const lowerContent = content.toLowerCase();

    let result = {
        structuredData: {},
        patientSummary: "",
        riskFlags: [],
        disclaimer: "Disclaimer: This is an AI-generated analysis (Simulation Mode). Please consult a doctor for official diagnosis."
    };

    if (type === 'Lab Report') {
        if (lowerContent.includes('sugar') || lowerContent.includes('glucose')) {
            const isHigh = lowerContent.includes('300') || lowerContent.includes('high');
            result.structuredData = { "test": "Blood Glucose", "value": "300 mg/dL", "unit": "mg/dL" };
            result.patientSummary = "It looks like your blood sugar levels are significantly higher than the normal range. This can happen due to missed medication or a high-carb meal, but it needs attention. Taking steps now can help you feel better and stay safe.";
            if (isHigh) {
                result.riskFlags.push({ "severity": "CRITICAL", "condition": "Hyperglycemia", "action": "Immediate Medical Attention Required" });
            }
        } else if (lowerContent.includes('hemoglobin')) {
            result.structuredData = { "test": "Hemoglobin", "value": "10.5 g/dL" };
            result.patientSummary = "Your hemoglobin count is a bit low, which might be why you're feeling tired. Eating iron-rich foods like spinach or beans can help improvements.";
            result.riskFlags.push({ "severity": "MODERATE", "condition": "Mild Anemia", "action": "Dietary changes recommended" });
        }
    } else if (type === 'Prescription') {
        result.structuredData = { "medications": [{ "name": "Metformin", "dosage": "500mg" }] };
        result.patientSummary = "The doctor has prescribed medicines to help manage your diabetes and cholesterol. Regular intake is key to keeping your heart and energy levels healthy. Please make sure to take them after food as directed.";
    }

    if (!result.structuredData.test && !result.structuredData.medications) {
        result.patientSummary = "I received the data, but I couldn't identify specific medical markers. Please ensure the content mentions standard medical terms (e.g., 'Glucose', 'Hemoglobin').";
    }

    return result;
};

// --- TREND ANALYSIS MOCK ---
const analyzeTrendsMock = (records) => {
    if (!records || records.length < 2) {
        return {
            summary: "Not enough data to analyze trends. Please add at least two health records.",
            improvements: [],
            concerns: []
        };
    }

    // Sort by date ascending (oldest to newest)
    const sorted = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));
    const oldest = sorted[0];
    const newest = sorted[sorted.length - 1];

    let summary = "Based on your recent records, we have analyzed your health progression.";
    let improvements = [];
    let concerns = [];

    // Blood Pressure Logic
    if (oldest.vitals?.bloodPressure && newest.vitals?.bloodPressure) {
        const parseBP = (bp) => parseInt(bp.split('/')[0]); // Systolic
        const oldSys = parseBP(oldest.vitals.bloodPressure);
        const newSys = parseBP(newest.vitals.bloodPressure);

        if (oldSys > 140 && newSys < 130) {
            improvements.push("Blood Pressure has significantly improved from unhealthy levels.");
        } else if (newSys < oldSys) {
            improvements.push("Blood Pressure is trending downwards (Improvement).");
        } else if (newSys > oldSys) {
            concerns.push("Blood Pressure has increased slightly.");
        }
    }

    // Weight Logic
    if (oldest.vitals?.weight && newest.vitals?.weight) {
        const diff = oldest.vitals.weight - newest.vitals.weight;
        if (Math.abs(diff) > 1) {
            summary += ` You have ${diff > 0 ? 'lost' : 'gained'} ${Math.abs(diff)} kg.`;
        }
    }

    // General Logic
    improvements.push("Consistent record keeping is key to better health!");

    return { summary, improvements, concerns };
};


router.post('/analyze', async (req, res) => {
    // ... existing analyze logic ...
    try {
        const { type, content } = req.body;
        // ...
        // Re-implementing existing block for context match
        if (!type || !content) return res.status(400).json({ message: "Missing type or content" });

        console.log(`🧠 AI Engine processing: ${type}`);
        // Fallback to Mock
        const analysis = analyzeWithMockAI(type, content);
        setTimeout(() => res.json(analysis), 1500);

    } catch (error) {
        res.status(500).json({ message: "Internal Processing Error" });
    }
});

// NEW: Trend Analysis Route
router.post('/analyze-trends', async (req, res) => {
    try {
        let { records, userId } = req.body;

        // Fetch from DB if userId provided
        if (userId && (!records || records.length === 0)) {
            console.log(`Fetching records for user: ${userId}`);
            const healthData = await HealthRecord.findOne({ userId });
            if (healthData && healthData.records) {
                records = healthData.records;
            }
        }

        console.log("📈 Analyzing Trends for records:", records?.length);

        if (!records || records.length === 0) {
            return res.json({
                summary: "No health records found to analyze.",
                improvements: [],
                concerns: []
            });
        }

        // Simulate AI Processing Delay
        setTimeout(() => {
            const analysis = analyzeTrendsMock(records);
            res.json(analysis);
        }, 2000);

    } catch (error) {
        console.error("Trend Analysis Failed:", error);
        res.status(500).json({ message: "Analysis Failed" });
    }
});

export default router;
