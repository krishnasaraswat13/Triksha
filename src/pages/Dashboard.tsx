import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar, Video, FileText, Activity, Settings,
  MessageSquare, Pill, BarChart, Heart, Phone, Clock, Edit2, Save, X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DoctorDashboard from './DoctorDashboard';
import AIAnalyzer from '../components/AIAnalyzer';

// This allows TypeScript to recognize the global variables attached to the window object
declare global {
  interface Window {
    OmnidimensionWebWidget?: {
      open: () => void;
    };
    JitsiMeetExternalAPI?: new (domain: string, options: any) => any;
  }
}

// Type definitions for your data
type Consultation = {
  _id: string; // Assuming an ID from the database
  status: string;
  scheduledDate: string;
  doctorId?: { name?: string };
  type?: string;
};

type Doctor = {
  _id: string; // Assuming an ID
  name: string;
};

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isCalling, setIsCalling] = useState(false);
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    doctorId: '',
    symptoms: '',
    scheduledDate: '',
    type: 'video'
  });

  // Health Records State
  const [healthRecords, setHealthRecords] = useState<any[]>([]);
  const [trends, setTrends] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    diagnosis: '',
    vitals: { bloodPressure: '', weight: '', temperature: '' },
    notes: ''
  });

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('triksha_token');
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      if (response.status === 401) {
        alert("Session expired. Please login again.");
        logout();
        window.location.href = '/login';
        return;
      }

      if (response.ok) {
        alert('Consultation booked successfully!');
        setIsBookingModalOpen(false);
        fetchUserData(); // Refresh list
      } else {
        alert('Failed to book consultation');
      }
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  // Profile Edit State
  const [messages, setMessages] = useState<any[]>([]); // Messages State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    role: ''
  });

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('triksha_token');
      if (!token) {
        console.warn("No auth token found. User needs to be logged in to fetch data.");
        return;
      }

      const consultationsResponse = await fetch('/api/consultations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (consultationsResponse.status === 401) {
        console.warn("Session expired (401) during data fetch. Logging out.");
        logout();
        window.location.href = '/login';
        return;
      }

      if (consultationsResponse.ok) {
        const consultationsData = await consultationsResponse.json();
        setConsultations(consultationsData);
      }

      // Fetch Messages
      const messagesResponse = await fetch('/api/contact');
      if (messagesResponse.ok) {
        const allMessages = await messagesResponse.json();
        const userMessages = allMessages.filter((msg: any) => msg.email === user?.email);
        setMessages(userMessages.length > 0 ? userMessages : allMessages);
      }

      // Fetch Doctors
      const doctorsResponse = await fetch('/api/users/doctors', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (doctorsResponse.ok) {
        const doctorsData = await doctorsResponse.json();
        setDoctors(doctorsData);
      } else {
        // Fallback or empty if needed
      }

      // Fetch Health Records
      const healthResponse = await fetch('/api/health', { headers: { 'Authorization': `Bearer ${token}` } });
      if (healthResponse.ok) {
        const records = await healthResponse.json();
        setHealthRecords(records);
        if (records.length > 0) analyzeHealthTrends(records);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const analyzeHealthTrends = async (records: any[]) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/analyze-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records })
      });
      const data = await response.json();
      setTrends(data);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('triksha_token');

      // Sanitize payload: convert empty strings to undefined/null for numeric fields
      const sanitizedVitals = {
        bloodPressure: newRecord.vitals.bloodPressure,
        weight: newRecord.vitals.weight ? Number(newRecord.vitals.weight) : undefined,
        temperature: newRecord.vitals.temperature ? Number(newRecord.vitals.temperature) : undefined
      };

      const payload = {
        ...newRecord,
        vitals: sanitizedVitals
      };

      const response = await fetch('/api/health', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.status === 401) {
        alert("Session expired. Please login again.");
        logout();
        window.location.href = '/login';
        return;
      }

      if (response.ok) {
        setIsAddRecordOpen(false);
        setNewRecord({
          diagnosis: '',
          vitals: { bloodPressure: '', weight: '', temperature: '' },
          notes: ''
        });
        fetchUserData();
        alert("Record added!");
      } else {
        const errorData = await response.json();
        alert(`Failed to add record: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Failed to add record", error);
      alert("An error occurred while adding the record.");
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        role: user.role || ''
      });
      fetchUserData();
    }
  }, [user]);

  if (user?.role === 'doctor') {
    return <DoctorDashboard />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    alert("Profile updated successfully! (Mock)");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        role: user.role || ''
      });
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

  const startJitsiCall = (roomName: string, displayName: string) => {
    if (apiRef.current) {
      apiRef.current.dispose();
    }

    loadJitsiScript(() => {
      if (jitsiContainerRef.current && window.JitsiMeetExternalAPI) {
        const domain = 'meet.jit.si';
        const options = {
          roomName,
          width: '100%',
          height: '100%',
          parentNode: jitsiContainerRef.current,
          userInfo: { displayName },
          configOverwrite: { startWithAudioMuted: false, startWithVideoMuted: false },
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
              'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
              'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
              'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
              'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
            ],
          },
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

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <BarChart className="h-5 w-5" /> },
    { id: 'consultations', name: 'Consultations', icon: <Video className="h-5 w-5" /> },
    { id: 'health-records', name: 'Health Records', icon: <FileText className="h-5 w-5" /> },
    { id: 'messages', name: 'Messages', icon: <MessageSquare className="h-5 w-5" /> },
    { id: 'pharmacy', name: 'Pharmacy', icon: <Pill className="h-5 w-5" /> },
    { id: 'settings', name: 'Settings', icon: <Settings className="h-5 w-5" /> }
  ];

  const stats = [
    { name: 'Total Consultations', value: consultations.length, icon: <Video className="h-8 w-8 text-blue-600" /> },
    { name: 'Upcoming Appointments', value: consultations.filter(c => new Date(c.scheduledDate) > new Date()).length, icon: <Calendar className="h-8 w-8 text-green-600" /> },
    { name: 'Health Records', value: healthRecords.length, icon: <FileText className="h-8 w-8 text-purple-600" /> },
    { name: 'Messages', value: messages.length, icon: <MessageSquare className="h-8 w-8 text-orange-600" />, action: () => setActiveTab('messages') }
  ];

  const recentActivities = [
    { type: 'consultation', message: 'Video consultation with Dr. Sharma completed', time: '2 hours ago' },
    { type: 'prescription', message: 'New prescription added to your records', time: '1 day ago' },
    { type: 'appointment', message: 'Appointment scheduled for tomorrow', time: '2 days ago' },
    { type: 'message', message: 'New message from Dr. Patel', time: '3 days ago' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {isCalling && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 relative w-full max-w-4xl h-full max-h-[90vh]">
              <button
                className="absolute top-2 right-3 text-white bg-red-500 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 z-10"
                onClick={handleHangup}
                aria-label="Close call"
              >
                &times;
              </button>
              <div ref={jitsiContainerRef} className="w-full h-full rounded-lg overflow-hidden" />
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Your health dashboard - manage appointments, view records, and connect with doctors.</p>
        </div>

        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {tab.icon}<span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow" onClick={stat.action}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button onClick={() => setIsBookingModalOpen(true)} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all">
                  <Video className="h-6 w-6 text-blue-600" /><span className="font-medium">Book Consultation</span>
                </button>
                <button onClick={() => window.location.href = 'https://www.1mg.com/drugs-all-medicines'} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all">
                  <Pill className="h-6 w-6 text-purple-600" />
                  <span className="font-medium">Find Medicine</span>
                </button>
                <button onClick={() => window.location.href = 'tel:101'} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all">
                  <Phone className="h-6 w-6 text-orange-600" />
                  <span className="font-medium">Emergency Call</span>
                </button>
              </div>
            </div>

            {/* AI Analyzer */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <AIAnalyzer />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border-l-4 border-blue-200 bg-blue-50">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-gray-900">{activity.message}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'consultations' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Your Consultations</h2>
              <button onClick={() => setIsBookingModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Book New Consultation
              </button>
            </div>
            {consultations.length === 0 ? (
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No consultations yet</h3>
                <p className="text-gray-600 mb-4">Book your first video consultation with a qualified doctor.</p>
                <button onClick={() => setIsBookingModalOpen(true)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Book Consultation
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {consultations.map((consultation) => (
                  <div key={consultation._id} className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Dr. {consultation.doctorId?.name || 'Unknown'}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${consultation.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>{consultation.status}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2"><Clock className="h-4 w-4 inline mr-1" />{new Date(consultation.scheduledDate).toLocaleString()}</p>
                    <p className="text-sm text-gray-600 mb-4">Type: {consultation.type}</p>
                    {consultation.status === 'scheduled' && (
                      <button
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => startJitsiCall(`TrikshaConsultation_${consultation._id}`, user?.name || 'Patient')}
                      >Join Consultation</button>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Available Doctors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctors.slice(0, 6).map((doctor) => (
                  <div key={doctor._id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><Heart className="h-6 w-6 text-blue-600" /></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Dr. {doctor.name}</h4>
                        <p className="text-sm text-gray-600">General Medicine</p>
                      </div>
                    </div>
                    <button onClick={() => {
                      setBookingData(prev => ({ ...prev, doctorId: doctor._id }));
                      setIsBookingModalOpen(true);
                    }} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                      Book Appointment
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Health Records Tab */}
        {activeTab === 'health-records' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Medical History & Analysis</h2>
              <button
                onClick={() => setIsAddRecordOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <FileText className="h-4 w-4" /> <span>Add Record</span>
              </button>
            </div>

            {/* AI Analysis Card */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Activity className="h-24 w-24 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-indigo-900 flex items-center space-x-2">
                <Activity className="h-5 w-5 text-indigo-600" />
                <span>Health Improvement Analysis</span>
              </h3>

              {isAnalyzing ? (
                <p className="text-gray-500 mt-2 animate-pulse">Analyzing your health trends...</p>
              ) : trends ? (
                <div className="mt-4 space-y-3 relative z-10">
                  <p className="text-gray-700 font-medium">{trends.summary}</p>

                  {trends.improvements?.length > 0 && (
                    <div className="bg-green-100 p-3 rounded-lg border border-green-200">
                      <h4 className="text-green-800 font-semibold text-sm mb-1">Improvements Detected:</h4>
                      <ul className="list-disc list-inside text-sm text-green-700">
                        {trends.improvements.map((imp: string, i: number) => <li key={i}>{imp}</li>)}
                      </ul>
                    </div>
                  )}

                  {trends.concerns?.length > 0 && (
                    <div className="bg-yellow-100 p-3 rounded-lg border border-yellow-200">
                      <h4 className="text-yellow-800 font-semibold text-sm mb-1">Areas for Attention:</h4>
                      <ul className="list-disc list-inside text-sm text-yellow-700">
                        {trends.concerns.map((con: string, i: number) => <li key={i}>{con}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 mt-2">Add more health records to see AI-driven insights.</p>
              )}
            </div>

            {/* Records List */}
            <div className="grid grid-cols-1 gap-4">
              {healthRecords.map((record: any, index: number) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{record.diagnosis || 'General Checkup'}</h4>
                      <p className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</p>
                    </div>
                    {record.vitals?.bloodPressure && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        BP: {record.vitals.bloodPressure}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 block">Symptoms</span>
                      <span className="text-gray-800">{record.symptoms?.join(', ') || 'None listed'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Vitals</span>
                      <span className="text-gray-800">
                        {record.vitals?.weight ? `${record.vitals.weight} kg` : ''}
                        {record.vitals?.temperature ? ` • ${record.vitals.temperature}°F` : ''}
                      </span>
                    </div>
                  </div>
                  {record.notes && (
                    <div className="mt-3 bg-gray-50 p-3 rounded text-sm text-gray-600 italic">
                      "{record.notes}"
                    </div>
                  )}
                </div>
              ))}

              {healthRecords.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p>No medical records found.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Record Modal */}
        {isAddRecordOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Add Health Record</h3>
                <button onClick={() => setIsAddRecordOpen(false)}><X className="h-6 w-6 text-gray-500" /></button>
              </div>
              <form onSubmit={handleAddRecord} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Diagnosis / Reason</label>
                  <input type="text" className="w-full border rounded p-2 mt-1" required
                    value={newRecord.diagnosis}
                    onChange={e => setNewRecord({ ...newRecord, diagnosis: e.target.value })}
                    placeholder="e.g. Viral Fever, Regular Checkup"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">BP (mmHg)</label>
                    <input type="text" className="w-full border rounded p-2 mt-1"
                      value={newRecord.vitals.bloodPressure}
                      onChange={e => setNewRecord({ ...newRecord, vitals: { ...newRecord.vitals, bloodPressure: e.target.value } })}
                      placeholder="120/80"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                    <input type="number" className="w-full border rounded p-2 mt-1"
                      value={newRecord.vitals.weight}
                      onChange={e => setNewRecord({ ...newRecord, vitals: { ...newRecord.vitals, weight: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Temp (°F)</label>
                    <input type="number" className="w-full border rounded p-2 mt-1"
                      value={newRecord.vitals.temperature}
                      onChange={e => setNewRecord({ ...newRecord, vitals: { ...newRecord.vitals, temperature: e.target.value } })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Doctor's Notes</label>
                  <textarea className="w-full border rounded p-2 mt-1" rows={3}
                    value={newRecord.notes}
                    onChange={e => setNewRecord({ ...newRecord, notes: e.target.value })}
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700">
                  Save Record
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'messages' &&
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Messages</h2>
            {messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg._id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{msg.name || 'Support'}</h3>
                      <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{msg.message}</p>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs px-2 py-1 rounded-full ${msg.status === 'read' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {msg.status || 'unread'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No messages found.</p>
                <p className="text-sm text-gray-400">Messages from support or doctors will appear here.</p>
              </div>
            )}
          </div>
        }
        {activeTab === 'pharmacy' &&
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <Pill className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Search for medicines and find nearby pharmacies.</p>
            <button onClick={() => window.location.href = 'https://www.1mg.com/drugs-all-medicines'} className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Find Medicine
            </button>
          </div>
        }
        {activeTab === 'settings' &&
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6 max-w-lg mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={`w-full px-3 py-2 border rounded-lg transition-colors ${isEditing
                    ? 'bg-white border-blue-400 ring-2 ring-blue-100'
                    : 'bg-gray-50 border-gray-300'
                    }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={`w-full px-3 py-2 border rounded-lg transition-colors ${isEditing
                    ? 'bg-white border-blue-400 ring-2 ring-blue-100'
                    : 'bg-gray-50 border-gray-300'
                    }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={`w-full px-3 py-2 border rounded-lg transition-colors ${isEditing
                    ? 'bg-white border-blue-400 ring-2 ring-blue-100'
                    : 'bg-gray-50 border-gray-300'
                    }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed capitalize"
                  title="Role cannot be changed"
                />
              </div>
            </div>
          </div>
        }
      </div>
      {/* Voice Assistant and Booking Modal logic integrated above */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Book Consultation</h2>
              <button onClick={() => setIsBookingModalOpen(false)}><X className="h-6 w-6 text-gray-500" /></button>
            </div>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Doctor</label>
                <select
                  className="w-full border rounded-lg p-2 mt-1"
                  required
                  value={bookingData.doctorId}
                  onChange={(e) => setBookingData({ ...bookingData, doctorId: e.target.value })}
                >
                  <option value="">Choose a doctor...</option>
                  {doctors.map(doc => (
                    <option key={doc._id} value={doc._id}>{doc.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                <input
                  type="datetime-local"
                  className="w-full border rounded-lg p-2 mt-1"
                  required
                  value={bookingData.scheduledDate}
                  onChange={(e) => setBookingData({ ...bookingData, scheduledDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Symptoms</label>
                <textarea
                  className="w-full border rounded-lg p-2 mt-1"
                  rows={3}
                  placeholder="Describe your symptoms..."
                  value={bookingData.symptoms}
                  onChange={(e) => setBookingData({ ...bookingData, symptoms: e.target.value })}
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium">
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
