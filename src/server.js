const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const axios = require('axios');
const { createCanvas } = require('canvas'); // Added for chart generation

const app = express();

app.use(cors());
app.use(express.json());

// In-memory storage for tests
let tests = [];
let testIdCounter = 1;

// Directly using the GROQ API key (hardcoded)
const GROQ_API_KEY = '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';

// Email configuration using Gmail (hardcoded credentials)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'advay.dhule221@vit.edu',  // <-- Replace with your Gmail
      pass: 'pluv ecmb thzw dger'      // <-- Replace with your app-specific password or credentials
    }
  });
};

/* ===============================
   Teacher Endpoints: Test Builder
   =============================== */

// Get all tests
app.get('/api/tests', (req, res) => {
  res.status(200).json({ tests });
});

// Auto-generate a test by topic using GROQ API
app.post('/api/generate-test', async (req, res) => {
  const { topic, numQuestions = 5, difficulty = 'medium' } = req.body;
  
  if (!topic) {
    return res.status(400).json({ success: false, message: 'Missing topic field' });
  }

  try {
    // Prepare the prompt for GROQ API
    const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    
    const systemPrompt = `You are an educational test generator. Create a multiple-choice test on the topic provided.
    Each question should have 4 options (A, B, C, D) with exactly one correct answer and an explanation.`;
    
    const userPrompt = `Generate a ${difficulty} difficulty test with ${numQuestions} multiple-choice questions about "${topic}".
    Return the response as a JSON object with this structure:
    {
      "title": "Test title",
      "category": "Subject category",
      "difficulty": "${difficulty}",
      "questions": [
        {
          "question": "Question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "The correct option (exact text)",
          "explanation": "Explanation of the correct answer"
        }
      ]
    }`;

    const response = await axios.post(
      apiUrl, 
      {
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Extract the generated test content
    const generatedContent = response.data.choices[0].message.content;
    
    // Parse the JSON response
    let testData;
    try {
      // Find JSON content in the response (in case there's additional text)
      const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        testData = JSON.parse(jsonMatch[0]);
      } else {
        testData = JSON.parse(generatedContent);
      }
    } catch (parseError) {
      console.error("Error parsing generated content:", parseError);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to parse generated test data",
        error: parseError.message,
        rawContent: generatedContent
      });
    }

    // Create and save the new test
    const newTest = {
      id: testIdCounter++,
      title: testData.title || `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Test on ${topic}`,
      category: testData.category || topic,
      difficulty: testData.difficulty || difficulty,
      questions: testData.questions || []
    };

    // Validate the test structure
    if (!Array.isArray(newTest.questions) || newTest.questions.length === 0) {
      return res.status(500).json({ 
        success: false, 
        message: "Generated test doesn't have valid questions", 
        generatedData: testData 
      });
    }

    // Add the test to our collection
    tests.push(newTest);
    
    // Return the newly created test
    res.status(200).json({ success: true, test: newTest });
    
  } catch (error) {
    console.error("Error generating test:", error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: "Failed to generate test", 
      error: error.response?.data || error.message 
    });
  }
});

// Create a new test (manual creation)
app.post('/api/tests', (req, res) => {
  const { title, category, difficulty, questions } = req.body;
  if (!title || !questions || !Array.isArray(questions)) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  const newTest = {
    id: testIdCounter++,
    title,
    category,
    difficulty,
    questions // each question includes: question, options, correctAnswer, explanation
  };
  tests.push(newTest);
  res.status(201).json({ success: true, test: newTest });
});

// Update a test
app.put('/api/tests/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tests.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Test not found' });
  }
  const { title, category, difficulty, questions } = req.body;
  tests[index] = { ...tests[index], title, category, difficulty, questions };
  res.status(200).json({ success: true, test: tests[index] });
});

// Delete a test
app.delete('/api/tests/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tests.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Test not found' });
  }
  tests.splice(index, 1);
  res.status(200).json({ success: true, message: 'Test deleted' });
});

