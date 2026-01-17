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
    console.log("Using Mock AI (No GEMINI_API_KEY) - Enhanced Logic");

    // Expanded Medical Knowledge Base for Demo/Offline Mode
    const medicalKnowledgeBase = {
      'back': {
        keywords: ['back', 'spine', 'number', 'lumber'],
        responses: {
          'en': "For lower back pain radiating to the leg (Sciatica), possible causes include herniated disc or muscle strain. \n\n**Action Plan:**\n1. Rest and avoid heavy lifting.\n2. Apply hot/cold packs.\n3. Consult an Orthopedist or Neurologist for an MRI if pain persists.",
          'hi': "निचले हिस्से में दर्द (Sciatica) के लिए, संभावित कारणों में हर्नियाटेड डिस्क या मांसपेशियों में खिंचाव शामिल हो सकता है। \n\n**कार्य योजना:**\n1. आराम करें और भारी वजन उठाने से बचें।\n2. गर्म/ठंडे पैक लगाएं।\n3. यदि दर्द ठीक नहीं होता है, तो आर्थोपेडिस्ट से सलाह लें।",
          // Fallback for others to English regarding context, can be expanded
          'default': "Back pain generally requires rest. Please consult a specialist."
        }
      },
      'fever': {
        keywords: ['fever', 'temperature', 'hot', 'cold'],
        responses: {
          'en': "For fever:\n1. Stay hydrated.\n2. Rest adequately.\n3. Take paracetamol if temp > 100°F (Consult doctor for dosage).\n4. Seek immediate care if accompanied by breathing difficulty.",
          'hi': "बुखार के लिए:\n1. हाइड्रेटेड रहें।\n2. पर्याप्त आराम करें।\n3. यदि तापमान 100°F से अधिक है तो पैरासिटामोल लें (खुराक के लिए डॉक्टर से पूछें)।"
        }
      },
      'headache': {
        keywords: ['headache', 'migraine', 'head'],
        responses: {
          'en': "Headache management:\n1. Drink water (dehydration is a common cause).\n2. Rest in a dark, quiet room.\n3. Check blood pressure.\n4. Consult a doctor if it's severe or sudden.",
          'hi': "सिरदर्द प्रबंधन:\n1. पानी पिएं (निर्जलीकरण एक सामान्य कारण है)।\n2. अंधेरे, शांत कमरे में आराम करें।\n3. रक्तचाप की जाँच करें।"
        }
      },
      'bp': {
        keywords: ['bp', 'blood pressure', 'hypertension'],
        responses: {
          'en': "Blood Pressure requires regular monitoring. Reduce salt intake, exercise regularly, and take prescribed medication. Normal range is typically around 120/80 mmHg.",
          'hi': "रक्तचाप की नियमित निगरानी की आवश्यकता होती है। नमक का सेवन कम करें, नियमित व्यायाम करें।"
        }
      }
    };

    const langCode = language.split('-')[0];
    let responseText = "";

    // Check Knowledge Base
    const lowerQuery = symptoms.toLowerCase();
    for (const [key, data] of Object.entries(medicalKnowledgeBase)) {
      if (data.keywords.some(k => lowerQuery.includes(k))) {
        responseText = data.responses[langCode] || data.responses['en'] || data.responses['default'];
        break;
      }
    }

    // Default Fallbacks if no keyword matched
    if (!responseText) {
      if (lowerQuery.includes('last') || lowerQuery.includes('report') || lowerQuery.includes('record')) {
        if (userRecords.length > 0) {
          const last = userRecords[userRecords.length - 1];
          responseText = `Based on your last record from ${new Date(last.date).toLocaleDateString()}, your diagnosis was ${last.diagnosis}.`;
        } else {
          if (langCode === 'hi') responseText = "मैंने आपके रिकॉर्ड की जाँच की, लेकिन मुझे कोई हालिया डेटा नहीं मिला।";
          else responseText = "I checked your records, but I couldn't find any recent data to answer that.";
        }
      } else {
        const genericFallbacks = {
          'en': "I understand you're concerned. While I can't provide a specific diagnosis right now, I recommend consulting a General Physician for a thorough checkup.",
          'hi': "मैं समझता हूँ कि आप चिंतित हैं। मैं अभी विशिष्ट निदान प्रदान नहीं कर सकता, लेकिन मैं आपको सामान्य चिकित्सक से परामर्श करने की सलाह देता हूँ。",
          'bn': "আমি বুঝতে পারছি আপনি চিন্তিত। আমি এখন নির্দিষ্ট রোগ নির্ণয় করতে পারছি না, তবে আমি আপনাকে একজন সাধারণ চিকিৎসকের সাথে পরামর্শ করার পরামর্শ দিচ্ছি।",
          'te': "మీరు ఆందోళన చెందుతున్నారని నాకు అర్థమైంది. నేను ఇప్పుడు నిర్దిష్ట రోగ నిర్ధారణను అందించలేను, దయచేసి డాక్టర్‌ని సంప్రదించండి.",
          'ta': "நீங்கள் கவலைப்படுகிறீர்கள் என்பதை நான் புரிந்துகொள்கிறேன். தயவுசெய்து மருத்துவரை அணுகவும்.",
          'ml': "നിങ്ങൾ ആശങ്കാകുലരാണെന്ന് എനിക്കറിയാം. ദയവായി ഒരു ഡോക്ടറെ സമീപിക്കുക."
        };
        responseText = genericFallbacks[langCode] || genericFallbacks['en'];
      }
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