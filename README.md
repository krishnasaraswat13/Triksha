<h1 align="center"> 🩺 Niramya – Free From Illness </h1>
<h3 align="center"> Smart India Hackathon (SIH) Project </h3>
<pre>
> - **AI-driven symptom checking**  
> - **Tele-consultation with doctors**  
> - **Voice-enabled chatbot** for low-literacy users  
> - **Low-bandwidth optimization** for rural connectivity  
</pre>
---

## 🏥 Problem Statement
- Rural areas in India have **limited access to doctors and hospitals**.  
- People with **low literacy struggle with text-heavy apps**.  
-# Triksha Telemedicine Platformpps require **high bandwidth and strong internet**.  
- Early symptom detection and quick consultation can prevent **serious health issues**.  

---

## 💡 Our Solution – *Niramya*
- ✅ **AI Symptom Checker** → Users enter symptoms, system suggests possible conditions.  
- ✅ **Voice & Chatbot** → Supports **vernacular language voice input** for ease of use.  
- ✅ **Tele-consultation** → Book and attend doctor consultations online (video/audio).  
- ✅ **Health Dashboard** → Track vitals, medical history, prescriptions, and upcoming consultations.  
- ✅ **Low-bandwidth Mode** → Optimized for rural areas with poor internet.  

---

## ✨ Features
- 🤖 **AI-Powered Symptom Checker**  
- 🎙 **Voice-Enabled Chatbot** for low literacy users  
- 📞 **Tele-consultation (Video/Audio)**  
- 📊 **User Health Dashboard** with history & vitals  
- 🔐 **Secure Login/Register** using JWT Auth  
- 🌐 **Lightweight & Mobile-Friendly UI**  

---

## ⚙️ Tech Stack

### 🔹 Frontend
- **React + TypeScript** (UI framework)  
- **Vite** (fast dev build tool)  
- **Tailwind CSS** (styling)  
- **shadcn/ui + lucide-react** (UI components & icons)  

### 🔹 Backend
- **Node.js + Express** (API server)  
- **MongoDB + Mongoose** (Database)  
- **JWT (JSON Web Tokens)** for Authentication  
- **REST API** for frontend communication  


### 🔹 Other Tools
- **Jitsi meet API  for one on one video counselling
- **Omnidimension AI widget** for chatbot integration  
- **Concurrently** for running frontend & backend together  

---
⚠️ Environment Variables Disclaimer 


This project uses a .env file to store sensitive information such as database URIs and authentication secrets.

Never commit your .env file to GitHub.

Instead, create a .env.example file with only variable names (no secrets).

Add .env to .gitignore before pushing your code.


Example .env file for the backend (/server/.env):

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key


⚙️ Installation & Setup
🔑 Prerequisites


Node.js >= 18

MongoDB Atlas / Local instance

npm or yarn

🚀 Steps
# Clone repo
git clone https://github.com/AnkitPandey2005/Niramya_SIH.git
cd Niramya_SIH

# Install dependencies
npm install

# Setup backend environment
cd server
cp .env.example .env   # create env file & update values

▶️ Run Development Servers
# from project root
npm run dev


Frontend → http://localhost:5173

Backend API → http://localhost:5000

API requests are proxied (via vite.config.ts).

## 📂 Project Structure
<pre>
  Niramya_SIH/
│── src/ # Frontend (React + TypeScript + Tailwind + Vite)
│ ├── components/ # UI Components
│ ├── pages/ # App Pages (Login, Dashboard, Consultation)
│ ├── hooks/ # Custom React hooks
│ └── main.tsx # Entry point
│
│── server/ # Backend (Node.js + Express + MongoDB)
│ ├── routes/ # API routes
│ ├── models/ # Database schemas
│ ├── controllers/ # Business logic
│ └── index.js # Entry point
│
│── index.html # Root HTML for Vite app
│── package.json # Project dependencies & scripts
│── vite.config.ts # Vite + Proxy config
│── tailwind.config.js # Tailwind setup
│── tsconfig.* # TypeScript configs
</pre>

Deploy Link :-  https://niramya.netlify.app/
"# Triksha" 
