import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import ObservationForm from './components/ObservationForm';
import ResultsDashboard from './components/ResultsDashboard';
import NgoDashboard from './components/NgoDashboard';
import Login from './components/Login';
import Register from './components/Register';
import TeacherDashboard from './components/TeacherDashboard';
import './App.css';

function App() {
  const [view, setView] = useState('landing'); 
  const [user, setUser] = useState(null); // STORES LOGGED IN TEACHER
  const [resultData, setResultData] = useState(null);


  

  // AUTH ACTIONS
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    if (userData.role === 'ngo') {
      setView('ngo');
    } else {
      setView('dashboard'); // CHANGE THIS from 'form' to 'dashboard'
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView('landing');
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
                {/* Conditional Header Display */}
                <span style={{color:'var(--text-main)', fontWeight:'bold'}}>
                  {user.role === 'ngo' ? `🏛 ${user.orgName}` : `👩‍🏫 ${user.username}`}
                </span>
                
                {/* Only NGOs see the Portal Link */}
                {user.role === 'ngo' && <span onClick={() => setView('ngo')}>Dashboard</span>}
                
                {/* Only Teachers see the Form Link */}
                {user.role === 'teacher' && <span onClick={() => setView('form')}>New Observation</span>}
                
                <>
                  {/* New Navigation Links for Teacher */}
                  <span onClick={() => setView('dashboard')}>My Classroom</span>
                  <span onClick={() => setView('form')} className="btn btn-primary" style={{color:'white', padding:'8px 15px', fontSize:'0.9rem'}}>
                    + New Student
                  </span>
                </>
              </>
            ) : (
            <>
              <span onClick={() => setView('login')}>Login</span>
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

        {/* PRIVATE VIEWS (Require User) */}
        {view === 'form' && user && (
          <ObservationForm 
            // PASS THE TEACHER ID DOWN TO THE FORM
            teacherIdentity={user} 
            onResult={(data) => { setResultData(data); setView('results'); }} 
          />
        )}
        
        {view === 'results' && <ResultsDashboard data={resultData} onReset={() => setView('form')} />}
        {view === 'ngo' && <NgoDashboard />}
        {/* NEW VIEW: Teacher Dashboard */}
        {view === 'dashboard' && user && (
          <TeacherDashboard 
            user={user} 
            onNewAssessment={() => setView('form')} 
          />
        )}

      </main>
    </div>
  );
}

export default App;