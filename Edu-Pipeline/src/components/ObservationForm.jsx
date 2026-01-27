import React, { useState } from "react";
import { analyzeObservation } from "../data/api";

const ObservationForm = ({ onResult, teacherIdentity }) => {
  const [step, setStep] = useState(1); // Step 1: Details, Step 2: Questions
  const [loading, setLoading] = useState(false);

  // State for Metadata
  const [details, setDetails] = useState({
    teacherId: "T-CURRENT-USER", // Auto-filled in real app
    studentName: "",
    studentId: "",
    grade: "",
  });

  // State for Questions
  const [responses, setResponses] = useState({ q1: 1, q2: 1, q3: 1 });

  const questions = [
    {
      id: "q1",
      text: "How often does the student struggle to maintain focus?",
      options: [
        { val: 1, label: "Rarely" },
        { val: 2, label: "Sometimes" },
        { val: 3, label: "Often" },
      ],
    },
    {
      id: "q2",
      text: "Difficulty following multi-step instructions?",
      options: [
        { val: 1, label: "No" },
        { val: 2, label: "Occasionally" },
        { val: 3, label: "Yes" },
      ],
    },
    {
      id: "q3",
      text: "Peer interaction quality?",
      options: [
        { val: 1, label: "Healthy" },
        { val: 2, label: "Withdrawn" },
        { val: 3, label: "Aggressive" },
      ],
    },
  ];

  

  const handleSubmit = async () => {

    const payload = {
      details: {
        ...details,
        teacherId: teacherIdentity.teacherCode, // <--- AUTO FILL UNIQUE CODE
        schoolId: teacherIdentity.schoolName    // <--- AUTO FILL SCHOOL
      },
      responses
    };
    if (!details.studentName || !details.studentId)
      return alert("Please fill student details");

    setLoading(true);
    const result = await analyzeObservation(payload);
    setLoading(false);
    onResult(result);
  };

  if (loading)
    return <div className="center-text mt-40">Analyzing Data...</div>;

  return (
    <div className="glass-card">
      <div
        style={{
          marginBottom: "20px",
          borderBottom: "1px solid #eee",
          paddingBottom: "10px",
        }}
      >
        <h2 style={{ margin: 0 }}>
          {step === 1 ? "Step 1: Student Profile" : "Step 2: Observation"}
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          {step === 1
            ? "Identify who needs support."
            : "Answer based on classroom behavior."}
        </p>
      </div>

      {/* STEP 1: DETAILS */}
      {step === 1 && (
        <div>
          <div className="input-group mb-20">
            <label
              style={{ display: "block", marginBottom: "5px", fontWeight: 500 }}
            >
              Student Name
            </label>
            <input
              type="text"
              placeholder="e.g. Rahul Verma"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
              value={details.studentName}
              onChange={(e) =>
                setDetails({ ...details, studentName: e.target.value })
              }
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
            className="mb-40"
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: 500,
                }}
              >
                Student ID
              </label>
              <input
                type="text"
                placeholder="ST-123"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
                value={details.studentId}
                onChange={(e) =>
                  setDetails({ ...details, studentId: e.target.value })
                }
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: 500,
                }}
              >
                Grade/Class
              </label>
              <select
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
                value={details.grade}
                onChange={(e) =>
                  setDetails({ ...details, grade: e.target.value })
                }
              >
                <option value="">Select Grade</option>
                <option value="1">1st Grade</option>
                <option value="2">2nd Grade</option>
                <option value="3">3rd Grade</option>
                <option value="4">4th Grade</option>
                <option value="5">5th Grade</option>
              </select>
            </div>
          </div>

          <button
            className="btn btn-primary"
            style={{ width: "100%" }}
            onClick={() => setStep(2)}
          >
            Next: Observation Questions
          </button>
        </div>
      )}

      {/* STEP 2: QUESTIONS */}
      {step === 2 && (
        <div>
          {questions.map((q) => (
            <div key={q.id} className="mb-20">
              <p style={{ fontWeight: 500, marginBottom: "10px" }}>{q.text}</p>
              <div style={{ display: "flex", gap: "10px" }}>
                {q.options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() =>
                      setResponses({ ...responses, [q.id]: opt.val })
                    }
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #ddd",
                      background:
                        responses[q.id] === opt.val
                          ? "var(--primary)"
                          : "white",
                      color:
                        responses[q.id] === opt.val
                          ? "white"
                          : "var(--text-main)",
                      cursor: "pointer",
                      transition: "0.2s",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div style={{ display: "flex", gap: "10px", marginTop: "30px" }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)}>
              Back
            </button>
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={handleSubmit}
            >
              Generate Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObservationForm;
