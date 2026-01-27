import React, { useState } from 'react';
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

  if (loading) return <div className="center-text mt-40">Analyzing 20 data points...</div>;

  return (
    <div className="glass-card">
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <h2 style={{ margin: 0 }}>
          {step === 'details' ? "Step 1: Student Profile" : `Assessment: Page ${page + 1}/4`}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {step === 'details' ? "Identify who needs support." : "Select the option that best describes the student."}
        </p>
      </div>

      {/* STEP 1: STUDENT DETAILS */}
      {step === 'details' && (
        <div>
          <div className="input-group mb-20">
            <label style={{display:'block', marginBottom:'5px', fontWeight:500}}>Student Name</label>
            <input 
              className="input-field"
              placeholder="e.g. Rahul Verma"
              value={details.studentName}
              onChange={e => setDetails({...details, studentName: e.target.value})}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="mb-40">
            <div>
              <label style={{display:'block', marginBottom:'5px', fontWeight:500}}>Student ID</label>
              <input 
                className="input-field"
                placeholder="ST-123"
                value={details.studentId}
                onChange={e => setDetails({...details, studentId: e.target.value})}
              />
            </div>
            <div>
              <label style={{display:'block', marginBottom:'5px', fontWeight:500}}>Grade</label>
              <select 
                className="input-field"
                value={details.grade}
                onChange={e => setDetails({...details, grade: e.target.value})}
              >
                <option value="">Select</option>
                {[1,2,3,4,5,6,7,8].map(g => <option key={g} value={g}>{g}th Grade</option>)}
              </select>
            </div>
          </div>
          <button className="btn btn-primary" style={{width:'100%'}} onClick={() => setStep('questions')}>
            Start Assessment
          </button>
        </div>
      )}

      {/* STEP 2: PAGINATED QUESTIONS */}
      {step === 'questions' && (
        <div>
          {/* Progress Bar */}
          <div style={{width:'100%', height:'6px', background:'#eee', borderRadius:'3px', marginBottom:'30px'}}>
             <div style={{
               width: `${((page + 1) / 4) * 100}%`, 
               height:'100%', background:'var(--primary)', borderRadius:'3px', transition:'width 0.3s'
             }}></div>
          </div>

          {currentQuestions.map((q) => (
            <div key={q.id} className="mb-20">
              <p style={{ fontWeight: 500, marginBottom: '10px' }}>{q.id.replace('q','')}. {q.text}</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {q.options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => setResponses({...responses, [q.id]: opt.val})}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      background: responses[q.id] === opt.val ? 'var(--primary)' : 'white',
                      color: responses[q.id] === opt.val ? 'white' : 'var(--text-main)',
                      cursor: 'pointer',
                      transition: '0.2s',
                      fontWeight: responses[q.id] === opt.val ? 'bold' : 'normal',
                      fontSize: '0.9rem'
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div style={{ display:'flex', justifyContent:'space-between', marginTop:'30px' }}>
            <button 
              className="btn btn-secondary" 
              onClick={page === 0 ? () => setStep('details') : handlePrevPage}
            >
              Back
            </button>
            
            {isLastPage ? (
              <button className="btn btn-primary" onClick={handleSubmit}>Generate Report</button>
            ) : (
              <button className="btn btn-primary" onClick={handleNextPage}>Next Page</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ObservationForm;