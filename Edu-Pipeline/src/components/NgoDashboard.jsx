import React, { useEffect, useState } from 'react';
import { getSchoolStats } from '../data/api';

const NgoDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safety check: ensure the function exists before calling
    if (getSchoolStats) {
      getSchoolStats().then(res => {
        setData(res || []); // Safety: Ensure we never set null
        setLoading(false);
      });
    } else {
      console.error("getSchoolStats function is missing from API!");
      setLoading(false);
    }
  }, []);

  const getRiskColor = (level) => {
    if (level === 'High') return 'var(--risk-high)';
    if (level === 'Medium') return 'var(--risk-med)';
    return 'var(--risk-low)';
  };

  if (loading) return <div className="center-text mt-40">Loading NGO Data...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>NGO Monitoring Dashboard</h2>
        <div style={{ background: 'white', padding: '10px 20px', borderRadius: '50px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <strong>Total Cases: {data.length}</strong>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <StatCard label="High Risk" count={data.filter(x=>x.riskLevel==='High').length} color="var(--risk-high)" />
        <StatCard label="Medium Risk" count={data.filter(x=>x.riskLevel==='Medium').length} color="var(--risk-med)" />
        <StatCard label="Low Risk" count={data.filter(x=>x.riskLevel==='Low').length} color="var(--risk-low)" />
      </div>

      {/* Data Table */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8f9fa', borderBottom: '2px solid #eee' }}>
            <tr>
              <th style={{ padding: '15px' }}>Date</th>
              <th style={{ padding: '15px' }}>Teacher ID</th>
              <th style={{ padding: '15px' }}>Student</th>
              <th style={{ padding: '15px' }}>Risk Level</th>
              <th style={{ padding: '15px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: '#888' }}>
                  No data found in the system yet.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row._id || Math.random()} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px', color: '#666' }}>
                    {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td style={{ padding: '15px', fontWeight: 'bold', color: 'var(--primary)' }}>
                    {row.teacherId || "Guest"}
                  </td>
                  <td style={{ padding: '15px' }}>
                    {row.studentName} <br/>
                    <span style={{fontSize:'0.8rem', color:'#888'}}>({row.studentId})</span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ 
                      color: getRiskColor(row.riskLevel), 
                      fontWeight: 'bold',
                      background: `${getRiskColor(row.riskLevel)}20`, 
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.85rem'
                    }}>
                      {row.riskLevel}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <button className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper Component for the Cards
const StatCard = ({ label, count, color }) => (
  <div style={{ background: 'white', padding: '20px', borderRadius: '12px', borderLeft: `5px solid ${color}`, boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
    <div style={{ color: '#888', fontSize: '0.9rem' }}>{label}</div>
    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: color }}>{count}</div>
  </div>
);

export default NgoDashboard;