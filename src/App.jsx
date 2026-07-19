import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  MessageSquare, 
  Clock, 
  BookOpen, 
  User, 
  PhoneCall, 
  Settings, 
  LogOut, 
  Menu,
  ShieldCheck,
  X,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

// Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ChatBot from './components/ChatBot';
import SymptomChecker from './components/SymptomChecker';
import Reminders from './components/Reminders';
import HealthTips from './components/HealthTips';
import Profile from './components/Profile';
import Emergency from './components/Emergency';
import AdminPanel from './components/AdminPanel';

// Utilities
import { getReminders, getAppointments } from './utils/mockData';

export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  // Dynamic user data
  const [reminders, setReminders] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // Auto-login if session exists in localStorage
  useEffect(() => {
    // Check if there is an active session
    const activeUserId = localStorage.getItem("medbot_active_user_id");
    const users = JSON.parse(localStorage.getItem("medbot_users") || "[]");
    if (activeUserId && users.length > 0) {
      const activeUser = users.find(u => u.id === activeUserId);
      if (activeUser) {
        setUser(activeUser);
      }
    }
  }, []);

  // Fetch active user data when user changes
  useEffect(() => {
    if (user) {
      refreshUserData();
    }
  }, [user]);

  const refreshUserData = () => {
    if (!user) return;
    setReminders(getReminders(user.id));
    setAppointments(getAppointments(user.id));
  };

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem("medbot_active_user_id", loggedInUser.id);
    triggerToast(`Logged in successfully as ${loggedInUser.name}!`);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("medbot_active_user_id");
    setScreen('dashboard');
    triggerToast("Logged out successfully.");
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  // Toast Queue Manager
  const triggerToast = (text, type = 'success') => {
    const id = "toast-" + Date.now();
    setToasts(prev => [...prev, { id, text, type }]);
    
    // Auto remove after 4.5s
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  // Check if active user is default administrator (we can simulate this based on email containing "admin")
  const isAdmin = user && user.email.toLowerCase().includes('admin');

  if (!user) {
    return (
      <div className="app-container">
        <Login onLoginSuccess={handleLoginSuccess} />
        {/* Toast Panel */}
        <div className="toast-container">
          {toasts.map(t => (
            <div key={t.id} className="toast" style={{
              borderColor: t.type === 'error' ? 'var(--accent-error)' : t.type === 'alert' ? 'var(--accent-warning)' : 'var(--primary-blue)'
            }}>
              {t.type === 'error' ? <AlertTriangle size={18} color="var(--accent-error)" /> : 
               t.type === 'alert' ? <AlertTriangle size={18} color="var(--accent-warning)" /> :
               t.type === 'info' ? <Info size={18} color="var(--primary-blue)" /> :
               <CheckCircle size={18} color="var(--accent-emerald)" />}
              <span style={{ fontSize: '13px' }}>{t.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const renderActiveScreen = () => {
    switch (screen) {
      case 'dashboard':
        return (
          <Dashboard 
            user={user} 
            setScreen={setScreen} 
            reminders={reminders} 
            appointments={appointments} 
          />
        );
      case 'chat':
        return <ChatBot user={user} setScreen={setScreen} />;
      case 'symptom':
        return <SymptomChecker setScreen={setScreen} />;
      case 'reminders':
        return (
          <Reminders 
            user={user} 
            reminders={reminders} 
            appointments={appointments} 
            refreshData={refreshUserData} 
            triggerToast={triggerToast} 
          />
        );
      case 'tips':
        return <HealthTips isAdmin={isAdmin} triggerToast={triggerToast} />;
      case 'profile':
        return (
          <Profile 
            user={user} 
            onProfileUpdate={handleProfileUpdate} 
            onLogout={handleLogout} 
            triggerToast={triggerToast} 
          />
        );
      case 'emergency':
        return <Emergency triggerToast={triggerToast} />;
      case 'admin':
        return isAdmin ? <AdminPanel /> : <Dashboard user={user} setScreen={setScreen} reminders={reminders} appointments={appointments} />;
      default:
        return <Dashboard user={user} setScreen={setScreen} reminders={reminders} appointments={appointments} />;
    }
  };

  return (
    <div className="app-container">
      
      {/* Mobile Top Header */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        justifyContent: 'space-between',
        zIndex: 90,
        backdropFilter: 'blur(8px)'
      }} className="mobile-header-only">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={24} color="#0ea5e9" />
          <span style={{ fontFamily: 'var(--font-title)', fontWeight: '800' }}>MedBot</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Navigation Panel */}
      <div className={`sidebar ${sidebarOpen ? 'mobile-open' : ''}`} style={{
        transform: sidebarOpen ? 'translateX(0)' : undefined
      }}>
        <div className="sidebar-logo">
          <Activity size={26} color="#0ea5e9" />
          <span>MedBot</span>
          <button 
            onClick={() => setSidebarOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', marginLeft: 'auto' }}
            className="mobile-header-only"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="nav-menu">
          <button 
            onClick={() => { setScreen('dashboard'); setSidebarOpen(false); }}
            className={`nav-item ${screen === 'dashboard' ? 'active' : ''}`}
          >
            <Activity /> Dashboard
          </button>
          
          <button 
            onClick={() => { setScreen('chat'); setSidebarOpen(false); }}
            className={`nav-item ${screen === 'chat' ? 'active' : ''}`}
          >
            <MessageSquare /> AI Health Chat
          </button>

          <button 
            onClick={() => { setScreen('symptom'); setSidebarOpen(false); }}
            className={`nav-item ${screen === 'symptom' ? 'active' : ''}`}
          >
            <Activity /> Symptom Checker
          </button>

          <button 
            onClick={() => { setScreen('reminders'); setSidebarOpen(false); }}
            className={`nav-item ${screen === 'reminders' ? 'active' : ''}`}
          >
            <Clock /> Reminders
          </button>

          <button 
            onClick={() => { setScreen('tips'); setSidebarOpen(false); }}
            className={`nav-item ${screen === 'tips' ? 'active' : ''}`}
          >
            <BookOpen /> Health Library
          </button>

          <button 
            onClick={() => { setScreen('profile'); setSidebarOpen(false); }}
            className={`nav-item ${screen === 'profile' ? 'active' : ''}`}
          >
            <User /> Profile
          </button>

          <button 
            onClick={() => { setScreen('emergency'); setSidebarOpen(false); }}
            className={`nav-item ${screen === 'emergency' ? 'active' : ''}`}
            style={{ color: 'var(--accent-error)', borderLeftColor: screen === 'emergency' ? 'var(--accent-error)' : 'transparent' }}
          >
            <PhoneCall /> Emergency Help
          </button>

          {/* Admin link showing conditionally */}
          {isAdmin && (
            <button 
              onClick={() => { setScreen('admin'); setSidebarOpen(false); }}
              className={`nav-item ${screen === 'admin' ? 'active' : ''}`}
              style={{ color: 'var(--accent-warning)', borderLeftColor: screen === 'admin' ? 'var(--accent-warning)' : 'transparent', marginTop: '16px' }}
            >
              <ShieldCheck /> Admin Portal
            </button>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-badge">
            <div className="user-avatar">
              {user.name[0].toUpperCase()}
            </div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{isAdmin ? "Administrator" : "Patient"}</span>
            </div>
          </div>

          <button onClick={handleLogout} className="nav-item" style={{ color: 'var(--accent-error)' }}>
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </div>

      {/* Main Screen Content Pane */}
      <main className="main-content" style={{
        paddingTop: '32px' // Handled dynamically in CSS media-queries
      }}>
        {renderActiveScreen()}
      </main>

      {/* Toast Alert Panels Overlay */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className="toast" style={{
            borderColor: t.type === 'error' ? 'var(--accent-error)' : t.type === 'alert' ? 'var(--accent-warning)' : 'var(--primary-blue)'
          }}>
            {t.type === 'error' ? <AlertTriangle size={18} color="var(--accent-error)" /> : 
             t.type === 'alert' ? <AlertTriangle size={18} color="var(--accent-warning)" /> :
             t.type === 'info' ? <Info size={18} color="var(--primary-blue)" /> :
             <CheckCircle size={18} color="var(--accent-emerald)" />}
            <span style={{ fontSize: '13px' }}>{t.text}</span>
          </div>
        ))}
      </div>

      {/* Global CSS Inject for Mobile Headers */}
      <style>{`
        .mobile-header-only {
          display: none !important;
        }
        @media (max-width: 900px) {
          .mobile-header-only {
            display: flex !important;
          }
          .sidebar {
            transform: translateX(-280px);
            transition: transform 0.3s ease;
          }
          .sidebar.mobile-open {
            transform: translateX(0);
          }
          .main-content {
            padding-top: 80px !important;
          }
        }
      `}</style>

    </div>
  );
}
