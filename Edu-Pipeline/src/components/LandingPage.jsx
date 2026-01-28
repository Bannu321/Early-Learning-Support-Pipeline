import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

const LandingPage = ({ onStart }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [clickedShape, setClickedShape] = useState(null);
  const [confetti, setConfetti] = useState([]);
  const audioRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Child-friendly color palette
  const colors = {
    primary: '#FF6B8B', // Pink
    secondary: '#FFD166', // Yellow
    accent1: '#06D6A0', // Green
    accent2: '#118AB2', // Blue
    accent3: '#EF476F', // Coral
    light: '#FFE5EC', // Light pink
    background: '#FFF9F2' // Cream
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleShapeClick = (shapeType) => {
    setClickedShape(shapeType);
    
    // Create confetti effect
    const newConfetti = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight - 100,
      color: [colors.primary, colors.secondary, colors.accent1, colors.accent2][
        Math.floor(Math.random() * 4)
      ],
      size: Math.random() * 20 + 10,
      rotation: Math.random() * 360
    }));
    setConfetti(newConfetti);

    // Play sound if enabled
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log("Audio play prevented"));
    }

    setTimeout(() => setClickedShape(null), 1000);
    setTimeout(() => setConfetti([]), 2000);
  };

  const animalCharacters = [
    { emoji: '🦊', name: 'Foxy', color: colors.accent3 },
    { emoji: '🐻', name: 'Buddy', color: colors.secondary },
    { emoji: '🐰', name: 'Bunny', color: colors.light },
    { emoji: '🐯', name: 'Tiger', color: colors.primary },
    { emoji: '🐼', name: 'Panda', color: colors.accent2 }
  ];

  return (
    <div style={{ 
      position: 'relative', 
      overflow: 'hidden',
      backgroundColor: colors.background,
      fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif'
    }}>
      {/* Audio for interactions */}
      <audio 
        ref={audioRef} 
        src="https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3" 
        preload="auto"
      />
      
      {/* Sound Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setSoundEnabled(!soundEnabled)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          background: colors.secondary,
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {soundEnabled ? '🔊' : '🔇'}
      </motion.button>

      {/* Interactive Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden'
      }}>
        {/* Interactive Floating Shapes */}
        <InteractiveShape 
          color={colors.primary} 
          size={120} 
          delay={0} 
          top="10%" 
          left="5%"
          onClick={() => handleShapeClick('circle')}
          type="circle"
        />
        <InteractiveShape 
          color={colors.secondary} 
          size={80} 
          delay={1} 
          top="60%" 
          left="85%"
          onClick={() => handleShapeClick('triangle')}
          type="triangle"
        />
        <InteractiveShape 
          color={colors.accent1} 
          size={100} 
          delay={0.5} 
          top="80%" 
          left="10%"
          onClick={() => handleShapeClick('star')}
          type="star"
        />
        <InteractiveShape 
          color={colors.accent2} 
          size={60} 
          delay={1.5} 
          top="30%" 
          left="90%"
          onClick={() => handleShapeClick('heart')}
          type="heart"
        />
        
        {/* Bouncing Animals */}
        {animalCharacters.map((animal, index) => (
          <BouncingAnimal
            key={index}
            animal={animal}
            index={index}
            onClick={() => handleShapeClick(animal.name)}
          />
        ))}

        {/* Confetti */}
        {confetti.map((piece) => (
          <motion.div
            key={piece.id}
            initial={{
              x: piece.x,
              y: piece.y,
              opacity: 1,
              rotate: 0
            }}
            animate={{
              y: piece.y + 200,
              opacity: 0,
              rotate: piece.rotation + 360
            }}
            transition={{ duration: 2 }}
            style={{
              position: 'absolute',
              fontSize: piece.size,
              color: piece.color,
              pointerEvents: 'none',
              zIndex: 999
            }}
          >
            {['✨', '⭐', '🎉', '🎊'][Math.floor(Math.random() * 4)]}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <div style={{ 
          padding: '80px 20px 60px', 
          position: 'relative',
          background: `linear-gradient(135deg, ${colors.light} 0%, #fff 50%, ${colors.primary}20 100%)`,
          borderBottom: `10px dotted ${colors.secondary}`,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          
          <div style={{ maxWidth: '1200px', width: '100%' }}>
            {/* Animated Title */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 10,
                delay: 0.2
              }}
              style={{
                textAlign: 'center',
                marginBottom: '40px'
              }}
            >
              <h1 style={{
                fontSize: 'clamp(3rem, 8vw, 5rem)',
                marginBottom: '20px',
                fontWeight: '900',
                color: colors.primary,
                textShadow: `3px 3px 0 ${colors.secondary}`,
                letterSpacing: '-0.02em',
                WebkitTextStroke: '1px white'
              }}>
                Welcome to 
                <br />
                <span style={{
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent3} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Learning Land!
                </span>
              </h1>
              
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{
                  fontSize: '4rem',
                  display: 'inline-block',
                  margin: '0 20px'
                }}
              >
                🎡
              </motion.div>
            </motion.div>

            {/* Character Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{
                background: 'white',
                padding: '30px',
                borderRadius: '30px',
                boxShadow: `0 20px 40px ${colors.primary}20`,
                marginBottom: '40px',
                border: `5px solid ${colors.secondary}`
              }}
            >
              <h3 style={{
                color: colors.accent2,
                fontSize: '1.8rem',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                🤝 Meet Our Friendly Guides!
              </h3>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                flexWrap: 'wrap'
              }}>
                {animalCharacters.map((animal, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      textAlign: 'center',
                      padding: '15px',
                      background: `${animal.color}20`,
                      borderRadius: '20px',
                      cursor: 'pointer',
                      border: `3px solid ${animal.color}`
                    }}
                    onClick={() => handleShapeClick(animal.name)}
                  >
                    <div style={{ fontSize: '3rem' }}>{animal.emoji}</div>
                    <div style={{
                      fontWeight: 'bold',
                      color: animal.color,
                      marginTop: '10px'
                    }}>{animal.name}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Interactive Game Preview */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              style={{
                textAlign: 'center',
                marginBottom: '50px'
              }}
            >
              <h3 style={{
                color: colors.accent1,
                fontSize: '1.5rem',
                marginBottom: '30px'
              }}>
                🎮 Let's Play a Quick Game!
              </h3>
              
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                flexWrap: 'wrap'
              }}>
                <MemoryGame />
                <DragDropGame />
              </div>
            </motion.div>

            {/* Main CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              style={{ textAlign: 'center' }}
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  rotate: [0, -5, 5, 0],
                  transition: { rotate: { duration: 0.5 } }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={onStart}
                style={{
                  padding: '25px 50px',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent3} 100%)`,
                  border: 'none',
                  borderRadius: '50px',
                  color: 'white',
                  cursor: 'pointer',
                  boxShadow: `0 10px 30px ${colors.primary}50`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <span style={{ position: 'relative', zIndex: 1 }}>
                  🚀 Start Your Adventure!
                </span>
                <motion.div
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.8 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(90deg, transparent, #ffffff40, transparent)`
                  }}
                />
              </motion.button>
              
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  marginTop: '20px',
                  color: colors.accent2,
                  fontSize: '1.1rem'
                }}
              >
                Click the shapes and animals for surprises! 🎉
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* Features Section with Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            padding: '80px 20px',
            background: `linear-gradient(135deg, ${colors.accent2} 0%, ${colors.primary} 100%)`,
            position: 'relative',
            clipPath: 'polygon(0 5%, 100% 0, 100% 95%, 0 100%)'
          }}
        >
          <h2 style={{
            textAlign: 'center',
            color: 'white',
            fontSize: '2.8rem',
            marginBottom: '60px',
            textShadow: '2px 2px 0 rgba(0,0,0,0.2)'
          }}>
            🌟 What You'll Discover!
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {[
              { 
                icon: '🎨', 
                title: 'Colorful Learning', 
                desc: 'Learn through fun games and colorful activities',
                bgColor: colors.secondary
              },
              { 
                icon: '🎵', 
                title: 'Music & Sounds', 
                desc: 'Interactive sounds make learning exciting',
                bgColor: colors.accent1
              },
              { 
                icon: '🧩', 
                title: 'Puzzle Games', 
                desc: 'Solve puzzles while learning new things',
                bgColor: colors.accent3
              },
              { 
                icon: '🏆', 
                title: 'Earn Rewards', 
                desc: 'Collect stars and badges for your progress',
                bgColor: colors.primary
              }
            ].map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </motion.div>

        {/* Interactive Quiz Section */}
        <InteractiveQuizSection colors={colors} />

        {/* Footer */}
        <footer style={{
          padding: '60px 20px 30px',
          background: colors.accent2,
          color: 'white',
          textAlign: 'center'
        }}>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ fontSize: '3rem', marginBottom: '20px' }}
          >
            🎈
          </motion.div>
          
          <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
            Made with ❤️ for every child's learning journey
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            marginBottom: '30px'
          }}>
            {['🛡️', '👨‍👩‍👧‍👦', '🌈', '🎨'].map((emoji, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.5 }}
                style={{ fontSize: '2rem', cursor: 'pointer' }}
              >
                {emoji}
              </motion.div>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
};

