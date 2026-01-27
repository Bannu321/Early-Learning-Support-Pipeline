import React, { useState } from 'react';
import { API_BASE } from '../data/api'; // Deployment-ready URL

const AssessmentModal = ({ data, onClose, onActionTaken }) => {
  const [actionType, setActionType] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleActionSubmit = async () => {
    if (!actionType) return alert("Select an action");
    setSubmitting(true);

    try {
      // Uses the centralized API URL
      const res = await fetch(`${API_BASE}/ngo/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          observationId: data._id,
          actionType,
          note
        })
      });
      const result = await res.json();
      onActionTaken(result.data); // Refresh the dashboard data
      alert("Action Logged Successfully");
      onClose(); // Close modal
    } catch (err) {
      alert("Failed to log action");
      console.error(err);
    }
    setSubmitting(false);
  };

  // Helper component for the colored progress bars
  const CategoryBar = ({ label, score }) => (
    <div style={{ marginBottom: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '5px' }}>
        <strong>{label}</strong>
        <span>{score}/15</span>
      </div>
      <div style={{ width: '100%', background: '#eee', height: '8px', borderRadius: '4px' }}>
        <div style={{ 
          width: `${(score/15)*100}%`, 
          background: score > 10 ? 'var(--risk-high)' : 'var(--primary)', 
          height: '100%', borderRadius: '4px' 
        }}></div>
      </div>
    </div>
  );

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div className="glass-card" style={{ width: '800px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', background: 'white' }}>
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: 20, right: 20, border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
        >
          &times;
        </button>
        
        {/* Header */}
        <div style={{ borderBottom: '2px solid #eee', paddingBottom: '20px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Case File: {data.studentName}</h2>
          <p style={{ color: '#888', margin: '5px 0' }}>Teacher ID: {data.teacherId} | Grade: {data.grade}</p>
          <span style={{ 
            background: data.riskLevel === 'High' ? 'var(--risk-high)' : 'var(--risk-low)', 
            color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '0.85rem' 
          }}>
            Risk Analysis: {data.riskLevel}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          
          {/* Left Column: Analysis & Scores */}
          <div>
            <h3 style={{ color: 'var(--primary)' }}>Clinical Summary</h3>
            <p style={{ lineHeight: '1.6', fontSize: '0.95rem', background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
              {data.detailedAnalysis || "No detailed analysis available for this record."}
            </p>

            <h4 style={{ marginTop: '20px' }}>Category Breakdown</h4>
            {data.categoryScores ? (
              <>
                <CategoryBar label="Attention & Focus" score={data.categoryScores.focus} />
                <CategoryBar label="Social & Communication" score={data.categoryScores.social} />
                <CategoryBar label="Academic Skills" score={data.categoryScores.academic} />
                <CategoryBar label="Emotional Regulation" score={data.categoryScores.emotional} />
              </>
            ) : <p style={{color:'#999'}}>Detailed category scores not found.</p>}
          </div>

          {/* Right Column: NGO Actions */}
          <div>
            <h3 style={{ color: 'var(--primary)' }}>Intervention Hub</h3>
            
            {/* Action Form */}
            <div style={{ background: '#fff9f0', padding: '20px', borderRadius: '12px', border: '1px solid #ffeebb' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px' }}>Log New Action</label>
              
              <select 
                style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ddd' }}
                value={actionType}
                onChange={e => setActionType(e.target.value)}
              >
                <option value="">-- Select Support Action --</option>
                <option value="Funds Allocated">💰 Funds Allocated</option>
                <option value="Tutor Dispatched">👩‍🏫 Professional Tutor Sent</option>
                <option value="Manual Sent">📘 Training Manual Sent</option>
                <option value="Medical Referral">🏥 Medical Referral Issued</option>
              </select>

              <textarea 
                placeholder="Add notes (e.g., Amount allocated, Name of tutor...)"
                style={{ width: '100%', padding: '10px', height: '80px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ddd', fontFamily: 'inherit' }}
                value={note}
                onChange={e => setNote(e.target.value)}
              />

              <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleActionSubmit} disabled={submitting}>
                {submitting ? "Logging..." : "Confirm Action"}
              </button>
            </div>

            {/* History List */}
            <h4 style={{ marginTop: '30px' }}>Action History</h4>
            {data.ngoActions && data.ngoActions.length > 0 ? (
              <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', maxHeight:'200px', overflowY:'auto' }}>
                {data.ngoActions.map((action, i) => (
                  <li key={i} style={{ marginBottom: '10px' }}>
                    <strong>{action.actionType}</strong><br/>
                    <span style={{ color: '#666' }}>{action.note}</span><br/>
                    <span style={{ fontSize: '0.8rem', color: '#aaa' }}>
                      {action.timestamp ? new Date(action.timestamp).toLocaleDateString() : 'Just now'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : <p style={{ color: '#aaa', fontStyle: 'italic' }}>No actions taken yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentModal;