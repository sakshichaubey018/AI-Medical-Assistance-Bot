import React from 'react';
import { 
  MessageSquare, 
  Activity, 
  Clock, 
  BookOpen, 
  User, 
  PhoneCall, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function Dashboard({ user, setScreen, reminders = [], appointments = [] }) {
  const pendingMedCount = reminders.filter(r => r.status === 'Pending').length;
  
  const getNextReminder = () => {
    const pending = reminders.filter(r => r.status === 'Pending');
    if (pending.length === 0) return null;
    return pending.sort((a, b) => a.time.localeCompare(b.time))[0];
  };

  const nextRem = getNextReminder();

  return (
    <div>
      {/* Hero Banner */}
      <div className="glass-panel" style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '0',
        marginBottom: '28px',
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        minHeight: '180px',
        background: 'linear-gradient(135deg, #0ea5e9 0%, #0d9488 100%)'
      }}>
        <div style={{
          position: 'relative',
          zIndex: 2,
          padding: '32px',
          color: '#ffffff',
          maxWidth: '560px'
        }}>
          <span style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            fontSize: '12px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '10px'
          }}>
            AI Health Portal 2.0
          </span>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#ffffff' }}>
            Welcome back, {user.name} 👋
          </h1>
          <p style={{ opacity: 0.9, fontSize: '15px', lineHeight: '1.5' }}>
            Empowering your health journey with intelligent AI symptom analysis, medication reminders, and safety protocols.
          </p>
        </div>
        <img 
          src="/medical_hero.jpg" 
          alt="AI Medical Assistant Banner" 
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '50%',
            objectFit: 'cover',
            maskImage: 'linear-gradient(to right, transparent 0%, black 35%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 35%)',
            pointerEvents: 'none'
          }} 
        />
      </div>

      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 className="page-title" style={{ fontSize: '20px' }}>Daily Health Overview</h2>
          <p className="page-subtitle">Quick access to your core medical tools</p>
        </div>
        <button className="btn btn-danger" onClick={() => setScreen('emergency')}>
          <PhoneCall size={16} /> Emergency Help
        </button>
      </div>

      {/* Health Profile incomplete notice */}
      {(!user.profile || !user.profile.age || !user.profile.gender) && (
        <div className="glass-panel" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          marginBottom: '28px',
          borderLeft: '4px solid var(--accent-warning)',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <AlertTriangle size={24} color="var(--accent-warning)" />
            <div>
              <h4 style={{ fontWeight: '600', fontSize: '15px' }}>Complete Your Health Profile</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-body)' }}>Add your age, gender, allergies, and current medications to help MedBot customize answers.</p>
            </div>
          </div>
          <button className="btn btn-secondary" onClick={() => setScreen('profile')} style={{ padding: '8px 16px', fontSize: '13px' }}>
            Go to Profile <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Main Stats Row */}
      <div className="dashboard-grid">
        <div className="glass-panel widget-card">
          <div className="widget-header">
            <span className="widget-title">Medication Status</span>
            <div className="widget-icon-wrapper" style={{ backgroundColor: 'rgba(13, 148, 136, 0.1)', color: 'var(--primary-blue)' }}>
              <Clock size={20} />
            </div>
          </div>
          <p style={{ fontSize: '32px', fontWeight: '800', margin: '8px 0', fontFamily: 'var(--font-title)' }}>
            {pendingMedCount} <span style={{ fontSize: '16px', color: 'var(--text-body)', fontWeight: 'normal' }}>pending today</span>
          </p>
          {nextRem ? (
            <p style={{ fontSize: '13px', color: 'var(--primary-blue)', fontWeight: '500' }}>
              Next: {nextRem.medicineName} ({nextRem.dosage}) at {nextRem.time}
            </p>
          ) : (
            <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>No medications left to take today.</p>
          )}
          <button className="widget-action" onClick={() => setScreen('reminders')} style={{ marginTop: '16px' }}>
            Manage Reminders <ArrowRight size={14} />
          </button>
        </div>

        <div className="glass-panel widget-card">
          <div className="widget-header">
            <span className="widget-title">Doctor Appointments</span>
            <div className="widget-icon-wrapper">
              <Activity size={20} />
            </div>
          </div>
          <p style={{ fontSize: '32px', fontWeight: '800', margin: '8px 0', fontFamily: 'var(--font-title)' }}>
            {appointments.length} <span style={{ fontSize: '16px', color: 'var(--text-body)', fontWeight: 'normal' }}>scheduled</span>
          </p>
          {appointments.length > 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--primary-blue)', fontWeight: '500' }}>
              Upcoming: Dr. {appointments[0].doctorName} on {appointments[0].date} at {appointments[0].time}
            </p>
          ) : (
            <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>No upcoming appointments scheduled.</p>
          )}
          <button className="widget-action" onClick={() => setScreen('reminders')} style={{ marginTop: '16px' }}>
            Schedule Appointment <ArrowRight size={14} />
          </button>
        </div>

        <div className="glass-panel widget-card">
          <div className="widget-header">
            <span className="widget-title">Safety Status</span>
            <div className="widget-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)' }}>
              <ShieldCheck size={20} />
            </div>
          </div>
          <div style={{ margin: '12px 0 20px 0' }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Medical Guard Active
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-body)', marginTop: '4px' }}>
              Chat keyword scanner & emergency escalation system are armed and running in real-time.
            </p>
          </div>
          <button className="widget-action" onClick={() => setScreen('chat')} style={{ marginTop: '4px' }}>
            Open Assistant Chat <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Grid of Shortcuts */}
      <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '20px', fontWeight: '600', marginBottom: '16px', marginTop: '12px' }}>
        Assistant Services
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px'
      }}>
        <div className="feature-card feature-card-lavender" onClick={() => setScreen('chat')} style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="widget-icon-wrapper" style={{ alignSelf: 'flex-start', backgroundColor: '#FFFFFF', boxShadow: '0 4px 12px rgba(91, 124, 250, 0.1)' }}>
            <MessageSquare size={20} />
          </div>
          <h4 style={{ fontWeight: '600', fontSize: '16px', color: 'var(--text-heading)' }}>AI Symptom & Health Chat</h4>
          <p style={{ fontSize: '13px', color: 'var(--text-body)' }}>Chat with our AI bot to ask health questions or get simple explanations for complex medical terms.</p>
        </div>

        <div className="feature-card feature-card-mint" onClick={() => setScreen('symptom')} style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="widget-icon-wrapper" style={{ alignSelf: 'flex-start', backgroundColor: '#FFFFFF', color: 'var(--accent-emerald)', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)' }}>
            <Activity size={20} />
          </div>
          <h4 style={{ fontWeight: '600', fontSize: '16px', color: 'var(--text-heading)' }}>Interactive Symptom Checker</h4>
          <p style={{ fontSize: '13px', color: 'var(--text-body)' }}>Select symptoms from a structured catalog to receive home-care advice or clinic suggestions.</p>
        </div>

        <div className="feature-card feature-card-sky" onClick={() => setScreen('tips')} style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="widget-icon-wrapper" style={{ alignSelf: 'flex-start', backgroundColor: '#FFFFFF', color: 'var(--primary-blue)', boxShadow: '0 4px 12px rgba(91, 124, 250, 0.1)' }}>
            <BookOpen size={20} />
          </div>
          <h4 style={{ fontWeight: '600', fontSize: '16px', color: 'var(--text-heading)' }}>Health Tips Library</h4>
          <p style={{ fontSize: '13px', color: 'var(--text-body)' }}>Browse or search categorized articles about sleep, diet, exercise, and common medical topics.</p>
        </div>

        <div className="feature-card feature-card-pink" onClick={() => setScreen('profile')} style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="widget-icon-wrapper" style={{ alignSelf: 'flex-start', backgroundColor: '#FFFFFF', color: '#b91c1c', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.1)' }}>
            <User size={20} />
          </div>
          <h4 style={{ fontWeight: '600', fontSize: '16px', color: 'var(--text-heading)' }}>Manage Profile</h4>
          <p style={{ fontSize: '13px', color: 'var(--text-body)' }}>Update your allergies, chronic issues, and personal information to refine AI chatbot responses.</p>
        </div>
      </div>
    </div>
  );
}