// Enhanced Interactive Shape Component
const InteractiveShape = ({ color, size, delay, top, left, onClick, type }) => {
  const [isClicked, setIsClicked] = useState(false);
  
  const getShape = () => {
    switch(type) {
      case 'triangle':
        return {
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          borderRadius: '0'
        };
      case 'star':
        return {
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          borderRadius: '0'
        };
      case 'heart':
        return {
          clipPath: 'polygon(50% 15%, 100% 0%, 100% 65%, 50% 100%, 0% 65%, 0% 0%)',
          borderRadius: '0'
        };
      default:
        return { borderRadius: '50%' };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.3, 0.6, 0.3],
        scale: isClicked ? [1, 1.5, 1] : [1, 1.2, 1],
        y: [0, -40, 0],
        rotate: [0, 180, 360]
      }}
      transition={{
        duration: 8,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      whileHover={{ scale: 1.3 }}
      whileTap={{ scale: 0.8 }}
      onClick={() => {
        setIsClicked(true);
        onClick();
        setTimeout(() => setIsClicked(false), 1000);
      }}
      style={{
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        background: color,
        ...getShape(),
        top: top,
        left: left,
        filter: 'blur(1px)',
        cursor: 'pointer',
        pointerEvents: 'auto',
        opacity: 0.6,
        boxShadow: `0 0 20px ${color}`
      }}
    />
  );
};