/* =====================================
   Student Endpoints & Randomization
   ===================================== */

// Serve a test (with randomized question and option order)
app.get('/api/test/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const test = tests.find(t => t.id === id);
  if (!test) {
    return res.status(404).json({ success: false, message: 'Test not found' });
  }
  // Clone test and randomize order
  const randomizedTest = { ...test };
  randomizedTest.questions = test.questions.slice();
  // Randomize questions
  randomizedTest.questions.sort(() => Math.random() - 0.5);
  // Randomize options for each question
  randomizedTest.questions = randomizedTest.questions.map(q => {
    const optionsCopy = q.options.slice();
    optionsCopy.sort(() => Math.random() - 0.5);
    return { ...q, options: optionsCopy };
  });
  res.status(200).json({ test: randomizedTest });
});

/* =====================================
   Chart Generation Helper Functions
   ===================================== */

// Function to generate a pie chart showing correct vs incorrect answers
const generatePieChart = (correctCount, totalQuestions) => {
  const canvas = createCanvas(400, 300);
  const ctx = canvas.getContext('2d');
  
  // Set up the chart
  const centerX = 200;
  const centerY = 150;
  const radius = 100;
  
  // Calculate percentages
  const correctPercentage = (correctCount / totalQuestions) * 100;
  const incorrectPercentage = 100 - correctPercentage;
  
  // Draw the pie slices
  // Correct answers slice (green)
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2 * (correctCount / totalQuestions));
  ctx.fillStyle = '#27ae60'; // Green
  ctx.fill();
  
  // Incorrect answers slice (red)
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, Math.PI * 2 * (correctCount / totalQuestions), Math.PI * 2);
  ctx.fillStyle = '#e74c3c'; // Red
  ctx.fill();
  
  // Add title label on the chart
  ctx.font = '14px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.fillText('Performance Analysis', centerX, 40);
  
  // Add legend
  ctx.font = '12px Arial';
  ctx.fillStyle = '#27ae60';
  ctx.fillRect(centerX - 90, centerY + 120, 15, 15);
  ctx.fillStyle = 'black';
  ctx.textAlign = 'left';
  ctx.fillText(`Correct (${correctPercentage.toFixed(1)}%)`, centerX - 70, centerY + 132);
  
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(centerX + 20, centerY + 120, 15, 15);
  ctx.fillStyle = 'black';
  ctx.fillText(`Incorrect (${incorrectPercentage.toFixed(1)}%)`, centerX + 40, centerY + 132);
  
  return canvas.toBuffer('image/png');
};

// Function to generate a simple bar chart showing understanding levels
const generateUnderstandingChart = (answers, questions) => {
  const canvas = createCanvas(500, 400);
  const ctx = canvas.getContext('2d');
  
  // Create a map of topics/concepts and how well they were understood
  const conceptAnalysis = {};
  
  // Analyze each question for concept understanding
  questions.forEach((question, index) => {
    // Use provided "concept" field or default to 'General'
    const concept = question.concept || 'General';
    
    if (!conceptAnalysis[concept]) {
      conceptAnalysis[concept] = { correct: 0, total: 0 };
    }
    
    const isCorrect = answers[index] === question.correctAnswer;
    conceptAnalysis[concept].total += 1;
    if (isCorrect) conceptAnalysis[concept].correct += 1;
  });
  
  // Convert to array for charting
  const concepts = Object.keys(conceptAnalysis);
  const scores = concepts.map(concept => 
    (conceptAnalysis[concept].correct / conceptAnalysis[concept].total) * 100
  );
  
  // Draw the chart background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 500, 400);
  
  ctx.font = '14px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.fillText('Understanding Level by Concept', 250, 30);
  
  // Draw bars for each concept
  const barWidth = 60;
  const startX = 80;
  const startY = 350;
  
  concepts.forEach((concept, index) => {
    const barHeight = scores[index] * 2.5; // Scale the bar height to fit
    const x = startX + (index * (barWidth + 20));
    
    // Draw the bar
    ctx.fillStyle = '#3498db';
    ctx.fillRect(x, startY - barHeight, barWidth, barHeight);
    
    // Draw the value on top of the bar
    ctx.fillStyle = '#2980b9';
    ctx.textAlign = 'center';
    ctx.fillText(`${scores[index].toFixed(1)}%`, x + barWidth / 2, startY - barHeight - 10);
    
    // Draw the concept label below the bar
    ctx.fillStyle = 'black';
    ctx.fillText(concept, x + barWidth / 2, startY + 20);
  });
  
  // Draw Y-axis lines and labels
  ctx.beginPath();
  ctx.moveTo(60, 50);
  ctx.lineTo(60, startY);
  ctx.lineTo(450, startY);
  ctx.strokeStyle = '#888';
  ctx.stroke();
  
  ctx.textAlign = 'right';
  for (let i = 0; i <= 100; i += 20) {
    const y = startY - (i * 2.5);
    ctx.fillText(`${i}%`, 55, y + 5);
    
    ctx.beginPath();
    ctx.moveTo(60, y);
    ctx.lineTo(450, y);
    ctx.strokeStyle = '#ddd';
    ctx.stroke();
  }
  
  return canvas.toBuffer('image/png');
};

