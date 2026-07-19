import React, { useState } from 'react';
import { 
  PhoneCall, 
  MapPin, 
  AlertOctagon, 
  Clock, 
  Navigation,
  Activity,
  Check
} from 'lucide-react';

const STATIC_HOSPITALS = [
  {
    name: "Mercy General Hospital (ER)",
    distanceBase: 1.2,
    phone: "(555) 019-8234",
    hours: "Open 24/7",
    address: "742 Evergreen Terrace, Sector 7G"
  },
  {
    name: "St. Luke University Medical Center",
    distanceBase: 2.7,
    phone: "(555) 014-5566",
    hours: "Open 24/7",
    address: "1200 College Heights Blvd"
  },
  {
    name: "Valley Health Urgent Care Clinic",
    distanceBase: 4.5,
    phone: "(555) 018-9911",
    hours: "8:00 AM - 10:00 PM",
    address: "310 Valley View Plaza"
  }
];

export default function Emergency({ triggerToast }) {
  const [zipCode, setZipCode] = useState('');
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [simulatedHospitals, setSimulatedHospitals] = useState(STATIC_HOSPITALS);

  const requestLocation = () => {
    triggerToast("Requesting GPS coordinates...", "info");
    setTimeout(() => {
      setHasLocationPermission(true);
      triggerToast("Mock GPS coordinates detected: 40.7128° N, 74.0060° W");
    }, 1000);
  };

  const handleZipSearch = (e) => {
    e.preventDefault();
    if (!zipCode.trim()) return;

    // Simulate recalculating distances based on Zip
    const seed = zipCode.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const newHospitals = STATIC_HOSPITALS.map((h, i) => {
      const offset = ((seed * (i + 1)) % 30) / 10;
      return {
        ...h,
        distanceBase: parseFloat((0.5 + offset).toFixed(1))
      };
    }).sort((a, b) => a.distanceBase - b.distanceBase);

    setSimulatedHospitals(newHospitals);
    triggerToast(`Distances calculated for area code: ${zipCode}`);
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Red Alert Header */}
      <div className="glass-panel" style={{
        padding: '32px',
        border: '2px solid #EF4444',
        background: '#FFFFFF',
        textAlign: 'center',
        borderRadius: '16px'
      }}>
        <AlertOctagon size={48} color="#DC2626" style={{ display: 'inline', marginBottom: '16px' }} />
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '24px', fontWeight: '800', color: '#DC2626', marginBottom: '12px' }}>
          Life-Threatening Emergency?
        </h2>
        <p style={{ fontSize: '15px', fontWeight: '600', color: '#374151', maxWidth: '580px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
          If you are experiencing chest pain, severe breathing difficulty, sudden speech loss, or major bleeding, please do not use this app. Call your local emergency helpline immediately.
        </p>

        <a 
          href="tel:911" 
          className="btn btn-danger" 
          style={{ padding: '16px 36px', fontSize: '18px', display: 'inline-flex', alignItems: 'center', gap: '12px', backgroundColor: '#EF4444', color: '#FFFFFF' }}
          onClick={(e) => {
            e.preventDefault();
            triggerToast("Simulating outgoing emergency phone call to 911...");
          }}
        >
          <PhoneCall size={22} /> Call Emergency (911)
        </a>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        
        {/* Helpline cards */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            National Support Hotlines
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-body)', fontWeight: '700' }}>POISON CONTROL HELPLINE</span>
              <p style={{ fontWeight: '700', fontSize: '15px', color: 'var(--primary-blue)', margin: '4px 0' }}>1-800-222-1222</p>
              <p style={{ fontSize: '11px', color: 'var(--text-light)' }}>Free, confidential medical advice for ingestion/poison exposure.</p>
            </div>

            <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-body)', fontWeight: '700' }}>MENTAL HEALTH CRISIS LINE</span>
              <p style={{ fontWeight: '700', fontSize: '15px', color: 'var(--primary-blue)', margin: '4px 0' }}>988 Suicide & Crisis Lifeline</p>
              <p style={{ fontSize: '11px', color: 'var(--text-light)' }}>Available 24/7 via call or text for crisis counselling support.</p>
            </div>
          </div>
        </div>

        {/* Nearby hospitals locator */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
            Find Nearest Clinics & ER
          </h3>

          {!hasLocationPermission ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-body)', marginBottom: '16px' }}>
                Allow location permission to automatically measure the closest hospital distances.
              </p>
              <button className="btn btn-secondary" onClick={requestLocation} style={{ width: '100%' }}>
                <Navigation size={14} /> Detect My Location
              </button>
              
              <div style={{ margin: '16px 0', fontSize: '12px', color: 'var(--text-light)' }}>- OR ENTER MANUALLY -</div>

              <form onSubmit={handleZipSearch} style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter Zip Code" 
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  style={{ flexGrow: 1 }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '12px' }} disabled={!zipCode}>
                  Go
                </button>
              </form>
            </div>
          ) : (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                marginBottom: '16px',
                fontSize: '12px',
                color: 'var(--accent-emerald)'
              }}>
                <Check size={14} /> GPS Location Connected (40.7128° N)
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {simulatedHospitals.map((hospital, idx) => (
                  <div key={idx} style={{
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '13px', fontWeight: '700' }}>{hospital.name}</h4>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary-blue)' }}>
                        {hospital.distanceBase} mi
                      </span>
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--text-body)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={10} /> {hospital.address}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '11px' }}>
                      <span style={{ color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={10} /> {hospital.hours}
                      </span>
                      <a href={`tel:${hospital.phone}`} style={{ color: 'var(--primary-blue)', textDecoration: 'none', fontWeight: '600' }}>
                        {hospital.phone}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
