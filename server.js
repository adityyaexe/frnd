// FRIENSHIP-DAY-CARDS/server.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ✅ Enhanced CORS: Allow all localhost/127.0.0.1 with dynamic port support
const corsOptions = {
  origin: (origin, callback) => {
    const allowed = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5000',
      'http://127.0.0.1:5000'
    ];

    // Allow development (no origin = file://)
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable preflight for all routes

app.use(express.json({ limit: '10mb' }));

// 🔗 MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://ac61431:meowtom1816@frnd-cluster.ss1xyap.mongodb.net/friendshipdb?retryWrites=true&w=majority';

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// 📝 Answer Schema (No enum, flexible answer)
const answerSchema = new mongoose.Schema(
  {
    quizTitle: { type: String, default: 'Tom Friendship Quiz', trim: true },
    answers: [
      {
        question: { type: String, required: true, trim: true },
        answer: { type: String, required: true, trim: true }, // Flexible: "Yes", "No", or text
      },
    ],
    userName: { type: String, default: 'Anonymous Friend', trim: true },
    userAgent: { type: String },
    submittedAt: { type: Date, default: Date.now },
  },
  { collection: 'answers', versionKey: false }
);

const Answer = mongoose.model('Answer', answerSchema);

// ✅ POST: Submit answers
app.post('/api/submit', async (req, res) => {
  try {
    const { answers, userName, quizTitle } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: 'Answers must be a non-empty array' });
    }

    if (
      !answers.every(
        (a) =>
          typeof a.question === 'string' &&
          a.question.trim().length > 0 &&
          typeof a.answer === 'string' &&
          a.answer.trim().length > 0
      )
    ) {
      return res.status(400).json({
        message: 'Each answer must have a valid question and non-empty answer',
      });
    }

    const newAnswer = new Answer({
      quizTitle: quizTitle || 'Tom Friendship Quiz',
      answers,
      userName: userName ? userName.trim() : undefined,
      userAgent: req.get('User-Agent'),
    });

    await newAnswer.save();

    console.log(`📩 Saved answers from: ${userName || 'Anonymous'} | ID: ${newAnswer._id}`);
    res.status(201).json({ message: 'Answers saved!', id: newAnswer._id });
  } catch (err) {
    console.error('💾 Save error:', err.message || err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 🔐 GET: View all answers
app.get('/api/answers', async (req, res) => {
  try {
    const results = await Answer.find({}, '-__v').sort({ submittedAt: -1 }).limit(1000);
    res.json(results);
  } catch (err) {
    console.error('❌ Fetch failed:', err.message);
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
});

// 🏁 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(``);
  console.log(`🚀 Backend server running at http://localhost:${PORT}`);
  console.log(`📌 API: POST http://localhost:${PORT}/api/submit`);
  console.log(`🔍 View: GET http://localhost:${PORT}/api/answers`);
  console.log(`✅ CORS allowed: localhost:3000, 5173, 5000, and 127.0.0.1 variants`);
  console.log(``);
});

// Graceful error handling
process.on('unhandledRejection', (err) => {
  console.error('🚫 Unhandled Rejection:', err.message);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('🚫 Uncaught Exception:', err.message);
  process.exit(1);
});