/* =====================================
   Send Report with PDF Attachment
   ===================================== */
app.post('/api/send-report', async (req, res) => {
  const { studentName, parentEmail, score, answers, testId } = req.body;
  const test = tests.find(t => t.id === testId);

  if (!studentName || !parentEmail || !test || !Array.isArray(answers)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required fields or test not found' 
    });
  }

  try {
    // Calculate the number of correct answers
    const correctCount = answers.filter((answer, index) => 
      answer === test.questions[index].correctAnswer
    ).length;
    
    // Generate charts using the provided answers and test questions
    const pieChartBuffer = generatePieChart(correctCount, test.questions.length);
    const understandingChartBuffer = generateUnderstandingChart(answers, test.questions);
    
    // Generate base64 strings for embedding in the email HTML
    const pieChartBase64 = pieChartBuffer.toString('base64');
    const understandingChartBase64 = understandingChartBuffer.toString('base64');

    // Build HTML email content with embedded charts
    let emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
          .header { background-color: #3498db; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .score { font-size: 18px; font-weight: bold; margin: 20px 0; }
          .question { margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
          .correct { color: #27ae60; }
          .incorrect { color: #e74c3c; }
          .explanation { font-style: italic; font-size: 14px; color: #555; }
          .chart-container { text-align: center; margin: 30px 0; }
          .chart-title { font-weight: bold; margin-bottom: 10px; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>Test Results for ${studentName}</h2>
        </div>
        <div class="content">
          <p>Dear Parent,</p>
          <p>Here are the test results for ${studentName}:</p>
          <div class="score">
            Score: ${score.toFixed(2)}%
          </div>
          
          <div class="chart-container">
            <div class="chart-title">Performance Overview</div>
            <img src="data:image/png;base64,${pieChartBase64}" alt="Performance Overview" style="max-width: 100%;">
          </div>
          
          <div class="chart-container">
            <div class="chart-title">Understanding Level by Concept</div>
            <img src="data:image/png;base64,${understandingChartBase64}" alt="Understanding Level" style="max-width: 100%;">
          </div>
          
          <h3>Question Details:</h3>
    `;

    test.questions.forEach((q, index) => {
      const isCorrect = answers[index] === q.correctAnswer;
      emailContent += `
        <div class="question">
          <p><strong>Question ${index + 1}:</strong> ${q.question}</p>
          <p>
            <strong>Your answer:</strong>
            <span class="${isCorrect ? 'correct' : 'incorrect'}">
              ${answers[index] || 'Not answered'}
            </span>
          </p>
          <p><strong>Correct answer:</strong> <span class="correct">${q.correctAnswer}</span></p>
          <p class="explanation"><strong>Explanation:</strong> ${q.explanation || 'No explanation provided.'}</p>
        </div>
      `;
    });

    emailContent += `
          <p>Please review these results with your child.</p>
          <p>Thank you,</p>
          <p>The Testing System Team</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </body>
      </html>
    `;

    // Generate PDF in memory using PDFKit
    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', chunk => buffers.push(chunk));

    // When PDF generation is finished, send the email with the PDF attached
    doc.on('end', async () => {
      const pdfData = Buffer.concat(buffers);

      const transporter = createTransporter();
      const mailOptions = {
        from: `"Testing System" <advay.dhule221@vit.edu>`,
        to: parentEmail,
        subject: `Test Results for ${studentName}`,
        html: emailContent,
        attachments: [
          {
            filename: 'TestReport.pdf',
            content: pdfData,
            contentType: 'application/pdf'
          }
        ]
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      res.status(200).json({ success: true, message: 'Report sent successfully', messageId: info.messageId });
    });

    // ----- Start PDF content generation -----
    // Page 1: Enhanced Header, Test & Student Details, and Performance Summary
    doc.fontSize(20).text(`Test Results for ${studentName}`, { align: 'center' });
    doc.moveDown();
    // Test meta-information
    doc.fontSize(14).text(`Test Title: ${test.title}`, { align: 'center' });
    doc.fontSize(12).text(`Category: ${test.category} | Difficulty: ${test.difficulty}`, { align: 'center' });
    doc.moveDown();
    // Date and Time
    const currentDate = new Date();
    doc.fontSize(12).text(`Date: ${currentDate.toLocaleDateString()}   Time: ${currentDate.toLocaleTimeString()}`, { align: 'center' });
    doc.moveDown();
    // Performance summary
    doc.fontSize(16).text(`Score: ${score.toFixed(2)}%`, { align: 'center' });
    doc.fontSize(12).text(`Correct Answers: ${correctCount} out of ${test.questions.length}`, { align: 'center' });
    doc.moveDown();
    // Motivational comment
    let comment = '';
    if (score >= 80) {
      comment = 'Excellent work!';
    } else if (score >= 50) {
      comment = 'Good job, but there is room for improvement.';
    } else {
      comment = 'Keep practicing and you will get better!';
    }
    doc.fontSize(14).text(comment, { align: 'center', underline: true });
    doc.moveDown();

    // Page 2: Pie Chart (Performance Overview)
    doc.addPage();
    doc.fontSize(16).text('Performance Overview', { align: 'center' });
    const pieY = doc.y + 20;
    const pageWidth = doc.page.width;
    doc.image(pieChartBuffer, (pageWidth - 400) / 2, pieY, { width: 400, height: 300 });
    
    // Page 3: Bar Chart (Understanding Level by Concept)
    doc.addPage();
    doc.fontSize(16).text('Understanding Level by Concept', { align: 'center' });
    const barY = doc.y + 20;
    doc.image(understandingChartBuffer, (pageWidth - 500) / 2, barY, { width: 500, height: 400 });
    
    // Page 4: Question Details
    doc.addPage();
    doc.fontSize(16).text('Question Details', { align: 'left' });
    doc.moveDown();
    
    test.questions.forEach((q, index) => {
      const isCorrect = answers[index] === q.correctAnswer;
      doc.fontSize(12).fillColor('black')
         .text(`Question ${index + 1}: ${q.question}`);
      doc.text(`Your answer: ${answers[index] || 'Not answered'} (${isCorrect ? 'Correct' : 'Incorrect'})`);
      doc.fillColor('green')
         .text(`Correct answer: ${q.correctAnswer}`);
      doc.fillColor('black')
         .text(`Explanation: ${q.explanation || 'No explanation provided.'}`);
      doc.moveDown();
    });

    // Finalize PDF creation
    doc.end();
    
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send report', error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
