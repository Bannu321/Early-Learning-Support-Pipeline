import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeObservation } from '../data/api';

// --- THE 20-QUESTION BANK ---
const QUESTION_BANK = [
  // Page 1: Attention & Focus
  { id: 'q1', text: "Does the student struggle to maintain focus on a single task for more than 5 minutes?", options: [{val:1, label:"Rarely"}, {val:2, label:"Sometimes"}, {val:3, label:"Often"}] },
  { id: 'q2', text: "Is the student easily distracted by minor noises or movements in the classroom?", options: [{val:1, label:"No"}, {val:2, label:"Yes, Mildly"}, {val:3, label:"Yes, Significantly"}] },
  { id: 'q3', text: "Does the student forget instructions immediately after they are given?", options: [{val:1, label:"Rarely"}, {val:2, label:"Sometimes"}, {val:3, label:"Often"}] },
  { id: 'q4', text: "Does the student struggle to keep track of their personal belongings (pencils, books)?", options: [{val:1, label:"Organized"}, {val:2, label:"Messy"}, {val:3, label:"Frequently Loses Items"}] },
  { id: 'q5', text: "Does the student appear to be 'daydreaming' or zoned out frequently?", options: [{val:1, label:"Alert"}, {val:2, label:"Occasionally"}, {val:3, label:"Frequently"}] },

  // Page 2: Social & Communication
  { id: 'q6', text: "Does the student have difficulty waiting for their turn in games or conversation?", options: [{val:1, label:"Patient"}, {val:2, label:"Impatient"}, {val:3, label:"Disruptive"}] },
  { id: 'q7', text: "Does the student struggle to make eye contact when speaking?", options: [{val:1, label:"Normal"}, {val:2, label:"Avoids"}, {val:3, label:"Never"}] },
  { id: 'q8', text: "Is the student withdrawn or isolated during recess/break times?", options: [{val:1, label:"Social"}, {val:2, label:"Shy"}, {val:3, label:"Isolated"}] },
  { id: 'q9', text: "Does the student struggle to understand non-verbal cues (e.g., a teacher's frown)?", options: [{val:1, label:"Understand"}, {val:2, label:"Confused"}, {val:3, label:"Oblivious"}] },
  { id: 'q10', text: "Does the student exhibit aggressive behavior towards peers?", options: [{val:1, label:"Never"}, {val:2, label:"Rarely"}, {val:3, label:"Often"}] },

  // Page 3: Academic Skills (Reading/Writing)
  { id: 'q11', text: "Is the student's handwriting significantly messy or illegible compared to peers?", options: [{val:1, label:"Neat"}, {val:2, label:"Messy"}, {val:3, label:"Illegible"}] },
  { id: 'q12', text: "Does the student avoid reading aloud or show anxiety when asked to read?", options: [{val:1, label:"Confident"}, {val:2, label:"Hesitant"}, {val:3, label:"Avoidant/Anxious"}] },
  { id: 'q13', text: "Does the student confuse similar letters (b/d, p/q) frequently?", options: [{val:1, label:"No"}, {val:2, label:"Sometimes"}, {val:3, label:"Often"}] },
  { id: 'q14', text: "Does the student struggle to copy text from the blackboard?", options: [{val:1, label:"Fast"}, {val:2, label:"Slow"}, {val:3, label:"Unable/Incomplete"}] },
  { id: 'q15', text: "Does the student have difficulty with basic math concepts (counting, sorting)?", options: [{val:1, label:"On Track"}, {val:2, label:"Behind"}, {val:3, label:"Significant Gap"}] },

  // Page 4: Emotional & Motor
  { id: 'q16', text: "Does the student have frequent emotional outbursts or meltdowns?", options: [{val:1, label:"Rarely"}, {val:2, label:"Sometimes"}, {val:3, label:"Weekly/Daily"}] },
  { id: 'q17', text: "Does the student seem unusually clumsy or struggle with balance?", options: [{val:1, label:"Agile"}, {val:2, label:"Clumsy"}, {val:3, label:"Frequent Falls"}] },
  { id: 'q18', text: "Does the student struggle to hold a pencil correctly (fine motor grip)?", options: [{val:1, label:"Good Grip"}, {val:2, label:"Awkward"}, {val:3, label:"Cannot Hold"}] },
  { id: 'q19', text: "Is the student overly sensitive to loud noises or bright lights?", options: [{val:1, label:"No"}, {val:2, label:"Covers Ears"}, {val:3, label:"Distressed"}] },
  { id: 'q20', text: "Does the student show repetitive behaviors (rocking, tapping)?", options: [{val:1, label:"No"}, {val:2, label:"Mildly"}, {val:3, label:"Frequently"}] },
];

