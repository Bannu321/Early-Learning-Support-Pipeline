import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTeacherHistory } from '../data/api';

const TeacherDashboard = ({ user, onNewAssessment }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [celebrations, setCelebrations] = useState([]);

  // Child-friendly color palette
  const colors = {
    primary: '#FF6B8B', // Pink
    secondary: '#FFD166', // Yellow
    accent1: '#06D6A0', // Green
    accent2: '#118AB2', // Blue
    accent3: '#EF476F', // Coral
    light: '#FFE5EC', // Light pink
    background: '#FFF9F2', // Cream
    success: '#06D6A0', // Green
    warning: '#FFD166', // Yellow
    danger: '#EF476F' // Coral
  };

  useEffect(() => {
    getTeacherHistory(user.teacherCode).then(data => {
      setStudents(data);
      setLoading(false);
      
      // Add celebration for new assessments
      if (data.length > 0) {
        const newAssessments = data.filter(s => 
          new Date(s.createdAt).toDateString() === new Date().toDateString()
        );
        newAssessments.forEach(() => {
          addCelebration();
        });
      }
    });
  }, [user.teacherCode]);

  const getRiskColor = (level) => {
    if (level === 'High') return colors.danger;
    if (level === 'Medium') return colors.warning;
    return colors.success;
  };

  const getRiskEmoji = (level) => {
    if (level === 'High') return '⚠️';
    if (level === 'Medium') return '🔍';
    return '✅';
  };

  const getRiskLabel = (level) => {
    if (level === 'High') return 'Needs Support';
    if (level === 'Medium') return 'Watch Closely';
    return 'Doing Great!';
  };

  const addCelebration = () => {
    const newCelebration = {
      id: Date.now(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      emoji: ['🎉', '✨', '⭐', '🏆', '🎈'][Math.floor(Math.random() * 5)]
    };
    setCelebrations(prev => [...prev, newCelebration]);
    setTimeout(() => {
      setCelebrations(prev => prev.filter(c => c.id !== newCelebration.id));
    }, 2000);
  };

  const StudentDetailModal = ({ student, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '30px',
          padding: '40px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          background: `${getRiskColor(student.riskLevel)}20`,
          borderRadius: '50%'
        }} />
        
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: colors.primary
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontSize: '4rem' }}
          >
            👤
          </motion.div>
          <h2 style={{ 
            fontSize: '2rem', 
            color: colors.primary,
            margin: '10px 0'
          }}>
            {student.studentName}
          </h2>
          <div style={{
            display: 'inline-block',
            padding: '8px 20px',
            background: `${getRiskColor(student.riskLevel)}20`,
            color: getRiskColor(student.riskLevel),
            borderRadius: '20px',
            fontWeight: 'bold'
          }}>
            Grade {student.grade}
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '15px'
          }}>
            <span style={{ fontWeight: 'bold', color: '#666' }}>Progress Level</span>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                padding: '8px 20px',
                background: getRiskColor(student.riskLevel),
                color: 'white',
                borderRadius: '20px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {getRiskEmoji(student.riskLevel)} {getRiskLabel(student.riskLevel)}
            </motion.div>
          </div>

          <div style={{
            height: '20px',
            background: '#f0f0f0',
            borderRadius: '10px',
            overflow: 'hidden',
            marginBottom: '5px'
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${student.riskLevel === 'High' ? '85' : student.riskLevel === 'Medium' ? '60' : '30'}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{
                height: '100%',
                background: `linear-gradient(90deg, ${getRiskColor(student.riskLevel)} 0%, ${getRiskColor(student.riskLevel)}80 100%)`,
                borderRadius: '10px'
              }}
            />
          </div>
        </div>

        <div style={{
          background: `${colors.light}`,
          padding: '20px',
          borderRadius: '20px',
          marginBottom: '30px'
        }}>
          <h4 style={{ 
            color: colors.accent2,
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            📝 Recommendations
          </h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {student.recommendations?.map((rec, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                style={{ marginBottom: '10px', color: '#666' }}
              >
                {rec}
              </motion.li>
            )) || [
              "Provide positive reinforcement frequently",
              "Break tasks into smaller steps",
              "Use visual aids when explaining concepts"
            ].map((rec, idx) => (
              <li key={idx} style={{ marginBottom: '10px', color: '#666' }}>{rec}</li>
            ))}
          </ul>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '15px',
              background: colors.secondary,
              border: 'none',
              borderRadius: '15px',
              color: '#333',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            📋 Action Plan
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '15px',
              background: colors.accent1,
              border: 'none',
              borderRadius: '15px',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            💬 Share Progress
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto',
      padding: '20px',
      background: colors.background,
      minHeight: '100vh',
      fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif'
    }}>
      {/* Celebrations */}
      <AnimatePresence>
        {celebrations.map(celebration => (
          <motion.div
            key={celebration.id}
            initial={{ y: celebration.y, x: celebration.x, opacity: 1, scale: 0 }}
            animate={{ y: celebration.y - 100, opacity: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            style={{
              position: 'fixed',
              fontSize: '2rem',
              pointerEvents: 'none',
              zIndex: 1000
            }}
          >
            {celebration.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Student Detail Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <StudentDetailModal 
            student={selectedStudent} 
            onClose={() => setSelectedStudent(null)} 
          />
        )}
      </AnimatePresence>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '40px',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            style={{ fontSize: '3rem', display: 'inline-block', marginRight: '15px' }}
          >
            👩‍🏫
          </motion.div>
          <div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              marginBottom: '5px',
              color: colors.primary,
              textShadow: `2px 2px 0 ${colors.secondary}`
            }}>
              My Classroom
            </h1>
            <motion.p
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ 
                color: colors.accent2,
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
            >
              🏫 {user.schoolName}
            </motion.p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewAssessment}
          style={{
            padding: '18px 40px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent3} 100%)`,
            border: 'none',
            borderRadius: '25px',
            color: 'white',
            cursor: 'pointer',
            boxShadow: `0 10px 30px ${colors.primary}50`,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            ✨
          </motion.span>
          + New Assessment
        </motion.button>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '25px', 
          marginBottom: '50px' 
        }}
      >
        {[
          { 
            value: students.length, 
            label: 'Total Students', 
            emoji: '👥',
            color: colors.primary,
            description: 'Students in your class'
          },
          { 
            value: students.filter(s => s.riskLevel === 'High').length, 
            label: 'Need Support', 
            emoji: '⚠️',
            color: colors.danger,
            description: 'Require immediate attention'
          },
          { 
            value: students.filter(s => s.riskLevel === 'Medium').length, 
            label: 'Watch Closely', 
            emoji: '🔍',
            color: colors.warning,
            description: 'Monitor regularly'
          },
          { 
            value: students.filter(s => s.riskLevel === 'Low').length, 
            label: 'Doing Great!', 
            emoji: '✅',
            color: colors.success,
            description: 'On track and thriving'
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -10, scale: 1.02 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            style={{ 
              background: 'white',
              padding: '30px',
              borderRadius: '25px',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
              border: `5px solid ${stat.color}20`,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                width: '80px',
                height: '80px',
                background: `${stat.color}10`,
                borderRadius: '50%'
              }}
            />
            
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
              style={{ fontSize: '3rem', marginBottom: '15px' }}
            >
              {stat.emoji}
            </motion.div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: index * 0.1 + 0.3 }}
              style={{ 
                fontSize: '3rem', 
                margin: '10px 0',
                color: stat.color,
                fontWeight: '900'
              }}
            >
              {stat.value}
            </motion.div>
            
            <div style={{ 
              fontSize: '1.2rem', 
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '5px'
            }}>
              {stat.label}
            </div>
            
            <div style={{ 
              fontSize: '0.9rem', 
              color: '#666',
              opacity: 0.8
            }}>
              {stat.description}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Student List */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '25px' 
        }}>
          <h3 style={{ 
            fontSize: '1.8rem', 
            color: colors.accent2,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            📋 Recent Assessments
          </h3>
          
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              padding: '10px 20px',
              background: `${colors.accent2}20`,
              borderRadius: '15px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: colors.accent2
            }}
          >
            Total: {students.length} students
          </motion.div>
        </div>
      
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ 
              textAlign: 'center', 
              padding: '80px 20px',
              background: 'white',
              borderRadius: '25px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{ fontSize: '4rem', marginBottom: '20px' }}
            >
              ⏳
            </motion.div>
            <p style={{ fontSize: '1.2rem', color: colors.accent2 }}>Loading classroom data...</p>
          </motion.div>
        ) : students.length === 0 ? (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            style={{ 
              background: 'white', 
              padding: '60px 40px', 
              borderRadius: '30px',
              textAlign: 'center',
              boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
              border: `3px dashed ${colors.secondary}`
            }}
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ fontSize: '5rem', marginBottom: '20px' }}
            >
              📚
            </motion.div>
            <h4 style={{ fontSize: '1.5rem', color: colors.primary, marginBottom: '15px' }}>
              No students assessed yet
            </h4>
            <p style={{ color: '#666', marginBottom: '30px' }}>
              Start your first assessment to see student progress here
            </p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="btn btn-primary"
              onClick={onNewAssessment}
              style={{
                padding: '15px 40px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                background: colors.accent1,
                border: 'none',
                borderRadius: '25px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              🚀 Start First Assessment
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ 
              background: 'white',
              borderRadius: '30px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch'
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'separate',
                borderSpacing: 0
              }}>
                <thead style={{ 
                  background: `linear-gradient(135deg, ${colors.accent2} 0%, ${colors.primary} 100%)`,
                  color: 'white'
                }}>
                  <tr>
                    <th style={{ 
                      padding: '25px 20px', 
                      textAlign: 'left',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      borderRight: '2px solid rgba(255,255,255,0.1)'
                    }}>
                      👤 Student Name
                    </th>
                    <th style={{ 
                      padding: '25px 20px', 
                      textAlign: 'left',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      borderRight: '2px solid rgba(255,255,255,0.1)'
                    }}>
                      🎓 Grade
                    </th>
                    <th style={{ 
                      padding: '25px 20px', 
                      textAlign: 'left',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      borderRight: '2px solid rgba(255,255,255,0.1)'
                    }}>
                      📊 Progress Level
                    </th>
                    <th style={{ 
                      padding: '25px 20px', 
                      textAlign: 'left',
                      fontSize: '1rem',
                      fontWeight: 'bold'
                    }}>
                      📅 Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <motion.tr
                      key={student._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ 
                        scale: 1.01,
                        backgroundColor: `${getRiskColor(student.riskLevel)}08`
                      }}
                      onClick={() => setSelectedStudent(student)}
                      style={{ 
                        cursor: 'pointer',
                        borderBottom: '2px solid #f5f5f5',
                        transition: 'all 0.3s'
                      }}
                    >
                      <td style={{ 
                        padding: '25px 20px',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: '#333'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '50%',
                              background: `linear-gradient(135deg, ${getRiskColor(student.riskLevel)} 0%, ${getRiskColor(student.riskLevel)}80 100%)`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '1.2rem'
                            }}
                          >
                            {student.studentName.charAt(0)}
                          </motion.div>
                          {student.studentName}
                        </div>
                      </td>
                      <td style={{ 
                        padding: '25px 20px',
                        fontSize: '1.1rem',
                        color: '#666'
                      }}>
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          style={{
                            display: 'inline-block',
                            padding: '8px 20px',
                            background: `${colors.secondary}20`,
                            borderRadius: '20px',
                            fontWeight: 'bold',
                            color: colors.secondary
                          }}
                        >
                          Grade {student.grade}
                        </motion.div>
                      </td>
                      <td style={{ padding: '25px 20px' }}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          style={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 20px',
                            background: `${getRiskColor(student.riskLevel)}15`,
                            color: getRiskColor(student.riskLevel),
                            borderRadius: '20px',
                            fontWeight: 'bold',
                            fontSize: '0.9rem'
                          }}
                        >
                          <motion.span
                            animate={{ rotate: student.riskLevel === 'High' ? [0, 10, -10, 0] : 0 }}
                            transition={{ duration: 1, repeat: student.riskLevel === 'High' ? Infinity : 0 }}
                          >
                            {getRiskEmoji(student.riskLevel)}
                          </motion.span>
                          {getRiskLabel(student.riskLevel)}
                        </motion.div>
                      </td>
                      <td style={{ 
                        padding: '25px 20px',
                        color: '#888',
                        fontSize: '1rem'
                      }}>
                        <motion.div
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          {new Date(student.createdAt).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </motion.div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div style={{
              padding: '25px',
              background: '#f9f9f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '3px solid #f0f0f0'
            }}>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>
                👆 Click on any student to view details
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNewAssessment}
                style={{
                  padding: '12px 30px',
                  background: colors.primary,
                  border: 'none',
                  borderRadius: '20px',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                + Add Another Student
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{
          marginTop: '60px',
          padding: '40px',
          background: `linear-gradient(135deg, ${colors.light} 0%, white 100%)`,
          borderRadius: '30px',
          border: `5px dashed ${colors.secondary}`,
          textAlign: 'center'
        }}
      >
        <h3 style={{ 
          fontSize: '1.8rem', 
          color: colors.accent2,
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '15px'
        }}>
          ⚡ Quick Actions
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {[
            { icon: '📊', label: 'View Reports', color: colors.accent1 },
            { icon: '📧', label: 'Contact Parents', color: colors.accent2 },
            { icon: '🎯', label: 'Set Goals', color: colors.primary },
            { icon: '👥', label: 'Team Meeting', color: colors.accent3 }
          ].map((action, index) => (
            <motion.button
              key={index}
              whileHover={{ y: -5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '25px',
                background: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '15px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                style={{ fontSize: '2.5rem' }}
              >
                {action.icon}
              </motion.div>
              <span style={{ 
                fontSize: '1rem', 
                fontWeight: 'bold',
                color: action.color
              }}>
                {action.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherDashboard;