import React, { useState } from 'react';
import { 
  Clock, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Bell, 
  AlertCircle,
  CalendarDays,
  MapPin,
  Stethoscope
} from 'lucide-react';
import { addReminder, deleteReminder, updateReminderStatus, addAppointment, deleteAppointment } from '../utils/mockData';

export default function Reminders({ user, reminders, appointments, refreshData, triggerToast }) {
  // Medicine form states
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [medTime, setMedTime] = useState('08:00');
  
  // Appointment form states
  const [docName, setDocName] = useState('');
  const [apptDate, setApptDate] = useState('');
  const [apptTime, setApptTime] = useState('10:00');
  const [apptLoc, setApptLoc] = useState('');

  // Handle adding a medicine reminder
  const handleAddMed = (e) => {
    e.preventDefault();
    if (!medName || !dosage || !medTime) return;

    addReminder(user.id, medName, dosage, medTime);
    setMedName('');
    setDosage('');
    refreshData();
    triggerToast(`Medication reminder added for ${medName} at ${medTime}`);
  };

  // Handle adding a doctor appointment
  const handleAddAppt = (e) => {
    e.preventDefault();
    if (!docName || !apptDate || !apptTime) return;

    addAppointment(user.id, docName, apptDate, apptTime, apptLoc);
    setDocName('');
    setApptDate('');
    setApptLoc('');
    refreshData();
    triggerToast(`Appointment scheduled with Dr. ${docName} on ${apptDate}`);
  };

  // Action handlers
  const handleUpdateStatus = (remId, status) => {
    updateReminderStatus(user.id, remId, status);
    refreshData();
    triggerToast(`Medication marked as ${status}`);
  };

  const handleDeleteMed = (remId) => {
    deleteReminder(user.id, remId);
    refreshData();
  };

  const handleDeleteAppt = (apptId) => {
    deleteAppointment(user.id, apptId);
    refreshData();
  };

  // Quick reminder simulator for presentation/test purposes
  const handleSimulateAlert = () => {
    triggerToast("⏳ Test reminder armed. Alert will trigger in 5 seconds...", "info");
    setTimeout(() => {
      // Direct notification alert
      triggerToast(`🔔 REMINDER: Time to take your medication! Dosage instructions active.`, "alert");
      
      // Native audio beep if supported
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        oscillator.start();
        setTimeout(() => oscillator.stop(), 300);
      } catch (e) {
        console.log("AudioContext failed or blocked by browser policy");
      }
    }, 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Reminders Scheduler</h1>
          <p className="page-subtitle">Set schedules for daily medicines or schedule upcoming doctor appointments.</p>
        </div>
        <button className="btn btn-secondary" onClick={handleSimulateAlert} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={16} /> Test 5s Alert
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px'
      }}>
        
        {/* SECTION 1: MEDICINE REMINDERS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} color="var(--primary-blue)" /> Add Medicine Reminder
            </h3>
            
            <form onSubmit={handleAddMed}>
              <div className="form-group">
                <label className="form-label">Medicine Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Paracetamol, Aspirin"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Dosage</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. 1 pill, 5ml"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Reminder Time</label>
                  <input 
                    type="time" 
                    className="form-input" 
                    value={medTime}
                    onChange={(e) => setMedTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                <Plus size={16} /> Add Reminder
              </button>
            </form>
          </div>

          <div className="glass-panel" style={{ padding: '24px', flexGrow: 1 }}>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              Active Medications
            </h3>

            {reminders.length === 0 ? (
              <p style={{ color: 'var(--text-light)', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>
                No medicine reminders active. Add one above.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {reminders.map((rem) => (
                  <div key={rem.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: rem.status === 'Taken' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${rem.status === 'Taken' ? 'rgba(16, 185, 129, 0.2)' : 'var(--border-subtle)'}`
                  }}>
                    <div style={{ overflow: 'hidden' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', textDecoration: rem.status === 'Taken' ? 'line-through' : 'none', color: rem.status === 'Taken' ? 'var(--text-body)' : 'var(--text-heading)' }}>
                        {rem.medicineName}
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-body)' }}>
                        {rem.dosage} at <strong>{rem.time}</strong> • <span style={{ 
                          fontWeight: '600',
                          color: rem.status === 'Taken' ? 'var(--accent-emerald)' : rem.status === 'Skipped' ? 'var(--accent-error)' : 'var(--accent-warning)'
                        }}>{rem.status}</span>
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      {rem.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(rem.id, 'Taken')}
                            style={{ padding: '6px', borderRadius: '50%', border: '1px solid rgba(16, 185, 129, 0.2)', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)', cursor: 'pointer' }}
                            title="Mark Taken"
                          >
                            <Check size={14} />
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(rem.id, 'Skipped')}
                            style={{ padding: '6px', borderRadius: '50%', border: '1px solid rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-error)', cursor: 'pointer' }}
                            title="Skip Medicine"
                          >
                            <X size={14} />
                          </button>
                        </>
                      )}
                      
                      <button 
                        onClick={() => handleDeleteMed(rem.id)}
                        style={{ padding: '6px', borderRadius: '50%', border: '1px solid var(--border-subtle)', backgroundColor: 'transparent', color: 'var(--text-light)', cursor: 'pointer' }}
                        title="Delete Reminder"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: DOCTOR APPOINTMENTS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Stethoscope size={20} color="var(--primary-blue)" /> Schedule Doctor Appointment
            </h3>
            
            <form onSubmit={handleAddAppt}>
              <div className="form-group">
                <label className="form-label">Doctor's Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Dr. Jane Smith"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={apptDate}
                    onChange={(e) => setApptDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input 
                    type="time" 
                    className="form-input" 
                    value={apptTime}
                    onChange={(e) => setApptTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Clinic Location (Optional)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. City Hospital, Room 302"
                  value={apptLoc}
                  onChange={(e) => setApptLoc(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', background: 'linear-gradient(135deg, var(--primary-blue), var(--primary-blue))' }}>
                <Plus size={16} /> Schedule
              </button>
            </form>
          </div>

          <div className="glass-panel" style={{ padding: '24px', flexGrow: 1 }}>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              Upcoming Visits
            </h3>

            {appointments.length === 0 ? (
              <p style={{ color: 'var(--text-light)', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>
                No appointments scheduled. Add one above.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {appointments.map((appt) => (
                  <div key={appt.id} style={{
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Stethoscope size={14} color="var(--primary-blue)" /> Dr. {appt.doctorName}
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-body)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CalendarDays size={12} /> {appt.date} at {appt.time}
                      </p>
                      {appt.location && (
                        <p style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} /> {appt.location}
                        </p>
                      )}
                    </div>

                    <button 
                      onClick={() => handleDeleteAppt(appt.id)}
                      style={{ padding: '6px', borderRadius: '50%', border: '1px solid var(--border-subtle)', backgroundColor: 'transparent', color: 'var(--text-light)', cursor: 'pointer' }}
                      title="Cancel Appointment"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
