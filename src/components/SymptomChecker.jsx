import React, { useState } from 'react';
import { 
  Activity, 
  ChevronRight, 
  ChevronLeft, 
  AlertTriangle, 
  Info,
  RefreshCw,
  PhoneCall,
  CalendarDays
} from 'lucide-react';

const SYMPTOMS_CATALOG = [
  { id: 'headache', name: 'Headache', type: 'common' },
  { id: 'fever', name: 'Fever / High Temp', type: 'common' },
  { id: 'cough', name: 'Cough', type: 'common' },
  { id: 'sore_throat', name: 'Sore Throat', type: 'common' },
  { id: 'stomach_ache', name: 'Stomach Ache', type: 'common' },
  { id: 'nausea', name: 'Nausea / Vomiting', type: 'common' },
  { id: 'rash', name: 'Skin Rash / Itch', type: 'common' },
  { id: 'fatigue', name: 'Extreme Fatigue', type: 'common' },
  // Emergency symptoms
  { id: 'chest_pain', name: 'Chest Pain', type: 'emergency' },
  { id: 'breathing_difficulty', name: 'Difficulty Breathing', type: 'emergency' },
  { id: 'numbness', name: 'Sudden Weakness / Numbness', type: 'emergency' }
];

export default function SymptomChecker({ setScreen }) {
  const [step, setStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [duration, setDuration] = useState('1-3 days');
  const [severity, setSeverity] = useState('moderate'); // mild, moderate, severe

  const toggleSymptom = (id) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(prev => prev.filter(item => item !== id));
    } else {
      setSelectedSymptoms(prev => [...prev, id]);
    }
  };

  const handleNext = () => {
    // Check if emergency symptoms are selected
    const hasEmergency = selectedSymptoms.some(id => {
      const sym = SYMPTOMS_CATALOG.find(s => s.id === id);
      return sym && sym.type === 'emergency';
    });

    if (hasEmergency) {
      setStep(4); // Skip to Emergency Guidance screen
    } else {
      setStep(prev => prev + 1);
    }
  };

  const resetChecker = () => {
    setSelectedSymptoms([]);
    setDuration('1-3 days');
    setSeverity('moderate');
    setStep(1);
  };

  const generateReport = () => {
    const hasEmergency = selectedSymptoms.some(id => {
      const sym = SYMPTOMS_CATALOG.find(s => s.id === id);
      return sym && sym.type === 'emergency';
    });

    if (hasEmergency) {
      return {
        level: 'emergency',
        title: 'Immediate Medical Action Required',
        statusColor: 'var(--accent-error)',
        summary: 'You have indicated symptoms that can represent a serious medical emergency (e.g. chest pain, difficulty breathing, or sudden weakness). Do not wait to see if they pass.',
        actions: [
          'Call your local emergency services (like 911) immediately.',
          'Have someone stay with you if possible.',
          'Do not drive yourself to the emergency room; wait for an ambulance.'
        ]
      };
    }

    if (severity === 'severe' || duration === 'more than a week') {
      return {
        level: 'doctor',
        title: 'Schedule a Doctor Appointment',
        statusColor: 'var(--accent-warning)',
        summary: 'Based on the severe intensity or prolonged duration of your symptoms, we highly recommend consulting a healthcare professional for a physical exam and diagnosis.',
        actions: [
          'Contact your primary care clinic to book an appointment.',
          'Write down a list of symptoms and when they started to share with your doctor.',
          'If symptoms worsen rapidly, visit an urgent care center.'
        ]
      };
    }

    return {
      level: 'home_care',
      title: 'Home Recovery & Monitoring',
      statusColor: 'var(--accent-emerald)',
      summary: 'Your symptoms appear to be mild-to-moderate and of short duration. You can generally manage these symptoms at home with self-care and close monitoring.',
      actions: [
        'Get plenty of physical rest and stay hydrated.',
        'Consider over-the-counter remedies for symptom relief after consulting a pharmacist.',
        'Monitor your temperature and symptoms daily; seek medical care if they worsen or do not improve in 3 days.'
      ]
    };
  };

  const report = generateReport();

  return (
    <div className="glass-panel" style={{ padding: '32px', maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
        <Activity size={28} color="var(--primary-blue)" />
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '22px', fontWeight: '700' }}>Symptom Checker</h2>
      </div>

      {/* Steps Indicator */}
      {step < 4 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          <div style={{ flexGrow: 1, height: '4px', borderRadius: '2px', backgroundColor: step >= 1 ? 'var(--primary-blue)' : 'var(--bg-alt)' }} />
          <div style={{ flexGrow: 1, height: '4px', borderRadius: '2px', backgroundColor: step >= 2 ? 'var(--primary-blue)' : 'var(--bg-alt)' }} />
          <div style={{ flexGrow: 1, height: '4px', borderRadius: '2px', backgroundColor: step >= 3 ? 'var(--primary-blue)' : 'var(--bg-alt)' }} />
        </div>
      )}

      {/* Step 1: Select Symptoms */}
      {step === 1 && (
        <div>
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
            What symptoms are you experiencing?
          </h3>
          <p style={{ color: 'var(--text-body)', fontSize: '13px', marginBottom: '20px' }}>
            Select all that apply. Select emergency symptoms if you are experiencing any chest pressure or severe breathing issues.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '28px'
          }}>
            {SYMPTOMS_CATALOG.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom.id);
              const isEmerg = symptom.type === 'emergency';
              return (
                <div 
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: isSelected ? 'rgba(91, 124, 250, 0.1)' : 'rgba(0, 0, 0, 0.03)',
                    border: `1px solid ${isSelected ? 'var(--primary-blue)' : isEmerg ? 'rgba(239, 68, 68, 0.2)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '80px'
                  }}
                >
                  <span style={{ fontSize: '14px', fontWeight: '500', color: isSelected ? 'white' : 'var(--text-heading)' }}>
                    {symptom.name}
                  </span>
                  {isEmerg && (
                    <span style={{ fontSize: '10px', color: 'var(--accent-error)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '8px' }}>
                      <AlertTriangle size={10} /> Emergency
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              className="btn btn-primary"
              disabled={selectedSymptoms.length === 0}
              onClick={handleNext}
            >
              Continue <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Duration & Severity */}
      {step === 2 && (
        <div>
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
            Tell us more about your symptoms
          </h3>

          <div className="form-group">
            <label className="form-label">How long have you had these symptoms?</label>
            <select 
              className="form-input"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="less than a day">Less than a day</option>
              <option value="1-3 days">1 to 3 days</option>
              <option value="4-7 days">4 to 7 days</option>
              <option value="more than a week">More than a week</option>
            </select>
          </div>

          <div className="form-group" style={{ marginTop: '24px', marginBottom: '32px' }}>
            <label className="form-label">How severe are the symptoms?</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['mild', 'moderate', 'severe'].map((level) => {
                const isActive = severity === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSeverity(level)}
                    className="btn"
                    style={{
                      flexGrow: 1,
                      textTransform: 'capitalize',
                      backgroundColor: isActive 
                        ? level === 'severe' ? 'rgba(239, 68, 68, 0.15)' : level === 'moderate' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)'
                        : 'rgba(255,255,255,0.03)',
                      color: isActive 
                        ? level === 'severe' ? 'var(--accent-error)' : level === 'moderate' ? 'var(--accent-warning)' : 'var(--accent-emerald)'
                        : 'var(--text-body)',
                      border: `1px solid ${isActive 
                        ? level === 'severe' ? 'var(--accent-error)' : level === 'moderate' ? 'var(--accent-warning)' : 'var(--accent-emerald)'
                        : 'var(--border-subtle)'}`
                    }}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)}>
              <ChevronLeft size={16} /> Back
            </button>
            <button className="btn btn-primary" onClick={handleNext}>
              View Guidance <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3 & 4: Output / Recommendations */}
      {(step === 3 || step === 4) && (
        <div>
          <div style={{
            padding: '24px',
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderLeft: `4px solid ${report.statusColor}`,
            marginBottom: '28px'
          }}>
            <h3 style={{ 
              fontFamily: 'var(--font-title)', 
              fontSize: '18px', 
              fontWeight: '700', 
              color: report.statusColor,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px'
            }}>
              {report.level === 'emergency' ? <AlertTriangle size={20} /> : <Info size={20} />}
              {report.title}
            </h3>
            
            <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
              {report.summary}
            </p>

            <h4 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', tracking: '0.05em', color: 'var(--text-body)', marginBottom: '10px' }}>
              Recommended Next Steps:
            </h4>
            <ul style={{ paddingLeft: '20px', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {report.actions.map((act, idx) => (
                <li key={idx} style={{ color: 'var(--text-heading)' }}>{act}</li>
              ))}
            </ul>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '20px'
          }}>
            <button className="btn btn-secondary" onClick={resetChecker}>
              <RefreshCw size={14} /> Start Over
            </button>

            <div style={{ display: 'flex', gap: '12px' }}>
              {report.level === 'emergency' ? (
                <button className="btn btn-danger" onClick={() => setScreen('emergency')}>
                  <PhoneCall size={16} /> Urgent Emergency Call
                </button>
              ) : (
                <>
                  <button className="btn btn-primary" onClick={() => setScreen('reminders')}>
                    <CalendarDays size={16} /> Schedule Clinic Visit
                  </button>
                  <button className="btn btn-secondary" onClick={() => setScreen('chat')}>
                    Ask MedBot Chat
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
