import React, { useState } from 'react';

const Register = ({ onSwitchToLogin }) => {
  const [form, setForm] = useState({ username: '', password: '', schoolName: '', area: '' });
  const [generatedCode, setGeneratedCode] = useState(null);

  const handleRegister = async () => {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    
    if (data.success) {
      setGeneratedCode(data.teacherCode);
    } else {
      alert(data.error);
    }
  };

  if (generatedCode) return (
    <div className="glass-card center-text">
      <h2 style={{color:'var(--risk-low)'}}>Registration Successful!</h2>
      <p>Your Unique Teacher Code is:</p>
      <div style={{fontSize:'2.5rem', fontWeight:'bold', margin:'20px 0', color:'var(--primary)'}}>
        {generatedCode}
      </div>
      <p style={{color:'var(--text-muted)'}}>Please write this down. It will be used to sign your reports.</p>
      <button className="btn btn-primary" onClick={onSwitchToLogin}>Go to Login</button>
    </div>
  );

  return (
    <div className="glass-card">
      <h2>Teacher Registration</h2>
      <div className="mb-20">
        <label>Username</label>
        <input className="input-field" onChange={(e)=>setForm({...form, username:e.target.value})} />
      </div>
      <div className="mb-20">
        <label>School Name</label>
        <input className="input-field" onChange={(e)=>setForm({...form, schoolName:e.target.value})} />
      </div>
      <div className="mb-20">
        <label>Area / District</label>
        <input className="input-field" onChange={(e)=>setForm({...form, area:e.target.value})} />
      </div>
      <div className="mb-40">
        <label>Password</label>
        <input type="password" className="input-field" onChange={(e)=>setForm({...form, password:e.target.value})} />
      </div>
      <button className="btn btn-primary" style={{width:'100%'}} onClick={handleRegister}>Register</button>
      <p style={{marginTop:'20px', textAlign:'center', cursor:'pointer', color:'var(--primary)'}} onClick={onSwitchToLogin}>
        Already have an account? Login
      </p>
    </div>
  );
};

export default Register;