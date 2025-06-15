import React, { useState, useEffect } from 'react';
import '../App.css';

function App() {
  // Toggle between "student" or "teacher" mode
  const [mode, setMode] = useState('student');

  // ----------- Student Mode States -----------
  const [studentName, setStudentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [testData, setTestData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  // ----------- Teacher Mode States -----------
  // Note: Added a "topic" field for auto-generation.
  const [newTest, setNewTest] = useState({ topic: '', title: '', category: '', difficulty: '', questions: [] });
  const [questionInput, setQuestionInput] = useState({ 
    question: '', 
    options: '', 
    correctAnswer: '', 
    explanation: '' 
  });
  const [testsList, setTestsList] = useState([]);

  // Fetch tests list from the backend
  const fetchTests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tests');
      const data = await response.json();
      setTestsList(data.tests);
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [mode]);

  /* -----------------------
     STUDENT MODE FUNCTIONS
  ------------------------*/

  // Start test by fetching randomized test data from the backend
  const startTest = async () => {
    if (studentName && parentEmail && selectedTestId) {
      try {
        const response = await fetch(`http://localhost:5000/api/test/${selectedTestId}`);
        const data = await response.json();
        setTestData(data.test);
        setAnswers(new Array(data.test.questions.length).fill(''));
        setTestStarted(true);
      } catch (error) {
        console.error('Error fetching test:', error);
      }
    } else {
      alert("Please enter student name, parent email, and select a test");
    }
  };

  // Calculate score when test is completed
  useEffect(() => {
    if (testCompleted && testData) {
      let correctCount = 0;
      testData.questions.forEach((q, index) => {
        if (answers[index] === q.correctAnswer) {
          correctCount++;
        }
      });
      setScore((correctCount / testData.questions.length) * 100);
    }
  }, [testCompleted, testData, answers]);

  const handleOptionSelect = (option) => {
    const newAns = [...answers];
    newAns[currentQuestion] = option;
    setAnswers(newAns);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < testData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setTestCompleted(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Send report (with PDF attached) via email
  const sendReport = async () => {
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });
    try {
      const reportData = {
        studentName,
        parentEmail,
        score,
        answers,
        testId: testData.id
      };
      const response = await fetch('http://localhost:5000/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });
      const data = await response.json();
      if(response.ok) {
        setSubmitMessage({ type: 'success', text: `Report sent successfully to ${parentEmail}` });
      } else {
        setSubmitMessage({ type: 'error', text: data.message || 'Failed to send report' });
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'Network error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* -----------------------
     TEACHER MODE FUNCTIONS
  ------------------------*/

  // Auto-generate a test using an external API based on the entered topic.
  // The backend endpoint (/api/generate-test) will call the external API with NEXT_PUBLIC_GROQ_API_KEY.
  const generateTestByTopic = async () => {
    if (!newTest.topic) {
      alert("Please enter a topic");
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/generate-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: newTest.topic })
      });
      const data = await response.json();
      if (data.success) {
        // Update newTest with generated test data
        setNewTest({ 
          ...newTest, 
          title: data.test.title,
          category: data.test.category,
          difficulty: data.test.difficulty,
          questions: data.test.questions
        });
        alert("Test generated successfully!");
      } else {
        alert(data.message || "Failed to generate test");
      }
    } catch (error) {
      console.error("Error generating test:", error);
      alert("Error generating test. Please try again.");
    }
  };

  // Manually add a new question
  const addQuestion = () => {
    const optionsArray = questionInput.options.split(',').map(opt => opt.trim());
    const newQuestion = {
      question: questionInput.question,
      options: optionsArray,
      correctAnswer: questionInput.correctAnswer,
      explanation: questionInput.explanation
    };
    setNewTest({ ...newTest, questions: [...newTest.questions, newQuestion] });
    setQuestionInput({ question: '', options: '', correctAnswer: '', explanation: '' });
  };

  // Create a new test (manual save to in-memory storage)
  const createTest = async () => {
    if (!newTest.title || newTest.questions.length === 0) {
      alert('Test must have a title and at least one question');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTest)
      });
      const data = await response.json();
      if (data.success) {
        alert('Test created successfully');
        setNewTest({ topic: '', title: '', category: '', difficulty: '', questions: [] });
        fetchTests();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error creating test:', error);
    }
  };

  // Teacher view with auto-generation capability
  const renderTeacher = () => (
    <div className="teacher-container">
      <h2>Teacher Test Builder</h2>
      
      <div className="form-group">
        <label>Topic:</label>
        <input
          type="text"
          placeholder="Enter a topic (e.g., Photosynthesis)"
          value={newTest.topic}
          onChange={(e) => setNewTest({ ...newTest, topic: e.target.value })}
        />
      </div>
      <button className="btn primary-btn" onClick={generateTestByTopic}>Generate Test by Topic</button>
      
      <hr />
      
      <div className="form-group">
        <label>Test Title:</label>
        <input
          type="text"
          placeholder="Enter test title"
          value={newTest.title}
          onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
        />
      </div>
      
      <div className="form-group">
        <label>Category:</label>
        <input
          type="text"
          placeholder="E.g., Science, History"
          value={newTest.category}
          onChange={(e) => setNewTest({ ...newTest, category: e.target.value })}
        />
      </div>
      
      <div className="form-group">
        <label>Difficulty:</label>
        <select
          value={newTest.difficulty}
          onChange={(e) => setNewTest({ ...newTest, difficulty: e.target.value })}
        >
          <option value="">Select Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      
      <h3>Add Question</h3>
      <div className="form-group">
        <label>Question:</label>
        <input
          type="text"
          placeholder="Enter your question here"
          value={questionInput.question}
          onChange={(e) => setQuestionInput({ ...questionInput, question: e.target.value })}
        />
      </div>
      
      <div className="form-group">
        <label>Options (comma-separated):</label>
        <input
          type="text"
          placeholder="Option A, Option B, Option C, Option D"
          value={questionInput.options}
          onChange={(e) => setQuestionInput({ ...questionInput, options: e.target.value })}
        />
      </div>
      
      <div className="form-group">
        <label>Correct Answer:</label>
        <input
          type="text"
          placeholder="Type the correct option exactly as entered"
          value={questionInput.correctAnswer}
          onChange={(e) => setQuestionInput({ ...questionInput, correctAnswer: e.target.value })}
        />
      </div>
      
      <div className="form-group">
        <label>Explanation:</label>
        <input
          type="text"
          placeholder="Explain why this answer is correct"
          value={questionInput.explanation}
          onChange={(e) => setQuestionInput({ ...questionInput, explanation: e.target.value })}
        />
      </div>
      
      <button className="btn secondary-btn" onClick={addQuestion}>Add Question</button>
      <button className="btn primary-btn" onClick={createTest}>Create Test</button>
      
      <h3>Current Test Questions ({newTest.questions.length})</h3>
      {newTest.questions.length > 0 ? (
        <ul>
          {newTest.questions.map((q, idx) => (
            <li key={idx}>
              <div>
                <strong>Q{idx + 1}:</strong> {q.question}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No questions added yet. Add some questions to create your test.</p>
      )}
      
      <h3>Existing Tests</h3>
      {testsList.length > 0 ? (
        <ul>
          {testsList.map(test => (
            <li key={test.id}>
              <div>
                <strong>{test.title}</strong> - {test.category} - {test.difficulty}
              </div>
              <div>
                <button onClick={() => alert('Edit functionality not implemented')}>Edit</button>
                <button onClick={async () => {
                  if (window.confirm("Are you sure you want to delete this test?")) {
                    try {
                      await fetch(`http://localhost:5000/api/tests/${test.id}`, { method: 'DELETE' });
                      fetchTests();
                    } catch (error) {
                      console.error('Error deleting test:', error);
                    }
                  }
                }}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tests available. Create your first test!</p>
      )}
    </div>
  );

  // Student view (unchanged)
  const renderStudent = () => (
    <div className="student-container">
      {!testStarted && !testData && (
        <div className="form-container">
          <h2>Student Registration & Test Selection</h2>
          <div className="form-group">
            <label>Student Name:</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Parent Email:</label>
            <input
              type="email"
              placeholder="parent@example.com"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Select Test:</label>
            <select
              value={selectedTestId || ''}
              onChange={(e) => setSelectedTestId(e.target.value)}
            >
              <option value="">Select a test</option>
              {testsList.map(test => (
                <option key={test.id} value={test.id}>
                  {test.title} ({test.category}, {test.difficulty})
                </option>
              ))}
            </select>
          </div>
          <button className="btn primary-btn" onClick={startTest}>Start Test</button>
        </div>
      )}
      
      {testStarted && testData && !testCompleted && (
        <div className="question-container">
          <div className="progress-bar" style={{ 
            height: '8px', 
            backgroundColor: '#1365dc', 
            borderRadius: '4px',
            marginBottom: '20px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${((currentQuestion + 1) / testData.questions.length) * 100}%`,
              backgroundColor: '#1365dc',
              height: '100%',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          
          <h2>Question {currentQuestion + 1} of {testData.questions.length}</h2>
          <div className="question">
            <p>{testData.questions[currentQuestion].question}</p>
          </div>
          
          <div className="options">
            {testData.questions[currentQuestion].options.map((option, idx) => (
              <div 
                key={idx} 
                className="option"
                style={{
                  borderLeft: answers[currentQuestion] === option ? '4px solid #4a6fa5' : '1px solid #e0e0e0'
                }}
              >
                <label>
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    checked={answers[currentQuestion] === option}
                    onChange={() => handleOptionSelect(option)}
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
          
          <div className="navigation">
            <button
              className="btn secondary-btn"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
            >
              ← Previous
            </button>
            <button
              className="btn primary-btn"
              onClick={handleNextQuestion}
            >
              {currentQuestion === testData.questions.length - 1 ? 'Finish Test' : 'Next →'}
            </button>
          </div>
        </div>
      )}
      
      {testCompleted && testData && (
        <div className="results-container">
          <h2>Test Completed</h2>
          
          <div className="student-info">
            <p>Student: <strong>{studentName}</strong></p>
            <p>Test: <strong>{testData.title}</strong></p>
            <p>Score: <strong style={{
              color: score >= 70 ? '#5cb85c' : score >= 50 ? '#f0ad4e' : '#d9534f'
            }}>{score.toFixed(1)}%</strong></p>
          </div>
          
          <div className="results-summary">
            <h3>Results Summary:</h3>
            {testData.questions.map((q, idx) => (
              <div key={idx} className="result-item">
                <p className="question-text">
                  <strong>Question {idx + 1}:</strong> {q.question}
                </p>
                <p className={answers[idx] === q.correctAnswer ? 'correct' : 'incorrect'}>
                  <strong>Your answer:</strong> {answers[idx] || 'Not answered'} 
                  {answers[idx] === q.correctAnswer ? ' ✓' : ' ✗'}
                </p>
                <p className="correct-answer">
                  <strong>Correct answer:</strong> {q.correctAnswer}
                </p>
                <p className="explanation">
                  <strong>Explanation:</strong> {q.explanation || 'No explanation provided.'}
                </p>
              </div>
            ))}
          </div>
          
          {submitMessage.text && (
            <div className={`message ${submitMessage.type}`}>
              {submitMessage.text}
            </div>
          )}
          
          <div className="actions">
            <button
              className="btn primary-btn"
              onClick={sendReport}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Report to Parent'}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div 
      style={{ 
        backgroundColor: '#2e6ac1', 
        minHeight: '100vh', 
        padding: '2rem' 
      }}
    >
      <div 
        className="app"
        style={{
          backgroundColor: '#ffffff',
          maxWidth: '1200px',
          margin: '0 auto',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
          padding: '2rem'
        }}
      >
        <header>
          <h1>Student Testing System</h1>
          <div className="mode-toggle">
            <button 
              className={mode === 'student' ? 'active' : ''} 
              onClick={() => setMode('student')}
            >
              Student Mode
            </button>
            <button 
              className={mode === 'teacher' ? 'active' : ''} 
              onClick={() => setMode('teacher')}
            >
              Teacher Mode
            </button>
          </div>
        </header>
        
        <main>
          {mode === 'teacher' ? renderTeacher() : renderStudent()}
        </main>
      </div>
    </div>
  );
}

export default App;
