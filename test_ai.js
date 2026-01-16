import fs from 'fs';

// Node 18+ has global fetch. 
const run = async () => {
    try {
        console.log("Sending request...");
        const res = await fetch('http://127.0.0.1:5000/api/ai/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'Lab Report',
                content: 'Patient has Blood Glucose Post-Prandial of 300 mg/dL'
            })
        });
        const data = await res.json();
        console.log("Response received:", data);
        fs.writeFileSync('ai_test_output.txt', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error:", e);
        fs.writeFileSync('ai_test_output.txt', 'Error: ' + e.message);
    }
};

run();
