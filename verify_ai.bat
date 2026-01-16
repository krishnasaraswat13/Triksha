@echo off
curl -X POST -H "Content-Type: application/json" -d "{\"type\":\"Lab Report\",\"content\":\"Patient has Blood Glucose Post-Prandial of 300 mg/dL\"}" http://127.0.0.1:5000/api/ai/analyze > curl_output.txt 2>&1
type curl_output.txt
