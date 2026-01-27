import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import ObservationForm from './components/ObservationForm';
import ResultsDashboard from './components/ResultsDashboard';
import NgoDashboard from './components/NgoDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
  // 1. SESSION PERSISTENCE FIX: 
  // Initialize state by checking LocalStorage first
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('els_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Decide initial view based on whether user is logged in
  const [view, setView] = useState(() => {
    if (localStorage.getItem('els_user')) {
      const savedUser = JSON.parse(localStorage.getItem('els_user'));
      return savedUser.role === 'ngo' ? 'ngo' : 'dashboard';
    }
    return 'landing';
  });

  const [resultData, setResultData] = useState(null);

  // 2. SAVE TO STORAGE ON LOGIN
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('els_user', JSON.stringify(userData)); // <--- SAVE
    
    if (userData.role === 'ngo') {
      setView('ngo');
    } else {
      setView('dashboard');
    }
  };

  // 3. CLEAR STORAGE ON LOGOUT
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('els_user'); // <--- CLEAR
    setView('landing');
  };

  const handleFormResult = (data) => {
    setResultData(data);
    setView('results');
  };

  return (
    <div className="main-wrapper">
      <nav className="navbar">
        <div className="logo" onClick={() => setView('landing')} style={{cursor:'pointer'}}>
          <span>🟣 ELS Pipeline</span>
        </div>
        
        <div className="nav-links">
          {user ? (
            <>
              {/* 4. NAVIGATION FIX: CLICKABLE NAME */}
              <span 
                onClick={() => setView(user.role === 'ngo' ? 'ngo' : 'dashboard')}
                style={{
                  color: 'var(--text-main)', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',       // <--- Shows hand icon
                  borderBottom: '2px solid transparent',
                  marginRight: '20px'
                }}
                onMouseOver={(e) => e.target.style.borderBottom = '2px solid var(--primary)'}
                onMouseOut={(e) => e.target.style.borderBottom = 'transparent'}
              >
                {user.role === 'ngo' ? `🏛 ${user.orgName}` : `👩‍🏫 ${user.username}`}
              </span>

              {/* Context Links */}
              {user.role === 'ngo' && (
                <span onClick={() => setView('ngo')} style={{cursor:'pointer'}}>Dashboard</span>
              )}
              {user.role === 'teacher' && (
                <>
                  <span onClick={() => setView('dashboard')} style={{cursor:'pointer'}}>My Classroom</span>
                  <span onClick={() => setView('form')} className="btn btn-primary" style={{color:'white', padding:'8px 15px', fontSize:'0.9rem'}}>
                    + New Student
                  </span>
                </>
              )}
              
              <span onClick={handleLogout} style={{color:'var(--risk-high)', cursor:'pointer', marginLeft:'20px'}}>Logout</span>
            </>
          ) : (
            <>
              <span onClick={() => setView('login')} style={{cursor:'pointer'}}>Login</span>
              <span onClick={() => setView('register')} className="btn btn-primary" style={{color:'white', padding:'8px 20px'}}>
                Sign Up
              </span>
            </>
          )}
        </div>
      </nav>

      <main>
        {/* PUBLIC VIEWS */}
        {view === 'landing' && <LandingPage onStart={() => setView(user ? 'form' : 'login')} />}
        {view === 'login' && <Login onLoginSuccess={handleLoginSuccess} onSwitchToRegister={()=>setView('register')} />}
        {view === 'register' && <Register onSwitchToLogin={()=>setView('login')} />}

        {/* PRIVATE VIEWS */}
        {view === 'dashboard' && user && (
          <TeacherDashboard user={user} onNewAssessment={() => setView('form')} />
        )}

        {view === 'form' && user && (
          <ObservationForm 
            teacherIdentity={user} 
            onResult={handleFormResult} 
          />
        )}
        
        {view === 'results' && <ResultsDashboard data={resultData} onReset={() => setView('dashboard')} />}
        {view === 'ngo' && <NgoDashboard />}
      </main>
    </div>
  );
}

export default App;