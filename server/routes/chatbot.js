import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import HealthRecord from '../models/HealthRecord.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// AI chatbot endpoint with RAG (Retrieval Augmented Generation)
router.post('/symptom-check', async (req, res) => {
  try {
    const { symptoms, language = 'en' } = req.body;
    let contextData = "No health records available.";

    // 1. Fetch User Context (RAG)
    // We need the user ID. We'll try to get it from the request if authenticated
    // For this to work, the frontend MUST send the token.
    // If not authenticated, we proceed without personal context.

    // Manually check token here since we don't want to block unauthenticated general queries entirely
    // But for "my report", auth is needed.
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      // We'll rely on the authenticateToken middleware logic effectively by importing it or mimicking it, 
      // but for now, let's assume if we are building a properly secured route we should just use the middleware.
      // However, to avoid breaking existing un-authed flows (if any), we'll do a soft check or just proceed.
      // Let's rely on the fact that we'll add `authenticateToken` to the route in the future or handle decoding here.
      // For simplicity in this "fix", I'll decode if possible or just use a mock if we can't get the user.

      // Actually, let's just use the `authenticateToken` middleware on the route in the main app.
      // But since I can't easily change the main app mounting without restarting, I'll decoding it here if I imported jwt.
      // SIMPLIFICATION: I will just use a robust prompt that handles "no data".
    }

    // Getting health records requires the user. 
    // Let's assume the user is passed via middleware if I add it to the router in `index.js`, 
    // OR we can decode it here.
    // Since `index.js` mounts this at `/api/chatbot`, let's try to get the user from the verified token.
    // I'll use a dynamic import for jwt to avoid top-level issues if not needed.
    let userRecords = [];
    if (token) {
      try {
        const jwt = (await import('jsonwebtoken')).default;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const healthData = await HealthRecord.findOne({ userId: decoded.userId });
        if (healthData && healthData.records) {
          userRecords = healthData.records;
          contextData = JSON.stringify(userRecords.slice(-5)); // Last 5 records
        }
      } catch (e) {
        console.log("Chatbot Auth check failed:", e.message);
      }
    }

    // 2. Call Gemini
    if (process.env.GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `
        Act as a polite and helpful medical AI assistant named "Triksha Health Agent".
        
        Context Data (User's Recent Health Records):
        ${contextData}
        
        User Query: "${symptoms}"
        
        Instructions:
        1. Answer the user's query based strictly on the provided Health Records if they ask about their history (e.g., "what was my last bp?").
        2. If the query is a general symptom check, provide general medical advice suitable for a first-aid/home-remedy context, but ALWAYS advise consulting a doctor.
        3. Keep the response concise (under 100 words) and comforting.
        4. If the health records are empty and the user asks about them, politely say you don't have access to that data yet.
        `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return res.json({
        response: text,
        recommendation: "Consult a doctor for precise diagnosis.",
        urgency: "low"
      });
    }

    // 3. Fallback Mock (If no API key)
    console.log("Using Mock AI (No GEMINI_API_KEY)");
    let responseText = "I understand you're feeling unwell. Please consult a doctor.";

    // Simple Mock RAG Logic
    const lowerQuery = symptoms.toLowerCase();
    if (lowerQuery.includes('last') || lowerQuery.includes('report') || lowerQuery.includes('record')) {
      if (userRecords.length > 0) {
        const last = userRecords[userRecords.length - 1];
        responseText = `Based on your last record from ${new Date(last.date).toLocaleDateString()}, your diagnosis was ${last.diagnosis} with blood pressure ${last.vitals?.bloodPressure || 'not recorded'}.`;
      } else {
        responseText = "I checked your records, but I couldn't find any recent data to answer that.";
      }
    } else if (lowerQuery.includes('fever')) {
      responseText = "For fever, stay hydrated and rest. If it exceeds 101°F, see a doctor.";
    }

    res.json({
      response: responseText,
      recommendation: "Please consult a General Physician.",
      urgency: "low"
    });

  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ message: "I'm having trouble thinking right now. Please try again." });
  }
});

export default router;