const PAGE_THEMES = [
  {
    title: "Attention & Focus",
    emoji: "🎯",
    bgGradient: "linear-gradient(135deg, #AED6F1 0%, #D6EAF8 100%)",
    bgImage: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1600&q=80",
    color: "#3498DB",
    decorativeShapes: [
      { size: '120px', color: 'rgba(174, 214, 241, 0.4)', top: '-30px', right: '10%' },
      { size: '90px', color: 'rgba(133, 193, 233, 0.3)', bottom: '20px', left: '5%' }
    ]
  },
  {
    title: "Social Skills",
    emoji: "👥",
    bgGradient: "linear-gradient(135deg, #85C1E9 0%, #AED6F1 100%)",
    bgImage: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=1600&q=80",
    color: "#2E86C1",
    decorativeShapes: [
      { size: '100px', color: 'rgba(174, 214, 241, 0.4)', top: '20px', left: '8%' },
      { size: '110px', color: 'rgba(93, 173, 226, 0.3)', bottom: '-20px', right: '12%' }
    ]
  },
  {
    title: "Learning Abilities",
    emoji: "📚",
    bgGradient: "linear-gradient(135deg, #D6EAF8 0%, #AED6F1 100%)",
    bgImage: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1600&q=80",
    color: "#5DADE2",
    decorativeShapes: [
      { size: '130px', color: 'rgba(133, 193, 233, 0.4)', top: '-40px', right: '5%' },
      { size: '95px', color: 'rgba(174, 214, 241, 0.3)', bottom: '30px', left: '10%' }
    ]
  },
  {
    title: "Physical & Emotional",
    emoji: "💪",
    bgGradient: "linear-gradient(135deg, #A8DADC 0%, #85C1E9 100%)",
    bgImage: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1600&q=80",
    color: "#1ABC9C",
    decorativeShapes: [
      { size: '105px', color: 'rgba(168, 218, 220, 0.4)', top: '15px', left: '6%' },
      { size: '120px', color: 'rgba(93, 173, 226, 0.3)', bottom: '-25px', right: '8%' }
    ]
  }
];

