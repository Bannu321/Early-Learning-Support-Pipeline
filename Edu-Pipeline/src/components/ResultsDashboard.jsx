
import React from 'react';

const ResultsDashboard = ({ data, onReset }) => {
  
  // Dynamic color for the badge based on risk
  const getBadgeColor = (level) => {
    if (level === 'High') return 'var(--risk-high)';
    if (level === 'Medium') return 'var(--risk-med)';
    return 'var(--risk-low)';
  };

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Support Summary</h2>
          <span style={{ 
            backgroundColor: getBadgeColor(data.riskLevel), 
            color: 'white', 
            padding: '6px 16px', 
            borderRadius: '20px', 
            fontWeight: 'bold' 
          }}>
            Risk: {data.riskLevel}
          </span>
        </div>
        
        <p style={{ fontSize: '1.1rem', marginBottom: '30px' }}>{data.summary}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
            {/* Strategy Section */}
            <div style={{ background: '#F8F9FA', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ color: 'var(--primary)', marginTop: 0 }}>Actionable Strategies</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
                {/* SAFETY FIX: Added '|| []' */}
                {(data.strategies || []).map((item, index) => (
                <li key={index}>{item}</li>
                ))}
            </ul>
            </div>

            {/* Resources Section */}
            <div style={{ background: '#F8F9FA', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ color: 'var(--primary)', marginTop: 0 }}>Recommended Resources</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
                {/* SAFETY FIX: Added '|| []' */}
                {(data.resources || []).map((item, index) => (
                <li key={index}>{item}</li>
                ))}
            </ul>
            </div>
        
        </div>

        <button 
          className="btn btn-secondary" 
          style={{ marginTop: '30px' }} 
          onClick={onReset}
        >
          Start New Assessment
        </button>
      </div>
    </div>
  );
};

export default ResultsDashboard;