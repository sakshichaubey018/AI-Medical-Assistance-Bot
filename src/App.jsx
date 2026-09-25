import React, { useState } from 'react';
import { 
  Activity, 
  MessageSquare, 
  Clock, 
  BookOpen, 
  User, 
  PhoneCall, 
  ShieldCheck, 
  LogOut, 
  Menu,
  X,
  AlertTriangle,
  Info,
  CheckCircle
} from 'lucide-react';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';

// Screen Views
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ChatBot from './components/ChatBot';
import SymptomChecker from './components/SymptomChecker';
import Reminders from './components/Reminders';
import HealthTips from './components/HealthTips';
import Profile from './components/Profile';
import Emergency from './components/Emergency';
import AdminPanel from './components/AdminPanel';

function AppContent() {
  const { user, isAdmin, logout, reminders, appointments, refreshUserData, login, updateProfile } = useAuth();
  const { triggerToast } = useToast();
  const [screen, setScreen] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLoginSuccess = (loggedInUser) => {
    login(loggedInUser);
    triggerToast(`Logged in successfully as ${loggedInUser.name}!`);
  };

  const handleLogout = () => {
    logout();
    setScreen('dashboard');
    triggerToast("Logged out successfully.");
  };

  if (!user) {
    return (
      <div className="app-container">
        <Login onLoginSuccess={handleLoginSuccess} />
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
            onProfileUpdate={updateProfile} 
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
      
      {/* Mobile Header Bar */}
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
          <span style={{ fontFamily: 'var(--font-title)', fontWeight: '800', color: '#ffffff' }}>MedBot</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Navigation Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'mobile-open' : ''}`} style={{
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
              {user.name ? user.name[0].toUpperCase() : 'U'}
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
      </aside>

      {/* Main Content Area */}
      <main className="main-content" style={{ paddingTop: '32px' }}>
        {renderActiveScreen()}
      </main>

      {/* Responsive Styles */}
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

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
