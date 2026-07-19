import React, { useState } from 'react';
import { 
  User, 
  Save, 
  Trash2, 
  AlertTriangle,
  Lock,
  UserCheck
} from 'lucide-react';
import { updateUserProfile } from '../utils/mockData';

export default function Profile({ user, onProfileUpdate, onLogout, triggerToast }) {
  const [age, setAge] = useState(user.profile?.age || '');
  const [gender, setGender] = useState(user.profile?.gender || '');
  const [allergies, setAllergies] = useState(user.profile?.allergies || '');
  const [meds, setMeds] = useState(user.profile?.currentMedications || '');
  
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    try {
      const updatedUser = updateUserProfile(user.id, {
        age,
        gender,
        allergies,
        currentMedications: meds
      });
      onProfileUpdate(updatedUser);
      setIsEditing(false);
      triggerToast("Medical profile updated successfully.");
    } catch (err) {
      triggerToast(err.message || "Error updating profile", "error");
    }
  };

  const handleDeleteAllData = () => {
    // Purge everything from localStorage
    localStorage.clear();
    triggerToast("⚠️ All personal data completely deleted from storage.");
    // Force logout/reload
    onLogout();
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      
      <div className="page-header" style={{ marginBottom: '28px' }}>
        <h1 className="page-title">Personal Health Profile</h1>
        <p className="page-subtitle">Manage details that MedBot uses to personalize health guidance.</p>
      </div>

      <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="user-avatar" style={{ width: '48px', height: '48px', fontSize: '18px' }}>
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <h3 style={{ fontWeight: '700', fontSize: '16px' }}>{user.name}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-body)' }}>{user.email}</p>
            </div>
          </div>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => setIsEditing(!isEditing)}
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Age (Years)</label>
              <input 
                type="number" 
                className="form-input" 
                placeholder="e.g. 45"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select 
                className="form-input" 
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                disabled={!isEditing}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Known Allergies</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Penicillin, Peanuts (or 'None')"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              disabled={!isEditing}
            />
            <p style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '4px' }}>
              Separated by commas. MedBot checks these before giving medication advice.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Ongoing Medications / Medical Conditions</label>
            <textarea 
              className="form-input" 
              rows="3"
              placeholder="e.g. Aspirin 81mg daily, Asthma (optional)"
              value={meds}
              onChange={(e) => setMeds(e.target.value)}
              disabled={!isEditing}
              style={{ resize: 'none' }}
            />
          </div>

          {isEditing && (
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyAlignment: 'center', gap: '8px' }}>
              <Save size={16} /> Save Changes
            </button>
          )}
        </form>
      </div>

      {/* Account Deletion and Compliance Panel */}
      <div className="glass-panel" style={{ padding: '24px', marginTop: '28px', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
        <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-error)' }}>
          <Lock size={18} /> Privacy & Compliance Actions
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-body)', margin: '8px 0 16px 0' }}>
          Under data protection standards, you have the right to request deletion of all chat histories, profile facts, and reminder files.
        </p>

        {!showDeleteConfirm ? (
          <button 
            onClick={() => setShowDeleteConfirm(true)} 
            className="btn btn-secondary" 
            style={{ color: 'var(--accent-error)', borderColor: 'rgba(239, 68, 68, 0.2)', padding: '8px 16px', fontSize: '13px' }}
          >
            <Trash2 size={14} /> Purge Personal Account Data
          </button>
        ) : (
          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <p style={{ fontSize: '12px', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={16} color="var(--accent-error)" />
              <strong>Warning:</strong> This will delete your reminders, login credentials, and clinical history permanently.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleDeleteAllData} className="btn btn-danger" style={{ padding: '8px 16px', fontSize: '12px' }}>
                Confirm Permanent Deletion
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '12px' }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
