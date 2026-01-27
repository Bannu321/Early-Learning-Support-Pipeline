import React, { useEffect, useState } from 'react';
import { getTeacherHistory } from '../data/api'; // Ensure path is correct

const TeacherDashboard = ({ user, onNewAssessment }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data using the logged-in teacher's code
    getTeacherHistory(user.teacherCode).then(data => {
      setStudents(data);
      setLoading(false);
    });
  }, [user.teacherCode]);

  const getRiskColor = (level) => {
    if (level === 'High') return 'var(--risk-high)';
    if (level === 'Medium') return 'var(--risk-med)';
    return 'var(--risk-low)';
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '5px' }}>My Classroom</h1>
          <p style={{ color: 'var(--text-muted)' }}>School: {user.schoolName}</p>
        </div>
        <button className="btn btn-primary" onClick={onNewAssessment}>
          + New Assessment
        </button>
      </div>

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '40px' }}>
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '2.5rem', margin: '0 0 5px 0', color: 'var(--primary)' }}>{students.length}</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>Total Students</p>
        </div>
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '2.5rem', margin: '0 0 5px 0', color: 'var(--risk-high)' }}>
            {students.filter(s => s.riskLevel === 'High').length}
          </h3>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>Action Needed</p>
        </div>
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '2.5rem', margin: '0 0 5px 0', color: 'var(--risk-low)' }}>
            {students.filter(s => s.riskLevel === 'Low').length}
          </h3>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>On Track</p>
        </div>
      </div>

      {/* Student List */}
      <h3 style={{ marginBottom: '20px' }}>Recent Assessments</h3>
      
      {loading ? (
        <div className="center-text">Loading classroom data...</div>
      ) : students.length === 0 ? (
        <div className="glass-card center-text">
          <p>No students assessed yet.</p>
          <button className="btn btn-secondary" onClick={onNewAssessment}>Start First Assessment</button>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f9f9f9', borderBottom: '2px solid #eee' }}>
              <tr>
                <th style={{ padding: '15px' }}>Student Name</th>
                <th style={{ padding: '15px' }}>Grade</th>
                <th style={{ padding: '15px' }}>Risk Level</th>
                <th style={{ padding: '15px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px', fontWeight: '600' }}>{student.studentName}</td>
                  <td style={{ padding: '15px' }}>{student.grade}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ 
                      color: getRiskColor(student.riskLevel),
                      background: `${getRiskColor(student.riskLevel)}15`,
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      fontSize: '0.85rem'
                    }}>
                      {student.riskLevel}
                    </span>
                  </td>
                  <td style={{ padding: '15px', color: '#888' }}>
                    {new Date(student.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;