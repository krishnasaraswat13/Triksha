import fetch from 'node-fetch';

const BASE_URL = 'http://127.0.0.1:5000/api';

async function verify() {
    console.log('Testing Login...');
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
            console.error('Login Failed:', loginData);
            process.exit(1);
        }

        console.log('✅ Login Successful');
        console.log('User ID:', loginData.user._id);
        const token = loginData.token;

        // 2. Fetch Consultations
        console.log('\nTesting Fetch Consultations...');
        const consultRes = await fetch(`${BASE_URL}/consultations`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const consultData = await consultRes.json();

        if (!consultRes.ok) {
            console.error('Fetch Consultations Failed:', consultData);
            process.exit(1);
        }

        console.log(`✅ Consultations Found: ${consultData.length}`);

        if (consultData.length > 0) {
            console.log('Sample Patient:', consultData[0].patientId?.name);
        } else {
            console.log('⚠️ No consultations found for this doctor.');
        }

    } catch (error) {
        console.error('Script Error:', error);
    }
}

verify();
