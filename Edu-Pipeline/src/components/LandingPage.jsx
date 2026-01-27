import React from 'react';

const LandingPage = ({ onStart }) => {
  return (
    <div>
      {/* --- HERO SECTION --- */}
      <div className="center-text" style={{ padding: '80px 20px 60px' }}>
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

        {/* Feature Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', textAlign: 'left', maxWidth: '1000px', margin: '0 auto' }}>
          <FeatureCard icon="📝" title="Observe Behavior" desc="Answer 20 simple questions about student focus and interaction." />
          <FeatureCard icon="🧠" title="Clinical Logic" desc="Our rule-engine calculates risk levels immediately without bias." />
          <FeatureCard icon="🤝" title="Actionable Support" desc="Get a list of classroom strategies to help the student today." />
        </div>
      </div>

      {/* --- NEW: CONTACT US SECTION (Happy Children Background) --- */}
      <div style={{ 
        marginTop: '100px', 
        position: 'relative', 
        padding: '80px 20px',
        borderRadius: '20px',
        overflow: 'hidden',
        color: 'white',
        textAlign: 'center'
      }}>
        {/* Background Image Layer */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: 'url("https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")', // Happy kids image
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -2
        }}></div>
        {/* Blue Overlay Layer (for readability) */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(93, 95, 239, 0.85)', // var(--primary) with opacity
          zIndex: -1
        }}></div>

        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Partner with Us</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '40px', opacity: 0.9 }}>
            Are you an NGO or School District looking to implement this system? 
            Let's build a brighter future together.
          </p>

          <form style={{ background: 'white', padding: '30px', borderRadius: '12px', color: '#333', textAlign: 'left' }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Organization Name</label>
              <input type="text" placeholder="e.g. Hope Foundation" style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #ddd' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Email Address</label>
              <input type="email" placeholder="contact@org.com" style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #ddd' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Message</label>
              <textarea placeholder="How can we help?" style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #ddd', height: '80px' }}></textarea>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={(e) => { e.preventDefault(); alert("Message Sent!"); }}>
              Send Message to NGO Team
            </button>
          </form>
        </div>
      </div>

      {/* --- NEW: FOOTER --- */}
      <footer style={{ marginTop: '60px', borderTop: '1px solid #ddd', paddingTop: '40px', paddingBottom: '40px', color: '#555' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* Column 1: About */}
          <div>
            <h4 style={{ color: 'var(--primary)', marginBottom: '15px' }}>About ELS Pipeline</h4>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              We bridge the gap between classroom observation and professional intervention. 
              Our mission is to ensure no student falls behind due to undiagnosed learning needs.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ color: '#333', marginBottom: '15px' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem', lineHeight: '2' }}>
              <li>For Teachers</li>
              <li>For NGOs</li>
              <li>Methodology</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 style={{ color: '#333', marginBottom: '15px' }}>Helpline & Support</h4>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
              <strong>NGO Care Number:</strong><br/>
              <span style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 'bold' }}>+91 1800-HELP-KID</span>
              <br/><br/>
              <strong>Email Support:</strong><br/>
              support@elspipeline.org
            </div>
          </div>

        </div>
        <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '0.8rem', color: '#999' }}>
          © 2024 Early Learning Support Pipeline. Built for Social Good.
        </div>
      </footer>
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