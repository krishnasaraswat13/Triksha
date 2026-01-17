<h1 align="center"> 🩺 Triksha – Unified Healthcare Platform </h1>
<h3 align="center"> AI-Powered Healthcare For Everyone </h3>

<pre>
> - **Multi-language AI Health Agent** (Voice & Text)
> - **Smart Symptom Checking** (Online & Offline)
> - **Unified Health Records**
> - **Tele-consultation**
</pre>

---

## 🏥 Problem Statement
- **Language Barriers:** Mainstream apps often only support English, limiting access for millions.
- **Connectivity:** Rural areas suffer from poor internet, making cloud-only AI unreliable.
- **Complexity:** Complex interfaces deter elderly and low-literacy users.

---

## 💡 Our Solution – *Triksha*
**Triksha** is a comprehensive healthcare platform designed for inclusivity. It bridges the gap between technology and the common person through:

- ✅ **Vernacular AI Chatbot** → Speaks and understands 9+ Indian languages (Hindi, Bengali, Tamil, Telugu, etc.).
- ✅ **Offline-First Intelligence** → Built-in medical knowledge base handles common symptom queries even without internet/API keys.
- ✅ **Voice Assistant** → Just speak to the app! Perfect for users who prefer talking over typing.
- ✅ **Unified Dashboard** → Connects Patients, Doctors, and Labs in one ecosystem.

---

## ✨ Key Features

### 🤖 Intelligent Health Agent
- **Voice-Enabled:** Uses Web Speech API for real-time Speech-to-Text and Text-to-Speech.
- **Multi-lingual:** Seamlessly switch between English, Hindi, Bengali, Marathi, Gujarati, Tamil, Telugu, Kannada, and Malayalam.
- **Context-Aware:** Remembers valid sessions and provides localized responses.
- **Hybrid AI:** 
    - *Online:* Uses Google Gemini for deep, generative medical advice.
    - *Offline:* Fallback knowledge base for instant answers to common symptoms (Fever, Back pain, BP, etc.).

### ⚕️ Patient Care
- **Tele-consultation:** High-quality video/audio calls with doctors.
- **Health Records:** Secure storage for prescriptions and reports.
- **Symptom Checker:** Instant analysis of symptoms with urgency estimation.

---

## ⚙️ Tech Stack

### 🔹 Frontend
- **React + TypeScript** 
- **Tailwind CSS** (Modern, responsive styling)
- **Web Speech API** (Native Voice Support)
- **Lucide React** (Icons)

### 🔹 Backend
- **Node.js + Express**
- **MongoDB** (Data Storage)
- **Google Gemini AI** (Generative Model)
- **JWT** (Secure Authentication)

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js >= 18
- MongoDB (Local or Atlas)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd Triksha
   ```

2. **Install Dependencies**
   ```bash
   # Install root/frontend dependencies
   npm install

   # Install backend dependencies
   cd server
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/niramya
   JWT_SECRET=your_super_secret_key
   GEMINI_API_KEY=your_google_gemini_key  # Optional: For advanced AI
   ```

4. **Run the Application**
   ```bash
   # From the project root (runs both Frontend and Backend)
   npm run dev
   ```

   - **Frontend:** http://localhost:5173
   - **Backend:** http://localhost:5000

---

## 📂 Project Structure

```
Triksha/
│── src/                  # Frontend Source
│   ├── components/       # ChatWidget.tsx, Navbar.tsx
│   ├── pages/            # Dashboard, Consultation
│   └── context/          # Theme & Auth Context
│
│── server/               # Backend API
│   ├── routes/           # chatbot.js, users.js
│   ├── models/           # Mongoose Models
│   └── index.js          # App Entry Point
```

---

*Powered by Triksha AI*
