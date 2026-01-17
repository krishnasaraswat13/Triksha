

const BASE_URL = 'http://localhost:5000/api';

async function verify() {
    try {
        // 1. Login
        console.log('Logging in as Anjali...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: 'anjali@example.com', password: 'password123' })
        });

        const loginData = await loginRes.json();

        if (!loginRes.ok) {
            console.error('Login Failed:', loginData);
            return;
        }

        const token = loginData.token;
        console.log('Login Successful. Token obtained.');
        console.log('User ID:', loginData.user.id);

        // 2. Fetch Health Records
        console.log('Fetching Health Records...');
        const healthRes = await fetch(`${BASE_URL}/health`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const healthData = await healthRes.json();

        if (!healthRes.ok) {
            console.error('Fetch Failed:', healthData);
            return;
        }

        console.log('Health Records Found:', healthData.length);
        console.log(JSON.stringify(healthData, null, 2));

    } catch (error) {
        console.error('Error:', error);
    }
}

verify();