// Bouncing Animal Component
const BouncingAnimal = ({ animal, index, onClick }) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ 
        y: [0, -100, 0],
        x: [0, 50, 0]
      }}
      transition={{
        duration: 3 + index * 0.5,
        repeat: Infinity,
        delay: index * 0.3,
        ease: "easeInOut"
      }}
      whileHover={{ scale: 1.5 }}
      whileTap={{ scale: 0.8 }}
      onClick={onClick}
      style={{
        position: 'absolute',
        top: `${30 + index * 15}%`,
        left: `${20 + index * 10}%`,
        fontSize: '2.5rem',
        cursor: 'pointer',
        pointerEvents: 'auto',
        filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,0.2))'
      }}
    >
      {animal.emoji}
    </motion.div>
  );
};

// Memory Game Component
const MemoryGame = () => {
  const [cards, setCards] = useState([
    { id: 1, emoji: '🐶', flipped: false, matched: false },
    { id: 2, emoji: '🐱', flipped: false, matched: false },
    { id: 3, emoji: '🐶', flipped: false, matched: false },
    { id: 4, emoji: '🐱', flipped: false, matched: false },
  ]);
  const [flipped, setFlipped] = useState([]);

  const handleCardClick = (id) => {
    if (flipped.length >= 2) return;
    
    const newCards = cards.map(card => 
      card.id === id ? { ...card, flipped: true } : card
    );
    setCards(newCards);
    
    if (flipped.length === 1) {
      setTimeout(() => {
        const firstCard = cards.find(c => c.id === flipped[0]);
        const secondCard = cards.find(c => c.id === id);
        
        if (firstCard.emoji === secondCard.emoji) {
          setCards(cards.map(card => 
            card.emoji === firstCard.emoji 
              ? { ...card, matched: true } 
              : card
          ));
        } else {
          setCards(cards.map(card => 
            card.id === flipped[0] || card.id === id
              ? { ...card, flipped: false }
              : card
          ));
        }
        setFlipped([]);
      }, 1000);
    } else {
      setFlipped([id]);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      style={{
        padding: '20px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}
    >
      <h4 style={{ marginBottom: '15px', color: '#FF6B8B' }}>Memory Match</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        {cards.map(card => (
          <motion.div
            key={card.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => !card.matched && handleCardClick(card.id)}
            style={{
              width: '60px',
              height: '60px',
              background: card.flipped || card.matched ? '#FFD166' : '#FFE5EC',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              cursor: 'pointer',
              transformStyle: 'preserve-3d',
              transform: card.flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: 'transform 0.6s'
            }}
          >
            {card.flipped || card.matched ? card.emoji : '❓'}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Drag & Drop Game Component
const DragDropGame = () => {
  const [items, setItems] = useState([
    { id: 1, emoji: '🍎', category: 'food' },
    { id: 2, emoji: '🚗', category: 'vehicle' },
    { id: 3, emoji: '🐶', category: 'animal' },
    { id: 4, emoji: '🏠', category: 'place' }
  ]);
  const [boxes, setBoxes] = useState({
    food: [],
    vehicle: [],
    animal: [],
    place: []
  });

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('item', JSON.stringify(item));
  };

  const handleDrop = (e, category) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData('item'));
    
    if (item.category === category) {
      setBoxes(prev => ({
        ...prev,
        [category]: [...prev[category], item]
      }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      style={{
        padding: '20px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}
    >
      <h4 style={{ marginBottom: '15px', color: '#06D6A0' }}>Sort the Items</h4>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {items.map(item => (
          <motion.div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            whileHover={{ scale: 1.2 }}
            style={{
              padding: '10px',
              background: '#EF476F20',
              borderRadius: '10px',
              cursor: 'grab',
              fontSize: '1.5rem'
            }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '20px' }}>
        {Object.entries(boxes).map(([category, items]) => (
          <div
            key={category}
            onDrop={(e) => handleDrop(e, category)}
            onDragOver={handleDragOver}
            style={{
              padding: '20px',
              background: '#118AB220',
              borderRadius: '10px',
              minHeight: '80px'
            }}
          >
            <div style={{ fontSize: '0.9rem', color: '#118AB2', marginBottom: '10px' }}>
              {category.toUpperCase()}
            </div>
            {items.map((item, idx) => (
              <span key={idx} style={{ fontSize: '1.5rem', marginRight: '5px' }}>
                {item.emoji}
              </span>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, desc, bgColor }) => (
  <motion.div
    whileHover={{ y: -15, scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    style={{
      background: 'white',
      padding: '30px',
      borderRadius: '25px',
      textAlign: 'center',
      boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '100px',
        height: '100px',
        background: `${bgColor}20`,
        borderRadius: '50%'
      }}
    />
    
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      style={{ fontSize: '3.5rem', marginBottom: '20px' }}
    >
      {icon}
    </motion.div>
    
    <h3 style={{
      fontSize: '1.5rem',
      color: '#333',
      marginBottom: '15px',
      fontWeight: 'bold'
    }}>
      {title}
    </h3>
    
    <p style={{ color: '#666', lineHeight: '1.6' }}>
      {desc}
    </p>
  </motion.div>
);

// Interactive Quiz Section
const InteractiveQuizSection = ({ colors }) => {
  const questions = [
    {
      question: "Which animal says 'meow'?",
      options: ['🐶', '🐱', '🐮', '🐦'],
      answer: '🐱'
    },
    {
      question: "What color is the sun?",
      options: ['🔵', '🟡', '🟢', '🔴'],
      answer: '🟡'
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (answer) => {
    if (answer === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  return (
    <div style={{
      padding: '80px 20px',
      background: `linear-gradient(135deg, ${colors.light} 0%, #fff 100%)`,
      textAlign: 'center'
    }}>
      <h2 style={{
        color: colors.primary,
        fontSize: '2.5rem',
        marginBottom: '40px'
      }}>
        🧠 Quick Quiz Time!
      </h2>

      {!showResult ? (
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            maxWidth: '500px',
            margin: '0 auto',
            background: 'white',
            padding: '40px',
            borderRadius: '30px',
            boxShadow: `0 20px 40px ${colors.primary}20`
          }}
        >
          <h3 style={{ color: colors.accent2, marginBottom: '30px' }}>
            {questions[currentQuestion].question}
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
            {questions[currentQuestion].options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleAnswer(option)}
                style={{
                  padding: '20px',
                  fontSize: '2rem',
                  background: colors.secondary,
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            background: 'white',
            padding: '40px',
            borderRadius: '30px',
            maxWidth: '500px',
            margin: '0 auto'
          }}
        >
          <h3 style={{ color: colors.accent1, fontSize: '2rem' }}>
            🎉 Quiz Complete!
          </h3>
          <p style={{ fontSize: '1.2rem', margin: '20px 0' }}>
            You scored {score} out of {questions.length}!
          </p>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2 }}
            style={{ fontSize: '3rem' }}
          >
            {score === questions.length ? '🏆' : '⭐'}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default LandingPage;