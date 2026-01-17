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
        Target Language: ${language}
        
        Instructions:
        1. Answer the user's query in the Target Language specified above (${language}).
        2. Answer based strictly on the provided Health Records if they ask about their history (e.g., "what was my last bp?").
        3. If the query is a general symptom check, provide general medical advice suitable for a first-aid/home-remedy context, but ALWAYS advise consulting a doctor.
        4. Keep the response concise (under 100 words) and comforting.
        5. If the health records are empty and the user asks about them, politely say you don't have access to that data yet in the target language.
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

    const fallbackResponses = {
      'en': "I understand you're feeling unwell. Please consult a doctor.",
      'hi': "मैं समझता हूँ कि आप अस्वस्थ महसूस कर रहे हैं। कृपया डॉक्टर से सलाह लें।",
      'bn': "আমি বুঝতে পারছি আপনি অসুস্থ বোধ করছেন। দয়া করে একজন ডাক্তারের সাথে পরামর্শ করুন।",
      'te': "మీరు అనారోగ్యంతో ఉన్నారని నాకు అర్థమైంది. దయచేసి డాక్టర్‌ని సంప్రదించండి.",
      'ta': "நீங்கள் உடல்நிலை சரியில்லாமல் இருப்பதை நான் புரிந்துகொள்கிறேன். தயவுசெய்து மருத்துவரை அணுகவும்.",
      'mr': "मला समजले आहे की तुम्हाला बरे वाटत नाहीये. कृपया डॉक्टरांचा सल्ला घ्या.",
      'gu': "હું સમજું છું કે તમે અસ્વસ્થ અનુભવો છો. મહેરબાની કરીને ડૉક્ટરની સલાહ લો.",
      'kn': "ನೀವು ಅನಾರೋಗ್ಯದಿಂದ ಬಳಲುತ್ತಿದ್ದೀರಿ ಎಂದು ನನಗೆ ಅರ್ಥವಾಗಿದೆ. ದಯವಿಟ್ಟು ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
      'ml': "നിങ്ങൾക്ക് സുഖമില്ലെന്ന് എനിക്ക് മനസ്സിലായി. ദയাকರಿ ഒരു ഡോക്ടറെ സമീപിക്കുക."
    };

    // Extract basic language code (e.g., 'hi-IN' -> 'hi')
    const langCode = language.split('-')[0];
    let responseText = fallbackResponses[langCode] || fallbackResponses['en'];

    // Simple Mock RAG Logic (Only supports English keywords for now for simplicity, or basic exact match)
    const lowerQuery = symptoms.toLowerCase();
    if (lowerQuery.includes('last') || lowerQuery.includes('report') || lowerQuery.includes('record')) {
      // Mock RAG response is hard to localize without a huge map, updating just the not found message
      if (userRecords.length > 0) {
        const last = userRecords[userRecords.length - 1];
        responseText = `Based on your last record from ${new Date(last.date).toLocaleDateString()}, your diagnosis was ${last.diagnosis} with blood pressure ${last.vitals?.bloodPressure || 'not recorded'}.`;
      } else {
        if (langCode === 'hi') responseText = "मैंने आपके रिकॉर्ड की जाँच की, लेकिन मुझे कोई हालिया डेटा नहीं मिला।";
        else responseText = "I checked your records, but I couldn't find any recent data to answer that.";
      }
    } else if (lowerQuery.includes('fever')) {
      if (langCode === 'hi') responseText = "बुखार के लिए, हाइड्रेटेड रहें और आराम करें। यदि यह 101°F से अधिक है, तो डॉक्टर को दिखाएं।";
      else responseText = "For fever, stay hydrated and rest. If it exceeds 101°F, see a doctor.";
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