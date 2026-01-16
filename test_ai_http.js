
const http = require('http');
const fs = require('fs');

const postData = JSON.stringify({
    type: 'Lab Report',
    content: 'Patient has Blood Glucose Post-Prandial of 300 mg/dL'
});

const options = {
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/ai/analyze',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

console.log('Sending request...');
const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('Response:', data);
        fs.writeFileSync('ai_http_output.txt', data);
    });
});

req.on('error', (e) => {
    console.error('Problem with request:', e.message);
    fs.writeFileSync('ai_http_output.txt', 'Error: ' + e.message);
});

req.write(postData);
req.end();
