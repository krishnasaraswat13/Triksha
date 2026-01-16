import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Features from './pages/Features';
import Workflow from './pages/Workflow';
import Impact from './pages/Impact';
// import Team from './pages/Team';
// import References from './pages/References';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/workflow" element={<Workflow />} />
              <Route path="/impact" element={<Impact />} />
              {/* <Route path="/team" element={<Team />} /> */}
              {/* <Route path="/references" element={<References />} /> */}
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />
          <ChatWidget />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;