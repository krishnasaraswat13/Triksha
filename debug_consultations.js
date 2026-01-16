import fs from 'fs';

const BASE_URL = 'http://127.0.0.1:5000/api';
const LOG_FILE = 'debug_output.txt';

function log(msg) {
    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg + '\n');
}

async function debugConsultations() {
    fs.writeFileSync(LOG_FILE, 'Starting Debug...\n');
    log('🔍 Starting Deep Debug of Consultations...');
    try {
        // 1. Login
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'rajesh@niramya.com',
                password: 'password123'
            })
        });

        const loginData = await loginRes.json();

        if (!loginRes.ok) {
            log(`❌ Login Failed: ${JSON.stringify(loginData)}`);
            process.exit(1);
        }

        const token = loginData.token;
        log('✅ Login Successful.');

        // 2. Fetch Consultations
        const consultRes = await fetch(`${BASE_URL}/consultations`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const consultData = await consultRes.json();
        log(`📊 API Status: ${consultRes.status}`);
        log(`📦 Consultations Count: ${consultData.length}`);

        if (consultData.length > 0) {
            log('------------------------------------------------');
            log('🧪 First Consultation Data Structure:');
            log(JSON.stringify(consultData[0], null, 2));
            log('------------------------------------------------');

            const firstPat = consultData[0].patientId;
            if (typeof firstPat === 'object' && firstPat !== null) {
                log('✅ patientId is an object (Populated)');
                log(`Patient Name: ${firstPat.name}`);
                log(`Patient Profile: ${JSON.stringify(firstPat.profile)}`);
            } else {
                log(`❌ patientId is NOT an object! Value: ${firstPat}`);
            }
        } else {
            log('⚠️ No consultations found!');
        }

    } catch (error) {
        log(`❌ Script Error: ${error.toString()}`);
    }
}

debugConsultations();
