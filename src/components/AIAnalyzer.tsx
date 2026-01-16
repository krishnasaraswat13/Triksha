import React, { useState } from 'react';
import { Activity, AlertTriangle, FileText, CheckCircle, Loader } from 'lucide-react';

const AIAnalyzer: React.FC = () => {
    const [type, setType] = useState('Lab Report');
    const [content, setContent] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!content) return;
        setLoading(true);
        setResult(null);
        try {
            const response = await fetch('/api/ai/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, content })
            });
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error(error);
            alert("Analysis failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Activity className="h-5 w-5 text-teal-600 mr-2" />
                Medical Data AI Analyzer
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full border rounded-lg p-2"
                    >
                        <option>Lab Report</option>
                        <option>Prescription</option>
                        <option>App Vitals</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Raw Content</label>
                    <textarea
                        className="w-full border rounded-lg p-2 h-32"
                        placeholder="Paste medical text here (e.g. 'Blood Glucose 300 mg/dL')..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                </div>
                <button
                    onClick={handleAnalyze}
                    disabled={loading || !content}
                    className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition disabled:opacity-50 flex justify-center items-center"
                >
                    {loading ? <Loader className="h-5 w-5 animate-spin mr-2" /> : <FileText className="h-5 w-5 mr-2" />}
                    {loading ? 'Analyzing...' : 'Analyze Data'}
                </button>
            </div>

            {result && (
                <div className="mt-8 space-y-6 animate-fade-in-up">
                    {/* Risk Flags */}
                    {result.riskFlags?.length > 0 && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4">
                            <h3 className="text-red-800 font-bold flex items-center mb-2">
                                <AlertTriangle className="h-5 w-5 mr-2" />
                                High Risk Detected
                            </h3>
                            {result.riskFlags.map((flag: any, idx: number) => (
                                <div key={idx} className="mb-2">
                                    <span className="font-semibold text-red-700">{flag.condition} ({flag.severity}): </span>
                                    <span className="text-red-600">{flag.action}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Patient Summary */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                        <h3 className="text-blue-800 font-bold mb-2">Patient Summary</h3>
                        <p className="text-blue-900 leading-relaxed">{result.patientSummary}</p>
                    </div>

                    {/* Structured Data */}
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <h3 className="font-bold text-gray-700 mb-2">Extracted Data</h3>
                        <div className="space-y-2 text-sm">
                            {result.structuredData && Object.entries(result.structuredData).map(([key, value]) => (
                                <div key={key} className="flex justify-between border-b pb-1">
                                    <span className="capitalize text-gray-600">{key}:</span>
                                    <span className="font-medium text-gray-900">
                                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-xs text-gray-400 italic text-center mt-4">{result.disclaimer}</p>
                </div>
            )}
        </div>
    );
};

export default AIAnalyzer;
