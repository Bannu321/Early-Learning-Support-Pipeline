import React from 'react';

const LandingPage = ({ onStart }) => {
  return (
    <div className="center-text" style={{ padding: '40px 0' }}>
      
      {/* Hero Section */}
      <h1 style={{ fontSize: '3.5rem', lineHeight: '1.2', marginBottom: '20px', color: '#2B2D42' }}>
        Early Insights for <br />
        <span style={{ color: 'var(--primary)' }}>Every Student</span>
      </h1>
      
      <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
        Identify learning needs and provide instant, ethical support strategies. 
        No medical diagnosis required—just observation.
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '80px' }}>
        <button className="btn btn-primary" onClick={onStart}>Get Started — It's Free</button>
        <button className="btn btn-secondary">Watch Demo</button>
      </div>

      {/* Visual Feature Cards (Like the image provided) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', textAlign: 'left' }}>
        <FeatureCard 
          icon="📝" 
          title="Observe Behavior" 
          desc="Answer 5 simple questions about student focus and interaction." 
        />
        <FeatureCard 
          icon="🧠" 
          title="Instant Logic" 
          desc="Our rule-engine calculates risk levels immediately without AI bias." 
        />
        <FeatureCard 
          icon="🤝" 
          title="Actionable Support" 
          desc="Get a list of classroom strategies to help the student today." 
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
    <div style={{ fontSize: '2rem', marginBottom: '15px' }}>{icon}</div>
    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>{title}</h3>
    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>{desc}</p>
  </div>
);

export default LandingPage;