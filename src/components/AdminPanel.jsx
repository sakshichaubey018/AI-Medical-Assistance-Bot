import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  AlertTriangle, 
  Clock, 
  BarChart3,
  X,
  FileText,
  UserCheck
} from 'lucide-react';
import { getAdminStats, getFlaggedChats } from '../utils/mockData';

export default function AdminPanel() {
  const [stats, setStats] = useState(getAdminStats());
  const [flaggedSessions, setFlaggedSessions] = useState(getFlaggedChats());
  const [selectedSession, setSelectedSession] = useState(null);

  const refreshAdminData = () => {
    setStats(getAdminStats());
    setFlaggedSessions(getFlaggedChats());
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Monitor system health metrics, reports, and audit flagged dialog records.</p>
        </div>
        <button className="btn btn-secondary" onClick={refreshAdminData}>
          Refresh Metrics
        </button>
      </div>

      {/* Aggregate Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="widget-icon-wrapper" style={{ backgroundColor: 'rgba(91, 124, 250, 0.1)', color: 'var(--primary-blue)' }}>
            <Users size={24} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-body)', fontWeight: '700' }}>TOTAL USERS</span>
            <h3 style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'var(--font-title)' }}>{stats.totalUsers}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="widget-icon-wrapper" style={{ backgroundColor: 'rgba(13, 148, 136, 0.1)', color: 'var(--primary-blue)' }}>
            <MessageSquare size={24} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-body)', fontWeight: '700' }}>CHATS TODAY</span>
            <h3 style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'var(--font-title)' }}>{stats.activeChatsToday}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="widget-icon-wrapper" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-error)' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-body)', fontWeight: '700' }}>FLAGGED SESSIONS</span>
            <h3 style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'var(--font-title)', color: stats.flaggedSessions > 0 ? 'var(--accent-error)' : 'white' }}>{stats.flaggedSessions}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="widget-icon-wrapper" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-warning)' }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-body)', fontWeight: '700' }}>ACTIVE REMINDERS</span>
            <h3 style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'var(--font-title)' }}>{stats.activeReminders}</h3>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px'
      }}>
        
        {/* Quality Audit Logs Section */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} color="var(--accent-error)" /> Conversation Quality Audit
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-body)', marginBottom: '20px' }}>
            Review conversations automatically flagged due to emergency symptom warnings or crisis keywords.
          </p>

          {flaggedSessions.length === 0 ? (
            <div style={{ padding: '40px 0', textAlignment: 'center', color: 'var(--text-light)', fontSize: '13px', flexGrow: 1, display: 'flex', alignItems: 'center', justifyAlignment: 'center' }}>
              No conversations have been flagged for auditing yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '380px' }}>
              {flaggedSessions.map((session) => (
                <div key={session.id} style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ maxWidth: '70%' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '700' }}>User: {session.userName}</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-body)', marginTop: '2px' }}>
                      Reason: <strong style={{ color: 'var(--accent-warning)' }}>{session.reason}</strong>
                    </p>
                    <p style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '2px' }}>
                      {session.timestamp}
                    </p>
                  </div>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setSelectedSession(session)}
                    style={{ padding: '6px 12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <FileText size={12} /> View Log
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Symptoms bar chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={20} color="var(--primary-blue)" /> Top Checked Symptoms
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-body)', marginBottom: '24px' }}>
            Aggregated diagnostics frequency calculated from symptom checker wizard sessions.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {stats.topSymptoms.map((symptom, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '500' }}>{symptom.name}</span>
                  <span style={{ color: 'var(--text-body)', fontWeight: '600' }}>{symptom.percentage}%</span>
                </div>
                <div style={{ height: '8px', borderRadius: '4px', backgroundColor: 'var(--bg-alt)', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    borderRadius: '4px', 
                    width: `${symptom.percentage}%`,
                    background: 'linear-gradient(90deg, var(--primary-blue), var(--primary-blue))' 
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Audit Transcript Modal */}
      {selectedSession && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(2, 6, 23, 0.85)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '600px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            padding: '28px',
            position: 'relative'
          }}>
            <button 
              onClick={() => setSelectedSession(null)}
              style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>

            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
              Dialogue Audit
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-body)', marginBottom: '16px' }}>
              User: {selectedSession.userName} ({selectedSession.userEmail}) • Flag: {selectedSession.reason}
            </p>

            <div style={{ 
              flexGrow: 1, 
              overflowY: 'auto', 
              backgroundColor: 'rgba(0,0,0,0.2)', 
              borderRadius: '12px', 
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              border: '1px solid var(--border-subtle)'
            }}>
              {selectedSession.messages.map((m, idx) => (
                <div key={idx} style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: m.sender === 'user' ? 'rgba(91, 124, 250, 0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${m.sender === 'user' ? 'rgba(14, 165, 233, 0.2)' : 'var(--border-subtle)'}`,
                  padding: '10px 14px',
                  borderRadius: '12px',
                  maxWidth: '85%',
                  fontSize: '13px'
                }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: m.sender === 'user' ? 'var(--primary-blue)' : 'var(--primary-blue)', display: 'block', marginBottom: '3px' }}>
                    {m.sender.toUpperCase()}
                  </span>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{m.text}</p>
                </div>
              ))}
            </div>

            <button 
              className="btn btn-secondary" 
              onClick={() => setSelectedSession(null)}
              style={{ marginTop: '20px', width: '100%' }}
            >
              Close Log
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
