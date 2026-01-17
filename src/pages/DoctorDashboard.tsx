import React from 'react';
import {
    Users, Calendar, Clock, FileText, Check, X, Video,
    MessageSquare, Activity, ChevronRight, Brain
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DoctorDashboard = () => {
    const { user } = useAuth();
    // const [activeTab, setActiveTab] = useState('overview'); // Tab logic for future expansion
    const jitsiContainerRef = React.useRef<HTMLDivElement>(null);
    const apiRef = React.useRef<any>(null);
    const [isCalling, setIsCalling] = React.useState(false);
    const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = React.useState(false);
    const [selectedConsultationId, setSelectedConsultationId] = React.useState<string | null>(null);
    const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] = React.useState(false);
    const [isPatientDetailsOpen, setIsPatientDetailsOpen] = React.useState(false);
    const [isLabRequestOpen, setIsLabRequestOpen] = React.useState(false);
    const [createAptData, setCreateAptData] = React.useState({ patientName: '', date: '', time: '', type: 'video' });
    const [labRequestData, setLabRequestData] = React.useState({ testName: '', urgency: 'normal', notes: '' });

    // AI Analysis State
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = React.useState(false);
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [analysisResult, setAnalysisResult] = React.useState<any>(null);

    const [prescriptionData, setPrescriptionData] = React.useState({
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
    });

    // Mock Data State
    const [appointments, setAppointments] = React.useState<any[]>([]);
    const [statsData, setStatsData] = React.useState({
        totalPatients: 0,
        todayAppointments: 0,
        pendingRequests: 0,
        totalConsultations: 0
    });

    React.useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('triksha_token');
            const response = await fetch('/api/consultations', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setAppointments(data);
                // Calculate stats
                const today = new Date().toDateString();
                setStatsData({
                    totalPatients: new Set(data.map((a: any) => a.patientId?._id)).size,
                    todayAppointments: data.filter((a: any) => new Date(a.scheduledDate).toDateString() === today).length,
                    pendingRequests: data.filter((a: any) => a.status === 'scheduled').length, // Assuming 'scheduled' is pending until accepted in this flow, or specific status
                    totalConsultations: data.length
                });
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const recentPatients = React.useMemo(() => {
        const uniquePatients = new Map();
        appointments.forEach(apt => {
            if (apt.patientId && !uniquePatients.has(apt.patientId._id)) {
                uniquePatients.set(apt.patientId._id, {
                    id: apt.patientId._id,
                    name: apt.patientId.name,
                    gender: apt.patientId.profile?.gender || 'N/A',
                    age: apt.patientId.profile?.age || 'N/A',
                    lastVisit: new Date(apt.scheduledDate).toLocaleDateString(),
                    condition: apt.patientId.profile?.chronicConditions?.[0] || 'General Checkup',
                    bloodGroup: apt.patientId.profile?.bloodGroup || 'N/A',
                    allergies: apt.patientId.profile?.allergies?.join(', ') || 'None',
                    chronicConditions: apt.patientId.profile?.chronicConditions?.join(', ') || 'None',
                    phone: apt.patientId.phone,
                    email: apt.patientId.email
                });
            }
        });
        return Array.from(uniquePatients.values());
    }, [appointments]);

    const updateStatus = async (id: string, status: string) => {
        try {
            const token = localStorage.getItem('triksha_token');
            const response = await fetch(`/api/consultations/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            if (response.ok) {
                // Removed alert for smoother UX, could add toast
                fetchAppointments(); // Refresh
            }
        } catch (error) {
            console.error('Update error:', error);
        }
    };




    const loadJitsiScript = (callback: () => void) => {
        const existingScript = document.getElementById('jitsi-script');
        if (existingScript && window.JitsiMeetExternalAPI) {
            callback();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.id = 'jitsi-script';
        script.async = true;
        script.onload = () => callback();
        document.body.appendChild(script);
    };

    const handleJoinCall = (roomName: string, patientName: string) => {
        if (apiRef.current) apiRef.current.dispose();

        loadJitsiScript(() => {
            if (jitsiContainerRef.current && window.JitsiMeetExternalAPI) {
                const domain = 'meet.jit.si';
                const options = {
                    roomName: roomName,
                    width: '100%',
                    height: '100%',
                    parentNode: jitsiContainerRef.current,
                    userInfo: { displayName: `Dr. ${user?.name}` },
                    configOverwrite: { startWithAudioMuted: false, startWithVideoMuted: false },
                    interfaceConfigOverwrite: {
                        TOOLBAR_BUTTONS: ['microphone', 'camera', 'hangup', 'chat', 'settings', 'raisehand', 'tileview']
                    }
                };
                const api = new window.JitsiMeetExternalAPI(domain, options);
                apiRef.current = api;
                api.addListener('readyToClose', handleHangup);
                api.addListener('videoConferenceLeft', handleHangup);
            }
        });
        setIsCalling(true);
    };

    const handleHangup = () => {
        if (apiRef.current) {
            apiRef.current.dispose();
            apiRef.current = null;
        }
        setIsCalling(false);
    };

    const handleCreateAppointment = () => {
        setIsCreateAppointmentOpen(true);
    };

    const handleAnalyzePatient = async (patientId: string, patientName: string) => {
        setIsAnalyzing(true);
        setIsAnalysisModalOpen(true);
        setAnalysisResult(null); // Reset previous result

        try {
            const token = localStorage.getItem('triksha_token');
            const response = await fetch('/api/ai/patient-analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ patientId })
            });
            const data = await response.json();
            setAnalysisResult({ ...data, patientName });
        } catch (error) {
            console.error("Analysis error", error);
            setAnalysisResult({ error: "Failed to generate analysis" });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleCreateAptSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock submission to local state or would be API
        const newApt = {
            _id: Date.now().toString(),
            patientId: { name: createAptData.patientName },
            scheduledDate: new Date(`${createAptData.date}T${createAptData.time}`),
            type: createAptData.type,
            status: 'scheduled',
            roomId: `room_${Date.now()}`
        };
        setAppointments(prev => [...prev, newApt]);
        setIsCreateAppointmentOpen(false);
        alert("Appointment Created!");
    };

    const handleViewAllAppointments = () => {
        // Just scroll top or show toast for now
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleViewPatientDetails = (patient: any) => {
        setSelectedPatient(patient);
        setIsPatientDetailsOpen(true);
    };

    const handleNewPrescription = (consultationId?: string) => {
        // If called without ID (from quick action), we might show a selector, but for now lets assume we pick the first scheduled one or just open generic
        if (consultationId) {
            setSelectedConsultationId(consultationId);
        }
        // Reset form
        setPrescriptionData({ medication: '', dosage: '', frequency: '', duration: '', instructions: '' });
        setIsPrescriptionModalOpen(true);
    };

    const handlePrescriptionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedConsultationId) {
            alert("Please select a valid consultation first (via Today's Schedule).");
            setIsPrescriptionModalOpen(false);
            return;
        }

        try {
            const token = localStorage.getItem('triksha_token');
            const response = await fetch(`/api/consultations/${selectedConsultationId}/prescription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ prescription: prescriptionData })
            });

            if (response.ok) {
                alert("Prescription sent successfully!");
                setIsPrescriptionModalOpen(false);
            } else {
                alert("Failed to send prescription.");
            }
        } catch (err) {
            console.error(err);
            alert("Error sending prescription");
        }
    };

    const handleLabRequest = () => {
        setLabRequestData({ testName: '', urgency: 'normal', notes: '' });
        setIsLabRequestOpen(true);
    };

    const handleLabSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock API call
        alert(`Lab request for ${labRequestData.testName} sent!`);
        setIsLabRequestOpen(false);
    };

    const scheduleRef = React.useRef<HTMLDivElement>(null);
    const patientsRef = React.useRef<HTMLDivElement>(null);

    // Calculate stats dynamicallly based on state
    const stats = [
        {
            label: 'Total Patients',
            value: statsData.totalPatients.toString(),
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-100',
            action: () => patientsRef.current?.scrollIntoView({ behavior: 'smooth' })
        },
        {
            label: 'Appointments Today',
            value: statsData.todayAppointments.toString(),
            icon: Calendar,
            color: 'text-green-600',
            bg: 'bg-green-100',
            action: () => scheduleRef.current?.scrollIntoView({ behavior: 'smooth' })
        },
        {
            label: 'Pending Requests',
            value: statsData.pendingRequests.toString(),
            icon: Clock,
            color: 'text-orange-600',
            bg: 'bg-orange-100',
            action: () => scheduleRef.current?.scrollIntoView({ behavior: 'smooth' })
        },
        {
            label: 'Total Consultations',
            value: statsData.totalConsultations.toString(),
            icon: Video,
            color: 'text-purple-600',
            bg: 'bg-purple-100',
            action: () => scheduleRef.current?.scrollIntoView({ behavior: 'smooth' })
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            {isCalling && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
                    <div className="bg-white rounded-xl shadow-lg p-4 relative w-full max-w-5xl h-[80vh]">
                        <button
                            className="absolute top-4 right-4 text-white bg-red-600 p-2 rounded-full z-10 hover:bg-red-700"
                            onClick={handleHangup}
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <div ref={jitsiContainerRef} className="w-full h-full rounded-lg overflow-hidden" />
                    </div>
                </div>
            )}

            {/* AI Analysis Modal */}
            {isAnalysisModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl transform transition-all scale-100">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Brain className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">AI Health Analysis</h2>
                                    {analysisResult?.patientName && <p className="text-sm text-gray-500">For {analysisResult.patientName}</p>}
                                </div>
                            </div>
                            <button onClick={() => setIsAnalysisModalOpen(false)} className="hover:bg-gray-100 p-2 rounded-full transition-colors"><X className="h-6 w-6 text-gray-500" /></button>
                        </div>

                        {isAnalyzing ? (
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                                <p className="text-gray-500 animate-pulse">Analyzing patient records with AI...</p>
                            </div>
                        ) : analysisResult ? (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                                    <h3 className="font-semibold text-purple-900 mb-2">Summary</h3>
                                    <p className="text-purple-800 text-sm leading-relaxed">{analysisResult.summary}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                                        <h3 className="font-semibold text-red-900 mb-2">Risk Assessment</h3>
                                        <div className="flex items-center space-x-2">
                                            <div className={`h-3 w-3 rounded-full ${analysisResult.riskAssessment?.includes("Low") ? "bg-green-500" : "bg-red-500"}`}></div>
                                            <span className="text-red-800 font-medium">{analysisResult.riskAssessment || "Unknown"}</span>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                        <h3 className="font-semibold text-blue-900 mb-2">Key Insights</h3>
                                        <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                                            {analysisResult.keyInsights?.length > 0 ? (
                                                analysisResult.keyInsights.map((insight: string, i: number) => <li key={i}>{insight}</li>)
                                            ) : (<li>No specific insights found.</li>)}
                                        </ul>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">AI Recommendations</h3>
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                        <ul className="space-y-2">
                                            {analysisResult.recommendations?.map((rec: string, i: number) => (
                                                <li key={i} className="flex items-start space-x-2 text-sm text-gray-700">
                                                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span>{rec}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <p className="text-xs text-center text-gray-400 mt-4">AI-generated analysis. Please verify with clinical records.</p>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-red-500">Failed to load analysis.</div>
                        )}
                    </div>
                </div>
            )}

            {/* Prescription Modal */}
            {isPrescriptionModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Write Prescription</h2>
                            <button onClick={() => setIsPrescriptionModalOpen(false)}><X className="h-6 w-6 text-gray-500" /></button>
                        </div>
                        <form onSubmit={handlePrescriptionSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Medication Name</label>
                                <input type="text" className="w-full border rounded-lg p-2 mt-1" required value={prescriptionData.medication} onChange={e => setPrescriptionData({ ...prescriptionData, medication: e.target.value })} placeholder="e.g. Paracetamol" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Dosage</label>
                                    <input type="text" className="w-full border rounded-lg p-2 mt-1" required value={prescriptionData.dosage} onChange={e => setPrescriptionData({ ...prescriptionData, dosage: e.target.value })} placeholder="e.g. 500mg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Frequency</label>
                                    <input type="text" className="w-full border rounded-lg p-2 mt-1" required value={prescriptionData.frequency} onChange={e => setPrescriptionData({ ...prescriptionData, frequency: e.target.value })} placeholder="e.g. Twice daily" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Duration</label>
                                <input type="text" className="w-full border rounded-lg p-2 mt-1" required value={prescriptionData.duration} onChange={e => setPrescriptionData({ ...prescriptionData, duration: e.target.value })} placeholder="e.g. 5 days" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Instructions</label>
                                <textarea className="w-full border rounded-lg p-2 mt-1" rows={3} value={prescriptionData.instructions} onChange={e => setPrescriptionData({ ...prescriptionData, instructions: e.target.value })} placeholder="e.g. Take after food"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 font-medium">
                                Save Prescription
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Appointment Modal */}
            {isCreateAppointmentOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Create Appointment</h2>
                            <button onClick={() => setIsCreateAppointmentOpen(false)}><X className="h-6 w-6 text-gray-500" /></button>
                        </div>
                        <form onSubmit={handleCreateAptSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Patient Name</label>
                                <input type="text" className="w-full border rounded-lg p-2 mt-1" required value={createAptData.patientName} onChange={e => setCreateAptData({ ...createAptData, patientName: e.target.value })} placeholder="e.g. John Doe" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date</label>
                                    <input type="date" className="w-full border rounded-lg p-2 mt-1" required value={createAptData.date} onChange={e => setCreateAptData({ ...createAptData, date: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Time</label>
                                    <input type="time" className="w-full border rounded-lg p-2 mt-1" required value={createAptData.time} onChange={e => setCreateAptData({ ...createAptData, time: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                <select className="w-full border rounded-lg p-2 mt-1" value={createAptData.type} onChange={e => setCreateAptData({ ...createAptData, type: e.target.value })}>
                                    <option value="video">Video Call</option>
                                    <option value="clinic">Clinic Visit</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 font-medium">
                                Create
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Patient Details Modal */}
            {isPatientDetailsOpen && selectedPatient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Patient Details</h2>
                            <button onClick={() => setIsPatientDetailsOpen(false)}><X className="h-6 w-6 text-gray-500" /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                                    {selectedPatient.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">{selectedPatient.name}</h3>
                                    <p className="text-gray-500">{selectedPatient.gender}, {selectedPatient.age} yo</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                <div>
                                    <p className="text-xs text-gray-500">Condition</p>
                                    <p className="font-medium text-gray-900">{selectedPatient.condition}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Last Visit</p>
                                    <p className="font-medium text-gray-900">{selectedPatient.lastVisit}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Blood Group</p>
                                    <p className="font-medium text-gray-900">{selectedPatient.bloodGroup}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Allergies</p>
                                    <p className="font-medium text-gray-900">{selectedPatient.allergies}</p>
                                </div>
                            </div>
                            <button className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50">
                                View Full Medical History
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Lab Request Modal */}
            {isLabRequestOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">New Lab Request</h2>
                            <button onClick={() => setIsLabRequestOpen(false)}><X className="h-6 w-6 text-gray-500" /></button>
                        </div>
                        <form onSubmit={handleLabSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Test Name</label>
                                <input type="text" className="w-full border rounded-lg p-2 mt-1" required value={labRequestData.testName} onChange={e => setLabRequestData({ ...labRequestData, testName: e.target.value })} placeholder="e.g. CBC, X-Ray" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Urgency</label>
                                <select className="w-full border rounded-lg p-2 mt-1" value={labRequestData.urgency} onChange={e => setLabRequestData({ ...labRequestData, urgency: e.target.value })}>
                                    <option value="normal">Normal</option>
                                    <option value="urgent">Urgent</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Clinical Notes</label>
                                <textarea className="w-full border rounded-lg p-2 mt-1" rows={3} value={labRequestData.notes} onChange={e => setLabRequestData({ ...labRequestData, notes: e.target.value })} placeholder="Reason for test..."></textarea>
                            </div>
                            <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 font-medium">
                                Send Request
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dr. {user?.name || 'Doctor'}</h1>
                        <p className="text-gray-600">Welcome back to your dashboard</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-gray-700">Available</span>
                        </div>
                        <button onClick={handleCreateAppointment} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors shadow-md">
                            + Create Appointment
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} onClick={stat.action} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.bg} p-3 rounded-lg`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                            </div>
                            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column - Appointments */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Upcoming Appointments */}
                        <div ref={scheduleRef} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">Today's Schedule</h2>
                                <button onClick={handleViewAllAppointments} className="text-teal-600 text-sm font-medium hover:text-teal-700">View All</button>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {appointments.map((apt) => (
                                    <div key={apt._id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-12 w-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-lg">
                                                {apt.patientId?.name?.charAt(0) || 'P'}
                                            </div>
                                            <div>
                                                <h3 className="text-base font-semibold text-gray-900">{apt.patientId?.name || 'Unknown Patient'}</h3>
                                                <div className="flex items-center text-sm text-gray-500 space-x-3">
                                                    <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {new Date(apt.scheduledDate).toLocaleString()}</span>
                                                    <span className="flex items-center"><Video className="h-3 w-3 mr-1" /> {apt.type.charAt(0).toUpperCase() + apt.type.slice(1)}</span>
                                                    <span className={`px-2 py-0.5 text-xs rounded-full ${apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{apt.status}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex space-x-2">
                                            {apt.status === 'scheduled' ? (
                                                <>
                                                    <button onClick={() => updateStatus(apt._id, 'confirmed')} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors" title="Accept">
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => updateStatus(apt._id, 'cancelled')} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors" title="Decline">
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => window.open(`https://meet.jit.si/${apt.roomId}`, '_blank')} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium">
                                                        Join Call (Ext)
                                                    </button>
                                                    <button onClick={() => handleJoinCall(apt.roomId, apt.patientId?.name)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                                        Join Call (In-App)
                                                    </button>
                                                    <button onClick={() => handleNewPrescription(apt._id)} className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors" title="Write Prescription">
                                                        <FileText className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => handleAnalyzePatient(apt.patientId?._id, apt.patientId?.name)} className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors shadow-sm" title="AI Report Analysis">
                                                        <Brain className="h-4 w-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Patients */}
                        <div ref={patientsRef} className="bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900">Recent Patients</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender/Age</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Condition</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Visit</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {recentPatients.map((patient: any) => (
                                            <tr key={patient.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{patient.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{patient.gender}, {patient.age}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                                        {patient.condition}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{patient.lastVisit}</td>
                                                <td onClick={() => handleViewPatientDetails(patient)} className="px-6 py-4 text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                                                    View details
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                    {/* Right Column - Quick Actions & Notifications */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-teal-600 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
                            <h3 className="text-lg font-bold mb-2">Quick Prescription</h3>
                            <p className="text-teal-100 text-sm mb-4">Create a digital prescription instantly.</p>
                            <div className="space-y-3">
                                <button onClick={() => handleNewPrescription()} className="w-full bg-white/20 hover:bg-white/30 transition-colors p-3 rounded-lg flex items-center justify-between">
                                    <span className="flex items-center"><FileText className="h-4 w-4 mr-2" /> New Prescription</span>
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                                <button onClick={handleLabRequest} className="w-full bg-white/20 hover:bg-white/30 transition-colors p-3 rounded-lg flex items-center justify-between">
                                    <span className="flex items-center"><Activity className="h-4 w-4 mr-2" /> Lab Request</span>
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Notifications</h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <MessageSquare className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-800 font-medium">New message from Admin</p>
                                        <p className="text-xs text-gray-500 mt-1">System update scheduled for tonight.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Calendar className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-800 font-medium">Appointment Rescheduled</p>
                                        <p className="text-xs text-gray-500 mt-1">Priya Patel changed time to 11:30 AM.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
