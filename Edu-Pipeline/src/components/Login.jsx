import React, { useState } from 'react';
import { API_BASE } from '../data/api';

const Login = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [role, setRole] = useState('teacher'); // 'teacher' or 'ngo'
  const [form, setForm] = useState({ username: '', password: '' });

  const handleLogin = async () => {
    // Select the correct endpoint based on role
    const endpoint = role === 'teacher' 
      ? `${API_BASE}/auth/login` 
      : `${API_BASE}/auth/ngo/login`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    
    // Check for success keys (teacherCode for Teachers, role='ngo' for NGOs)
    if (data.teacherCode || data.role === 'ngo') {
      onLoginSuccess({ ...data, role }); // Pass role up to App
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '400px' }}>
      
      {/* Role Toggle */}
      <div style={{ display: 'flex', marginBottom: '20px', background: '#f0f0f0', borderRadius: '8px', padding: '4px' }}>
        <button 
          style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: role === 'teacher' ? 'white' : 'transparent', fontWeight: role === 'teacher' ? 'bold' : 'normal', cursor: 'pointer', boxShadow: role === 'teacher' ? '0 2px 5px rgba(0,0,0,0.1)' : 'none' }}
          onClick={() => setRole('teacher')}
        >
          Teacher
        </button>
        <button 
          style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: role === 'ngo' ? 'white' : 'transparent', fontWeight: role === 'ngo' ? 'bold' : 'normal', cursor: 'pointer', boxShadow: role === 'ngo' ? '0 2px 5px rgba(0,0,0,0.1)' : 'none' }}
          onClick={() => setRole('ngo')}
        >
          NGO Admin
        </button>
      </div>

      <h2>{role === 'teacher' ? 'Teacher Login' : 'NGO Portal Login'}</h2>
      
      <div className="mb-20">
        <label>Username</label>
        <input className="input-field" onChange={(e) => setForm({ ...form, username: e.target.value })} />
      </div>
      <div className="mb-40">
        <label>Password</label>
        <input type="password" className="input-field" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      </div>
      
      <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleLogin}>
        {role === 'teacher' ? 'Login to Class' : 'Access Dashboard'}
      </button>

      {role === 'teacher' && (
        <p style={{ marginTop: '20px', textAlign: 'center', cursor: 'pointer', color: 'var(--primary)' }} onClick={onSwitchToRegister}>
          New Teacher? Create Account
        </p>
      )}
      
      {/* Optional: NGO Registration Link */}
      {role === 'ngo' && (
        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#888' }}>
          Restricted Access. Contact Admin for NGO account.
        </p>
      )}
    </div>
  );
};

export default Login;