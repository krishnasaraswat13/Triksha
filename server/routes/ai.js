
import express from 'express';
// import { GoogleGenerativeAI } from '@google/generative-ai'; // DISABLED: Module not found
import dotenv from 'dotenv';

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

router.post('/analyze', async (req, res) => {
    try {
        const { type, content } = req.body;
        if (!type || !content) return res.status(400).json({ message: "Missing type or content" });

        console.log(`🧠 AI Engine processing: ${type}`);

        try {
            // Attempt Real AI (Disabled for now)
            // const analysis = await callGemini(type, content);
            // console.log("✅ Gemini Success");
            // res.json(analysis);
            throw new Error("Module Disabled");
        } catch (aiError) {
            // Fallback to Mock
            console.warn("⚠️ Gemini failed/missing. Using Mock.");
            const analysis = analyzeWithMockAI(type, content);
            // Artificial delay for realism
            setTimeout(() => res.json(analysis), 1500);
        }

    } catch (error) {
        console.error("AI Route Critical Failure:", error);
        res.status(500).json({ message: "Internal Processing Error" });
    }
});

export default router;