const ObservationForm = ({ onResult, teacherIdentity }) => {
  const [step, setStep] = useState('details'); // 'details' | 'questions'
  const [page, setPage] = useState(0); // Pagination index (0 to 3)
  const [loading, setLoading] = useState(false);
  
  const QUESTIONS_PER_PAGE = 5;

  const [details, setDetails] = useState({
    studentName: '',
    studentId: '',
    grade: ''
  });

  // Initialize state for all 20 questions
  const [responses, setResponses] = useState({});

  // Navigation Logic
  const handleNextPage = () => {
    // Validation: Ensure all questions on current page are answered
    const currentQuestions = QUESTION_BANK.slice(page * QUESTIONS_PER_PAGE, (page + 1) * QUESTIONS_PER_PAGE);
    const allAnswered = currentQuestions.every(q => responses[q.id]);
    
    if (!allAnswered) {
      alert("Please answer all questions on this page before proceeding.");
      return;
    }
    setPage(prev => prev + 1);
  };

  const handlePrevPage = () => setPage(prev => prev - 1);

  const handleSubmit = async () => {
    if (!details.studentName || !details.studentId) return alert("Please fill student details");
    
    setLoading(true);
    const payload = {
      details: {
        ...details,
        teacherId: teacherIdentity.teacherCode,
        schoolId: teacherIdentity.schoolName
      },
      responses
    };

    const result = await analyzeObservation(payload);
    setLoading(false);
    onResult(result);
  };

  // Render Logic
  const currentQuestions = QUESTION_BANK.slice(page * QUESTIONS_PER_PAGE, (page + 1) * QUESTIONS_PER_PAGE);
  const isLastPage = (page + 1) * QUESTIONS_PER_PAGE >= QUESTION_BANK.length;
  const currentTheme = PAGE_THEMES[page] || PAGE_THEMES[0];

  if (loading) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #AED6F1 0%, #85C1E9 50%, #5DADE2 100%)',
        borderRadius: '30px',
        margin: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'url("https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}>
        {/* Sky blue overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(174, 214, 241, 0.93) 0%, rgba(133, 193, 233, 0.93) 50%, rgba(93, 173, 226, 0.93) 100%)',
          zIndex: 0
        }} />
        
        {/* Pastel sky blue decorative circles */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(174, 214, 241, 0.4)',
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'rgba(133, 193, 233, 0.4)',
          zIndex: 1
        }} />
        
        <motion.div
          style={{
            textAlign: 'center',
            color: 'white',
            position: 'relative',
            zIndex: 2
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{ fontSize: '5rem', marginBottom: '20px' }}
          >
            🔄
          </motion.div>
          <h2 style={{ fontSize: '2rem', marginBottom: '10px', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>Analyzing Observations...</h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.95, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>Creating personalized support strategies</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
      
      {/* STEP 1: STUDENT DETAILS */}
      {step === 'details' && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'white',
            borderRadius: '30px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
            position: 'relative'
          }}
        >
          {/* Header with Sky Blue Pastel Gradient and Children Background */}
          <div style={{
            position: 'relative',
            height: '250px',
            background: 'linear-gradient(135deg, #AED6F1 0%, #D6EAF8 50%, #85C1E9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            backgroundImage: 'url("https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1600&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay'
          }}>
            {/* Sky blue overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(174, 214, 241, 0.92) 0%, rgba(214, 234, 248, 0.90) 50%, rgba(133, 193, 233, 0.92) 100%)',
              zIndex: 0
            }} />
            
            {/* Decorative pastel circles */}
            <div style={{
              position: 'absolute',
              top: '-30px',
              right: '10%',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'rgba(133, 193, 233, 0.4)',
              zIndex: 1
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-20px',
              left: '15%',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'rgba(174, 214, 241, 0.5)',
              zIndex: 1
            }} />
            <div style={{
              position: 'absolute',
              top: '30%',
              left: '5%',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(168, 218, 220, 0.4)',
              zIndex: 1
            }} />
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ fontSize: '4rem', marginBottom: '10px' }}
              >
                📝
              </motion.div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '10px', color: '#2E86C1', textShadow: '0 2px 5px rgba(255,255,255,0.8)' }}>
                Student Profile
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#3498DB', textShadow: '0 1px 3px rgba(255,255,255,0.8)' }}>
                Let's start by identifying the student
              </p>
            </motion.div>
          </div>

          {/* Form Content */}
          <div style={{ padding: '50px 40px' }}>
            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                fontWeight: '700',
                fontSize: '1rem',
                color: '#333'
              }}>
                Student Name <span style={{ color: '#3498DB' }}>*</span>
              </label>
              <input 
                className="input-field"
                placeholder="e.g. Rahul Verma"
                value={details.studentName}
                onChange={e => setDetails({...details, studentName: e.target.value})}
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  borderRadius: '15px',
                  border: '2px solid #e0e0e0',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3498DB'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '30px',
              marginBottom: '40px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '10px',
                  fontWeight: '700',
                  fontSize: '1rem',
                  color: '#333'
                }}>
                  Student ID <span style={{ color: '#3498DB' }}>*</span>
                </label>
                <input 
                  className="input-field"
                  placeholder="ST-123"
                  value={details.studentId}
                  onChange={e => setDetails({...details, studentId: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    borderRadius: '15px',
                    border: '2px solid #e0e0e0',
                    fontSize: '1.1rem',
                    transition: 'all 0.3s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3498DB'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '10px',
                  fontWeight: '700',
                  fontSize: '1rem',
                  color: '#333'
                }}>
                  Grade <span style={{ color: '#3498DB' }}>*</span>
                </label>
                <select 
                  className="input-field"
                  value={details.grade}
                  onChange={e => setDetails({...details, grade: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    borderRadius: '15px',
                    border: '2px solid #e0e0e0',
                    fontSize: '1.1rem',
                    transition: 'all 0.3s',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3498DB'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                >
                  <option value="">Select Grade</option>
                  {[1,2,3,4,5,6,7,8].map(g => (
                    <option key={g} value={g}>{g}th Grade</option>
                  ))}
                </select>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '18px',
                fontSize: '1.2rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #3498DB 0%, #2E86C1 100%)',
                border: 'none',
                borderRadius: '15px',
                color: 'white',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(52, 152, 219, 0.3)'
              }}
              onClick={() => {
                if (!details.studentName || !details.studentId || !details.grade) {
                  alert("Please fill all fields before continuing");
                  return;
                }
                setStep('questions');
              }}
            >
              Start Assessment 🚀
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: PAGINATED QUESTIONS */}
      {step === 'questions' && (
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'white',
              borderRadius: '30px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
              position: 'relative'
            }}
          >
            {/* Themed Header with Pastel Gradient and Children Background */}
            <div style={{
              position: 'relative',
              height: '200px',
              background: currentTheme.bgGradient,
              backgroundImage: `url("${currentTheme.bgImage}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundBlendMode: 'overlay',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {/* Gradient overlay for readability */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: currentTheme.bgGradient.replace(')', ', 0.92)').replace('linear-gradient', 'linear-gradient').replace('135deg,', '135deg, rgba(255,255,255,0) 0%,').replace('#', 'rgba(').replace(/([A-F0-9]{6})/g, (match) => {
                  const r = parseInt(match.substr(0,2), 16);
                  const g = parseInt(match.substr(2,2), 16);
                  const b = parseInt(match.substr(4,2), 16);
                  return `${r}, ${g}, ${b}, 0.92)`;
                }),
                zIndex: 0
              }} />
              
              {/* Decorative pastel shapes */}
              {currentTheme.decorativeShapes.map((shape, idx) => (
                <motion.div
                  key={idx}
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 3 + idx,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    position: 'absolute',
                    width: shape.size,
                    height: shape.size,
                    borderRadius: '50%',
                    background: shape.color,
                    top: shape.top,
                    bottom: shape.bottom,
                    left: shape.left,
                    right: shape.right,
                    zIndex: 1
                  }}
                />
              ))}
              
              <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: currentTheme.color }}>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ fontSize: '4rem', marginBottom: '10px', filter: 'drop-shadow(0 2px 4px rgba(255,255,255,0.8))' }}
                >
                  {currentTheme.emoji}
                </motion.div>
                <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '5px', textShadow: '0 2px 5px rgba(255,255,255,0.9)' }}>
                  {currentTheme.title}
                </h2>
                <p style={{ fontSize: '1rem', opacity: 0.9, textShadow: '0 1px 3px rgba(255,255,255,0.8)' }}>
                  Page {page + 1} of 4
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{
              padding: '0 40px',
              paddingTop: '30px'
            }}>
              <div style={{
                width: '100%',
                height: '12px',
                background: '#f0f0f0',
                borderRadius: '20px',
                overflow: 'hidden',
                marginBottom: '40px',
                position: 'relative'
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((page + 1) / 4) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  style={{
                    height: '100%',
                    background: `linear-gradient(90deg, ${currentTheme.color} 0%, ${currentTheme.color}99 100%)`,
                    borderRadius: '20px',
                    position: 'relative'
                  }}
                >
                  <motion.div
                    animate={{ x: [-10, 10, -10] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '20px',
                      height: '20px',
                      background: 'white',
                      borderRadius: '50%',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
                    }}
                  />
                </motion.div>
              </div>

              {/* Questions */}
              {currentQuestions.map((q, index) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    marginBottom: '35px',
                    padding: '25px',
                    background: '#f8f9ff',
                    borderRadius: '20px',
                    border: '2px solid #e8e9f3'
                  }}
                >
                  <p style={{
                    fontWeight: '700',
                    marginBottom: '15px',
                    fontSize: '1.05rem',
                    color: '#2c3e50',
                    lineHeight: '1.6'
                  }}>
                    <span style={{
                      display: 'inline-block',
                      width: '32px',
                      height: '32px',
                      background: currentTheme.color,
                      color: 'white',
                      borderRadius: '50%',
                      textAlign: 'center',
                      lineHeight: '32px',
                      marginRight: '12px',
                      fontWeight: '900'
                    }}>
                      {page * QUESTIONS_PER_PAGE + index + 1}
                    </span>
                    {q.text}
                  </p>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '12px'
                  }}>
                    {q.options.map((opt) => (
                      <motion.button
                        key={opt.label}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setResponses({...responses, [q.id]: opt.val})}
                        style={{
                          padding: '15px 20px',
                          borderRadius: '12px',
                          border: responses[q.id] === opt.val ? `3px solid ${currentTheme.color}` : '2px solid #ddd',
                          background: responses[q.id] === opt.val ? currentTheme.color : 'white',
                          color: responses[q.id] === opt.val ? 'white' : '#555',
                          cursor: 'pointer',
                          transition: '0.2s',
                          fontWeight: responses[q.id] === opt.val ? '700' : '600',
                          fontSize: '0.95rem',
                          boxShadow: responses[q.id] === opt.val ? `0 5px 15px ${currentTheme.color}40` : '0 2px 5px rgba(0, 0, 0, 0.05)'
                        }}
                      >
                        {responses[q.id] === opt.val && '✓ '}
                        {opt.label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Navigation */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '30px 40px 40px',
              borderTop: '2px solid #f0f0f0',
              marginTop: '20px'
            }}>
              <motion.button
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-secondary"
                onClick={page === 0 ? () => setStep('details') : handlePrevPage}
                style={{
                  padding: '15px 30px',
                  fontSize: '1.05rem',
                  fontWeight: '700',
                  background: 'white',
                  color: '#555',
                  border: '2px solid #ddd',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                ← Back
              </motion.button>
              
              {isLastPage ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  style={{
                    padding: '15px 40px',
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #1ABC9C 0%, #16A085 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(26, 188, 156, 0.3)'
                  }}
                >
                  Generate Report 📊
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary"
                  onClick={handleNextPage}
                  style={{
                    padding: '15px 40px',
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    background: `linear-gradient(135deg, ${currentTheme.color} 0%, ${currentTheme.color}cc 100%)`,
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    boxShadow: `0 10px 30px ${currentTheme.color}40`
                  }}
                >
                  Next Page →
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default ObservationForm;